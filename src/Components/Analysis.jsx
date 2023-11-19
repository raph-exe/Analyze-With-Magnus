import { Chess } from 'chess.js'
import { useState, useEffect } from 'react'
import Chessboard from 'chessboardjsx'
import OpenAI from 'openai'

const Analysis = ({ user, setUser, setApp, currentMatch, setMatch, currentMatchDetails }) => {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [orientation, setOrientation] = useState('white');
  const [moveIndex, setIndex] = useState(0);
  const [movesPlayed, setMoves] = useState([]);
  const [lastPlayed, setLast] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputData, setInput] = useState();
  const [stockfish, setStockfish] = useState();
  const getBestMove = (fen) => {
    return new Promise((resolve) => {
      stockfish.onmessage = (event) => {
        const message = event.data;
        if (message.startsWith('bestmove')) {
          const bestMove = message.split(' ')[1];
          resolve(bestMove);
        }
      };
      stockfish.postMessage(`position fen ${fen}`);
      stockfish.postMessage('go movetime 1000');
    });
  };
  useEffect(() => {
    game.loadPgn(currentMatch);
    setMoves(game.history());
    game.reset();
    setStockfish(new Worker('./stockfish.js'))
  }, [])
  const nextMove = () => {
    if (moveIndex == movesPlayed.length) return;
    game.move(movesPlayed[moveIndex]);
    setFen(game.fen());
    setLast(movesPlayed[moveIndex]);
    setIndex(ind => ind + 1);
  }
  const prevMove = () => {
    if (moveIndex == 0) return;
    game.undo();
    setFen(game.fen());
    setIndex(ind => ind - 1);
  }
  const toggleOrientation = () => {
    if (orientation == 'white') setOrientation('black');
    if (orientation == 'black') setOrientation('white');
  }
  const handleKey = async (e) => {
    if (e.key === 'Enter') {
      const newMsg = {
        user: user.username,
        content: inputData,
        avatar: user.avatar,
      };

      let currentMsgs = [...messages];
      currentMsgs.push(newMsg);
      setMessages(currentMsgs);
      setInput('');

      let bmove = await getBestMove(fen);
      let turn = moveIndex % 2 == 0 ? 'white' : 'black';
      let promptToAsk = `You are chess grandmaster Magnus Carlsen, giving advice to someone named ${user.username} who is asking you help about their chess match. You answer in very short concise answers which are a maximum of 2 sentences. The PGN of this match is "${currentMatch}". It is ${turn}'s turn to play. ${user.username} is playing with the ${currentMatchDetails?.white?.username == user.username ? 'white' : 'black'} pieces. The FEN of the current position is ${fen}. The best move according to stockfish in the current position is ${bmove}. The prompt that ${user.username} is saying is "${inputData}". Generate a friendly reply that can answer his question based on the data you know about the current position and the match. Give a short reply as you would in a texting chatty manner. Try not to fall into topics outside of the chess match, however you can answer basic questions like greetings and answer his prompts in a short way.`;
      // send prompt to openai and then add a new msg to the chat array with the
      console.log(promptToAsk);
      setTimeout(async () => {
        let newerMsg = {
          user: 'Magnus',
          content: 'The best move here for ' + turn + ', is ' + bmove, // send ai reply here instead of telling best move
          avatar: 'https://i.pinimg.com/originals/a5/fb/c8/a5fbc864b734092b5001008d5f3191ab.png',
        };

        currentMsgs = [...currentMsgs, newerMsg];
        setMessages(currentMsgs);
      }, 1000);
    }
  };

  return (
    <div className='w-[100%] h-[100%] relative text-white flex'>
      <div className='w-[100%] md:w-[50%] h-[100%] flex flex-col p-3 gap-5 justify-center items-center'>
        <h1 className='text-xl capitalize'>{currentMatchDetails?.white?.username} vs {currentMatchDetails?.black?.username}</h1>
        <h2 className='text-lg capitalize'>Move {Math.ceil(moveIndex / 2)} of {Math.ceil(movesPlayed?.length / 2)}</h2>
        <Chessboard lightSquareStyle={{ backgroundColor: 'aliceblue'}} position={fen} className='w-[100%] h-[100%]' id='Board' orientation={orientation} draggable={false} boardStyle={{ borderRadius: '0.5em' }} transitionDuration={0} />
        <div className='flex w-[100%] gap-3 px-10 text-black items-center justify-center'>
          <button onClick={prevMove} className='outline-none p-3 w-[30%] bg-white rounded-xl opacity-[0.7] transition-all ease-linear duration-300 hover:opacity-[1]'>Previous</button>
          <button onClick={toggleOrientation} className='outline-none p-3 w-[30%] bg-white rounded-xl opacity-[0.7] transition-all ease-linear duration-300 hover:opacity-[1]'>Flip Board</button>
          <button onClick={nextMove} className='outline-none p-3 w-[30%] bg-white rounded-xl opacity-[0.7] transition-all ease-linear duration-300 hover:opacity-[1]'>Next</button>
        </div>
      </div>
      <div className='w-0 scale-0 md:scale-100 md:w-[50%] bg-gray-800 flex flex-col md:p-3 gap-3 text-black'>
        <h1 className='text-center text-white text-2xl italic font-bold'>Chat With Magnus</h1>
        <div className=' w-full h-[100%] overflow-y-auto'>
          <div className='message-container flex flex-col gap-3'>
            {messages.map((msg, index) => {
              return <div
                key={index}
                className={
                  msg.user === user.username
                    ? 'w-full bg-gray-700 rounded-xl flex text-white p-3 items-center gap-3'
                    : 'w-full bg-purple-900 rounded-xl flex text-white p-3 items-center gap-3'
                }
              >
                <img src={msg.avatar || 'PlaceholderPic.png'} className='w-[10%] rounded-full aspect-square object-cover' />
                <div className='flex flex-col'>
                  <h1 className='font-bold capitalize italic flex gap-3'>{msg.user}</h1>
                  <p>{msg.content}</p>
                </div>
              </div>
            })}
          </div>
        </div>
        <input
          value={inputData}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={async (e) => {
            await handleKey(e);
          }}
          placeholder='Ask about your current position...'
          className='p-3 rounded-xl mt-auto outline-none opacity-[0.5]'
        />
      </div>
    </div>
  )
}

export default Analysis