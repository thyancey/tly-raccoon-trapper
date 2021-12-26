import { useEffect } from 'react';
import styled from 'styled-components';
import { getColor } from '../../themes';
import { createGame, killGame } from '../../phaser/trapper';
import {
  selectGameStatus
} from '../menu/menu-slice';

import OldHeader from './old-header';
import { useAppSelector } from '../../app/hooks';
export const Container = styled.div`
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background-color: ${getColor('black')};
  z-index:-1;
  padding-top:10rem;
  text-align:center;
`

export function PhaserContainer() {
  const gameStatus = useAppSelector(selectGameStatus);

  useEffect(() => {
    if(gameStatus){
      console.log('gameStatus true, creating game!');
      createGame();
    }else{
      console.log('gameStatus false, stopping game!');
      killGame();
    }
  }, [ gameStatus ]);

  return (
    <Container>
      <h1>{'Phaser container'}</h1>
        <OldHeader />
      <div id="game-container" >
      </div>
    </Container>
  );
}
