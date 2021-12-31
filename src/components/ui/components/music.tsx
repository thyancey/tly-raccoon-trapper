import styled, { css } from 'styled-components';
import { useEffect, useState } from 'react';
import useSound from 'use-sound';

const ScMusic = styled.div`
  position:fixed;
  top:0;
  right:0;
  z-index:1;
`

export function Music() {
  const [playing, setPlaying] = useState(false);
  const [play, { stop }] = useSound('./assets/sfx/trapper.ogg');

  useEffect(() => {
    if(playing){
      play();
    }else{
      stop();
    }
  }, [ playing ])

  return (
    <ScMusic>
      <button onClick={() => setPlaying(!playing)}>
        {playing ? 'Stop background music' : 'Play background music'}
      </button>
    </ScMusic>
  )
}