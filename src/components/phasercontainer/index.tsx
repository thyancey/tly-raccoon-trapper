import styled from 'styled-components';
import { setStat } from '../ui/stats-slice';
import { useAppDispatch } from '../../app/hooks';
import { getColor } from '../../themes';

export const ScPhaserContainer = styled.div`
  position:relative;
  width:100%;
  height:100%;
  background-color: ${getColor('black')};

  >canvas{
    border: 1rem solid ${getColor('brown')};
  }
`;

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
  const dispatch = useAppDispatch();
  createGameInterface(dispatch);

  return (
      <ScPhaserContainer id="game-container" />
  );
}
