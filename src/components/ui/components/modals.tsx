import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getColor } from '../../../themes';

export const ScModal = styled.div`
`

export const ScBody = styled.div`
`

export const ScBg = styled.div`
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color: ${getColor('brown_dark')};
  border: 1rem solid ${getColor('brown')};
  border-radius: 5rem;

  z-index:-1;
`;

const ScLink = styled(Link)`
  color:${getColor('tan')};
  text-align:center;
  font-size:2rem;

  &:hover{
    color:white;
  }
`

type ModalProps = {
  reason: string
};
function WonModal({ reason }: ModalProps){
  return (
    <ScModal>
      <ScBody>
        <h3>{'YOU WON!'}</h3>
        <p>{reason}</p>
        <ScLink to={'/'} >
          {'back to main menu'}
        </ScLink>
      </ScBody>
      <ScBg />
    </ScModal>
  )
}

function LostModal({ reason }: ModalProps){
  return (
    <ScModal>
      <ScBody>
        <h3>{'YOU LOST!'}</h3>
        <p>{reason}</p>
        <ScLink to={'/'} >
          {'back to main menu'}
        </ScLink>
      </ScBody>
      <ScBg />
    </ScModal>
  )
}

function PausedModal({ reason }: ModalProps){
  return (
    <ScModal>
      <ScBody>
        <h3>{'YOU PAUSED!'}</h3>
        <p>{reason}</p>
        <ScLink to={'/'} >
          {'back to main menu'}
        </ScLink>
      </ScBody>
      <ScBg />
    </ScModal>
  )
}

type MultiModalProps = {
  playStatusObj: PlayStatusObj
};
export function MultiModal({ playStatusObj }: MultiModalProps){
  switch(playStatusObj.status){
    case 'won': return (<WonModal reason={playStatusObj.reason} />)
    case 'lost': return (<LostModal reason={playStatusObj.reason} />)
    case 'paused': return (<PausedModal reason={playStatusObj.reason} />)
    default: break;
  }
  
  return null;
}