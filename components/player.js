import React, {useState, useRef, useEffect, useCallback} from 'react';

import useEventListener from '../hooks/useEventListener';

const audioUrl = "https://traffic.libsyn.com/atpfm/atp391.mp3"

const audioList = [
  {
    title: 'First Track',
    track: 'https://traffic.libsyn.com/atpfm/atp391.mp3'
  },
  {
    title: 'Second Track',
    track: 'https://traffic.libsyn.com/atpfm/atp390.mp3'
  },
  {
    title: 'Third Track',
    track: 'https://traffic.libsyn.com/atpfm/atp389.mp3'
  }
]



export default function Player(){
  const mediaRef = useRef()
  const [play, setPlay] = useState(false)
  const [audio, setAudio] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(audioList[0].track)
  const [currentTitle, setCurrentTitle] = useState(audioList[0].title)

  const audioFinishedHandler = useCallback(() => {
    console.log('Media finished playing');
  }, [])


  useEventListener('ended', audioFinishedHandler, mediaRef.current);

  useEffect(() => {
    console.log(mediaRef.current)
    const audioContext = new AudioContext();
    setAudio(audioContext)
    const track = audioContext.createMediaElementSource(mediaRef.current)
    track.connect(audioContext.destination)

    return async () => {
      try {
        await audioContext.close()
        console.log("AUDIO CONTEXT CLOSED")
      } catch (error) {
        console.log('could not close audioContext')
        console.error(error)
      }
      
      
    }
  }, [mediaRef])


  function handleClick() {
    console.log(mediaRef.current.state)
    console.log(audio)
    if(audio.state === 'suspended'){
      audio.resume()
    }

    if(play === false){
      setPlay(true)
      mediaRef.current.play()
      return
    }
    setPlay(false)
    mediaRef.current.pause()
    return
  }

  return (
    <>
      <h1>Playing: {currentTitle}</h1>
      <audio controls ref={mediaRef} crossOrigin="anonymous">
          <source src={currentTrack} type="audio/mp3"/> 
      </audio>
      <button type="button" onClick={handleClick}>
        Play/Pause
      </button>
    </>
    
  )
  
};


// return (
//   <ReactPlayer url={audioUrl} height="50px" controls={true}/>
// )