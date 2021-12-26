import { useEffect } from 'react';
import styled from 'styled-components';
import { getColor } from '../themes';
import { createGame } from '../phaser/trapper';
import OldHeader from './old-header';
export const Container = styled.div`
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background-color: ${getColor('purple')};
  z-index:-1;
  padding-top:10rem;
`

export function PhaserContainer() {
  useEffect(() => {
    console.log('moundt!')
    
    // window.setTimeout(() => {
      createGame();
    // }, 500)
  });

  return (
    <Container>
      <h1>{'Phaser container'}</h1>
        <OldHeader />
      <div id="game-container" >
      </div>
    </Container>
  );
}
