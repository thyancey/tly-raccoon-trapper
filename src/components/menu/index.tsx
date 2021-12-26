import styled from 'styled-components';
import { getColor } from '../../themes';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Button } from '../button';


export const ScMenu = styled.div`
  /* position:absolute; */
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 25%;
  min-height: 25%;
  transform: translate(-50%, -50%);
  padding: 4rem;
`;

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

export const ScBody = styled.div`
`;
export const ScTitle = styled.h1`
  text-align:center;
  font-size:8rem;
  color: ${getColor('brown_beige')};
`;
export const ScButtons = styled.div`
  margin-top:1rem;
  text-align:center;


`;

const onGameClick = (navigate: NavigateFunction) => {
  // dispatch(startGame())
  navigate('/game');
}

export function Menu() {
  const navigate = useNavigate();

  return (
    <ScMenu>
      <ScBody>
        <ScTitle>{'RACCOON TRAPPER'}</ScTitle>
      </ScBody>
      <ScButtons>
        <Button onClick={(e) => onGameClick(navigate)} text={'NEW GAME'} />;
      </ScButtons>
      <ScBg />
    </ScMenu>
  )
}
