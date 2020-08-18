import ReactPlayer from 'react-player';

const audioUrl = "https://traffic.libsyn.com/atpfm/atp391.mp3"

export default function Player(){

  return (
    <ReactPlayer url={audioUrl} height="50px" controls={true}/>
  )
};