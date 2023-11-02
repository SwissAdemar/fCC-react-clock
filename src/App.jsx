import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faRotateRight, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import './App.css'


function App() {
 
  const [timeLeft, setTimeLeft] = useState(25*60);
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [play, setPlay] = useState(false);
  const [title, setTitle] = useState(true);

  const timerID = useRef(0);
  const audio = document.getElementById('beep');



  const handleIncrement = (label) => {
    if(label === "session"){
      if(sessionLength < 60){
        setSessionLength(prev => prev + 1); // increase session length by a minute
        setTimeLeft(prev => prev + 60); // increase time left by a minute
      }
      
    } else {
      if(breakLength < 60){
        setBreakLength(prev => prev + 1); // increase a break length by a minute
      }
      
    }
  }

  const handleDecrement = (label) => {
    if(label === "session"){
      if(sessionLength > 1){
        setSessionLength(prev => prev - 1); // decrease session length by a minute
        setTimeLeft(prev => prev - 60); // decrease time left by a minute
      }
      
    } else {
      if(breakLength > 1){
        setBreakLength(prev => prev - 1); // decrease a break length by a minute
      }
      
    }
  }
  
  const handleReset = () => { // set everything back to its initial value
    clearInterval(timerID.current);
    timerID.current = 0;
    setBreakLength(5);
    setSessionLength(25);
    setTitle(true);
    setTimeLeft(25*60);
    setPlay(false);
    audio.pause();
    audio.currentTime = 0;
  }

  const handleStart = () => {
    if(!timerID.current){ // check if interval has not been initialized yet to prevent stacking same interval multiple times
      timerID.current = setInterval(() => { // set the interval to update timer every second
        setTimeLeft(prev => prev - 1);
      }, 1000)
    } else { // if it has been initialized
      clearInterval(timerID.current); // clear the interval
      timerID.current = 0; // set the variable it is assigned to, to 0, so next time it enters the if/else statement, it will execute the first part
    }
    setPlay(!play); // toggle play, used for disabling the buttons when the timer is running
  }


  useEffect(() => {
    if(!timeLeft){ // if timeLeft reaches 0
      if(title){ // if title is true, meaning title equals "Session"
        setTimeLeft(breakLength * 60); // set timer to break length value that user has set
        setTitle(false); // change title to "Break"
        audio.play(); // play alarm sound
      } else { // if title is false, meaning title equals "Break"
        setTimeLeft(sessionLength * 60); // set timer to session length value that user has set
        setTitle(true); // change title to "Session"
        audio.pause(); // pause the alarm
        audio.currentTime = 0; // make sure it starts from the beginning next time it launches
      }
    } 
  }, [timeLeft]) // check every time timeLeft value is changed

  

  const formatTime = (time) => {
    
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);

    if(minutes < 10) minutes = "0" + minutes;
    if(seconds < 10) seconds = "0" + seconds;

    return `${minutes}:${seconds}`;
}
  

  

  return (
    <>
      <div className="container">
        <h1 id="title"><span className='color__accent'>25 + 5</span> Clock</h1>
        <div className="break-session-wrapper">
          <div className="break-wrapper">
            <h2 id="break-label">Break Length</h2>
            <div className='break-controls'>
              <button disabled={play} id="break-increment" onClick={() => handleIncrement("break")}>
                <FontAwesomeIcon icon={faArrowUp} size='xs'/>
              </button>
              <p id="break-length">{breakLength}</p>
              <button disabled={play} id="break-decrement" onClick={() => handleDecrement("break")}>
                <FontAwesomeIcon icon={faArrowDown} size="xs" />
              </button>
            </div>
          </div>
          <div className="session-wrapper">
            <h2 id="session-label">Session Length</h2>
            <div className="session-controls">
              <button disabled={play} id="session-increment" onClick={() => handleIncrement("session")}>
                <FontAwesomeIcon icon={faArrowUp} size='xs'/>
              </button>
              <p id="session-length">{sessionLength}</p>
              <button disabled={play} id="session-decrement" onClick={() => handleDecrement("session")}>
                <FontAwesomeIcon icon={faArrowDown} size="xs" />
              </button>
            </div>
          </div>
        </div>
        <div className="timer-wrapper">
          <div className='timer'>
            <h2 id="timer-label">{title ? "Session" : "Break"}</h2>
            <p id="time-left">{formatTime(timeLeft)}</p>
          </div>
          <div className='timer-controls'>
            <button id="start_stop" onClick={handleStart}>
              {
                !play ? <FontAwesomeIcon icon={faPlay} size="sm" className='icon__adjust' /> 
                      : <FontAwesomeIcon icon={faPause} size="sm" className='icon__adjust'/>
              }
              
            </button>
            <button id="reset" onClick={handleReset}>
              <FontAwesomeIcon icon={faRotateRight} size='sm'/>
            </button>
          </div>
        </div> 
      </div>
      <audio
        id="beep"
        preload="auto"
        src="./assets/audio/alarm-sound.mp3">
      </audio>
    </>
  )
}




ReactDOM.render(<App />, document.getElementById('root'))

