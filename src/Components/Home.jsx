import Lottie from 'lottie-react'
import KnightAnim from './Knight.json'
import { useState, useEffect } from 'react'
import axios from 'axios'

const Home = ({ setApp, setUser }) => {
    const [knight, setKnight] = useState(true);
    const [inputData, setInput] = useState('');
    useEffect(() => {
        document.querySelector('video').playbackRate = 5.0;
    })
    const handleEnd = () => {
        document.querySelector('video').classList.add('BlurAnim');
        setTimeout(() => {
            document.querySelector('.OptionsDiv').classList.add('FadeIn');
            setKnight(false);
        }, 2000)
    }
    const handleLogin = async () => {
        try {
            const res = await axios.get('https://api.chess.com/pub/player/' + inputData);
            if (res.data?.code !== 0) {
                setUser(res.data);
                console.log(res.data);
                document.querySelector('.OptionsDiv').classList.add('FadeOut');
                setTimeout(() => {
                    document.querySelector('video').classList.add('FadeOutVid');
                    setTimeout(() => {
                        setApp(1);
                    }, 2000)
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
    return (
        <div className="w-[100%] h-[100%] relative">
            <video className="w-[100%] h-[100%] object-cover" muted={true} autoPlay={true} onEnded={handleEnd}>
                <source src="Background.mp4"></source>
            </video>
            <div className="OptionsDiv opacity-0 w-[100%] h-[100%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center justify-center gap-5 p-10 pointer-events-none">
                <h1 className="text-4xl font-bold italic opacity-[0.7] whitespace-nowrap overflow-visible">Analyze With Magnus</h1>
                <Lottie animationData={KnightAnim} className='flex-1 opacity-[0.7]' loop={knight} />
                <input value={inputData} onChange={(e) => {
                    setInput(e.target.value)
                }} onKeyDown={(e) => {
                    if(e.key == 'Enter') {
                        handleLogin();
                    }
                }} placeholder="chess.com username" className="mt-auto p-5 rounded-full opacity-[0.5] outline-none border-none w-[100%] md:w-[30%] bg-black" />
                <button onClick={handleLogin} className="p-5 cursor-pointer hover:opacity-[0.3] transition-all ease-linear duration-300 rounded-full opacity-[0.5] outline-none border-none w-[100%] md:w-[30%] bg-black">Continue</button>
            </div>
        </div>
    )
}

export default Home