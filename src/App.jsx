import { useState } from 'react'
import Home from './Components/Home';
import Main from './Components/Main';
import Matches from './Components/Matches';
import Analysis from './Components/Analysis';

function App() {
  const [appState, setApp] = useState(0);
  const [user, setUser] = useState();
  const [currentMatch, setMatch] = useState('');
  const [currentMatchDetails, setMatchDetails] = useState({});
  document.querySelector("meta[name=viewport]").setAttribute('content', 'width=device-width, initial-scale='+(1/window.devicePixelRatio));
  return (
    <div className='w-screen h-screen bg-black relative text-white SpecialFont'>
      {appState == 0 && <Home setApp={setApp} setUser={setUser} />}
      {appState == 1 && <Main user={user} setUser={setUser} setApp={setApp} />}
      {appState == 2 && <Matches user={user} setUser={setUser} setApp={setApp} currentMatch={currentMatch} setMatch={setMatch} setCurrentMatchDetails={setMatchDetails}/>}
      {appState == 3 && <Analysis user={user} setUser={setUser} setApp={setApp} currentMatch={currentMatch} setMatch={setMatch} currentMatchDetails={currentMatchDetails} />}  
    </div>
  )
}

export default App
