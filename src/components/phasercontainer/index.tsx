import { useEffect } from 'react';
import styled from 'styled-components';
import { getColor } from '../../themes';
import { createGame, killGame, externalCommand } from '../../phaser/trapper';
import { selectGameStatus } from '../menu/menu-slice';
import { setStat } from '../header/stats-slice';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
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

export const createGameInterface = dispatch => {
  if(!(global as any).gameInterface){
    (global as any).gameInterface = (event, payload) => {
      switch(event){
        case 'setStat': 
          dispatch(setStat(payload))
          break;
        default: console.error('invalid interface command', event);
      }
    }
  }
  return;
}

export function PhaserContainer() {
  const gameStatus = useAppSelector(selectGameStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(gameStatus){
      console.log('gameStatus true, creating game!');
      createGameInterface(dispatch);
      createGame();
    }else{
      console.log('gameStatus false, stopping game!');
      killGame();
    }
  }, [ gameStatus, dispatch ]);

  return (
    <Container id="game-container">
    </Container>
  );
}
