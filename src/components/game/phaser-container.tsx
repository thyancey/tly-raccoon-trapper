import styled from 'styled-components';
import { getColor } from '../../themes';
import { Brain } from './brain';

export const ScPhaserContainer = styled.div`
  position:relative;
  width:100%;
  height:100%;

  overflow-y:hidden;
`;

export const ScWrapper = styled.div`
  >canvas{
    border: 1rem solid ${getColor('brown')};
  }
`;

export function PhaserContainer() {
  return (
    <ScPhaserContainer>
      <Brain />
      <ScWrapper id="game-container">
      </ScWrapper>
    </ScPhaserContainer>
  );
}
