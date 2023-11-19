import React, { useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import KnightAnim from './Knight.json'
import axios from 'axios'

const Main = ({ user, setApp, setUser }) => {
  const [inputData, setInput] = useState('');
  const [knight, setKnight] = useState(true);

  useEffect(() => {
    document.querySelector('video').playbackRate = 1.5;
  }, [])
  const handleEnd = () => {
    document.querySelector('#skipBtn')?.remove();
    document.querySelector('video').classList.add('BlurAnim');
    setTimeout(() => {
      document.querySelector('.InfoDiv').classList.add('FadeIn');
    }, 2000)
  }
  const changeAcc = () => {
    document.querySelector('.OptionsDiv').classList.remove('FadeIn');
    document.querySelector('.OptionsDiv').classList.remove('FadeOut');
    document.querySelector('.InfoDiv').classList.add('FadeOut');
    setTimeout(() => {
      document.querySelector('.OptionsDiv').classList.add('FadeIn');
      document.querySelector('.InfoDiv').classList.remove('FadeOut');
      document.querySelector('.InfoDiv').classList.remove('FadeIn');
      setKnight(false);
    }, 2000)
  }
  const handleLogin = async () => {
    try {
      const res = await axios.get('https://api.chess.com/pub/player/' + inputData);
      if (res.data?.code !== 0) {
        setUser(res.data);
        document.querySelector('.OptionsDiv').classList.add('FadeOut');
        setTimeout(() => {
          document.querySelector('.InfoDiv').classList.add('FadeIn');
        }, 2000)
      }
      else {
        setInput('');
      }
    }
    catch (err) {
      console.log(err);
      setInput('');
    }
  }
  const analyzeMatches = async () => {
    document.querySelector('.InfoDiv').classList.add('FadeOut');
    setTimeout(() => {
      document.querySelector('video').classList.add('FadeOutVid');
      setTimeout(() => {
        setApp(2);
      }, 2000)
    }, 2000)
  }
  const skip = () => {
    document.querySelector('video').pause();
    document.querySelector('video').currentTime = document.querySelector('video').duration
    document.querySelector('video').play();
    document.querySelector('#skipBtn').remove();
  }
  return (
    <div className='w-[100%] h-[100%] relative'>
      <button id='skipBtn' onClick={skip} className='absolute right-3 bottom-3 opacity-[0.5] rounded-xl'>Skip Animation</button>
      <video className="w-[100%] h-[100%] object-cover" muted={true} autoPlay={true} onEnded={handleEnd}>
        <source src="Background2.mp4"></source>
      </video>
      <div className='InfoDiv opacity-0 w-[100%] h-[100%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center justify-center gap-5 p-10 pointer-events-none'>
        <h1 className="text-3xl font-bold italic opacity-[0.7] whitespace-nowrap overflow-visible">Welcome, {user.username}</h1>
        <img src={user.avatar || 'PlaceholderPic.png'} className='rounded-full opacity-[0.7] mt-auto w-[80%] md:w-[20%] aspect-square' />
        <button onClick={analyzeMatches} className=" mt-auto p-5 cursor-pointer hover:opacity-[0.3] transition-all ease-linear duration-300 rounded-full opacity-[0.5] outline-none border-none w-[100%] md:w-[30%] bg-black">Analyze Matches</button>
        <button onClick={changeAcc} className="p-5 cursor-pointer hover:opacity-[0.3] transition-all ease-linear duration-300 rounded-full opacity-[0.5] outline-none border-none w-[100%] md:w-[30%] bg-black">Change Account</button>
      </div>
      <div className="OptionsDiv opacity-0 w-[100%] h-[100%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center justify-center gap-5 p-10 pointer-events-none">
        <h1 className="text-4xl font-bold italic opacity-[0.7] whitespace-nowrap overflow-visible">Change Account</h1>
        <Lottie animationData={KnightAnim} className='flex-1 opacity-[0.7]' loop={knight} />

        <input value={inputData} onChange={(e) => {
          setInput(e.target.value)
        }} onKeyDown={(e) => {
          if (e.key == 'Enter') {
            handleLogin();
          }
        }} placeholder="chess.com username" className="mt-auto p-5 rounded-full opacity-[0.5] outline-none border-none w-[100%] md:w-[30%] bg-black" />
        <button onClick={handleLogin} className="p-5 cursor-pointer hover:opacity-[0.3] transition-all ease-linear duration-300 rounded-full opacity-[0.5] outline-none border-none w-[100%] md:w-[30%] bg-black">Continue</button>
      </div>
    </div>
  )
}

export default Main