import { useState, useEffect } from 'react'
import axios from 'axios';
import { AiOutlineClockCircle, AiOutlineTrophy, AiOutlineFlag } from 'react-icons/ai'

const Matches = ({ user, setUser, setApp, setMatch, setCurrentMatchDetails }) => {
  const [matches, setMatches] = useState([]);
  function secondsToMinutes(seconds) {
    if (typeof seconds !== 'number' || seconds < 0) {
      return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const minutesString = minutes < 10 ? "0" + minutes : minutes.toString();
    const secondsString = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds.toString();

    return minutesString + ":" + secondsString;
  }

  const analyzeGame = async (gameUrl) => {
    let archiveRes = await axios.get(`https://api.chess.com/pub/player/${user.username}/games/archives`);
      let lastArchive = archiveRes.data.archives[archiveRes.data.archives.length - 1];
      let matchesRes = await axios.get(lastArchive);
      let games = matchesRes.data.games;
      let matchFromUrl = games.find(game => game.url == gameUrl);
      let matchPgn = matchFromUrl.pgn;
      setMatch(matchPgn);
      setCurrentMatchDetails({
        white: matchFromUrl.white,
        black: matchFromUrl.black
      });
      document.querySelector('.MatchesStuff').classList.add('FadeOut');
      setTimeout(() => {
        document.querySelector('.BgDiv').classList.add('FadeOut');
        setTimeout(() => {
          setApp(3);
        }, 2000)
      },2000)
  }

  useEffect(() => {
    const fetchMatches = async () => {
      let archiveRes = await axios.get(`https://api.chess.com/pub/player/${user.username}/games/archives`);
      let lastArchive = archiveRes.data.archives[archiveRes.data.archives.length - 1];
      let matchesRes = await axios.get(lastArchive);
      let games = matchesRes.data.games;
      let newArray = [];
      await games.forEach(game => {
        newArray.push({
          time_control: game.time_control,
          time_class: game.time_class,
          white: game.white,
          black: game.black,
          url: game.url,
        });
      });
      await newArray.reverse();
      await setMatches(newArray);
      newArray = [];
    }
    fetchMatches();
  }, []);
  return (
    <div className='w-[100%] h-[100%] relative'>
      <div className='BgDiv w-[100%] h-[100%]' />
      <div className='bg-black w-[100%] h-[100%] opacity-[0.3] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'></div>
      <div className='MatchesStuff w-[100%] h-[100%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-10 gap-5 flex flex-col items-center justify-center'>
        <h1 className='text-3xl whitespace-nowrap font-bold italic'>Recent Matches</h1>
        <div className='w-[100%] md:w-[60%] flex-1 overflow-y-scroll flex gap-3 flex-wrap rounded-xl'>
          {matches.length > 1 ? matches.map(match => {
            return <div className='bg-black p-3 rounded-xl w-[100%] flex flex-col gap-5'>
              <div className='w-[100%] flex flex-col md:flex-row items-center gap-3 capitalize flex-wrap'>
                <p>{match.white.username}</p>
                <p className='text-purple-400 scale-0 md:scale-100 absolute md:static opacity-0 md:opacity-[1]'>({match.white.rating})</p>
                Vs
                <p className='opacity-[0.6] '>{match.black.username}</p>
                <p className='text-purple-400 scale-0 absolute md:scale-100 md:static opacity-0 md:opacity-[1]'>({match.black.rating})</p>
                <p className='md:ml-auto flex items-center gap-3'><AiOutlineClockCircle /> {(match.time_control == '900+10') ? '15 + 10' : (match.time_control == '180+2') ? '3 + 2' : secondsToMinutes(Number(match.time_control))} | {match.time_class}</p>
              </div>
              <div className='flex gap-3 flex-wrap md:flex-nowrap'>
                <button onClick={() => {
                  analyzeGame(match.url);
                }} className='bg-white opacity-[0.5] text-black p-3 rounded-full w-[100%] md:w-[50%] transition-all ease-linear duration-300 hover:opacity-[0.7]'>Analyze</button>
                <button onClick={() => {
                  window.open(match.url)
                }} className='bg-white opacity-[0.5] text-black p-3 rounded-full w-[100%] md:w-[50%] transition-all ease-linear duration-300 hover:opacity-[0.7]'>Open in chess.com</button>
              </div>
            </div>
          }) : <p className='text-center w-[100%] h-[100%] flex items-center justify-center'>Loading...</p>}
        </div>
      </div>
    </div>
  )
}

export default Matches