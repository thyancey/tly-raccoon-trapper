import styled from 'styled-components';

import { ReselectModalFromGameStatus } from '../../services/game/status-slice';
import { useAppSelector } from '../../services/hooks';
import { MultiModal } from './components/modals';

export const ScModals = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 25%;
  min-height: 25%;
  transform: translate(-50%, -50%);
  padding: 4rem;

  z-index:1;
`;

export function Modals() {
  const playStatusObj = useAppSelector(ReselectModalFromGameStatus);
  if(!playStatusObj) return null;

  return (
    <ScModals>
      <MultiModal playStatusObj={playStatusObj} />
    </ScModals>
  )
}
