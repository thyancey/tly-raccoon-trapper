import styled from 'styled-components';
import { useEffect, useState } from 'react';
import useSound from 'use-sound';

const ScMusic = styled.div`
  position:fixed;
  top:0;
  right:0;
  z-index:1;
`

export function Music() {
  const [playing, setPlaying] = useState(true);
  const [play, { stop }] = useSound('./assets/sfx/trapper.ogg', { volume: 0.5 });

  useEffect(() => {
    if(playing){
      play();
    }else{
      stop();
    }
  }, [ playing, play, stop ])

  return (
    <ScMusic>
      <button onClick={() => setPlaying(!playing)}>
        {playing ? 'Stop background music' : 'Play background music'}
      </button>
    </ScMusic>
  )
}