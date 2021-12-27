import styled from 'styled-components';
import { MouseEventHandler } from 'hoist-non-react-statics/node_modules/@types/react';

import { getColor } from '../themes';

export const ScButton = styled.div`
  display: inline-block;
  padding: 2rem;
  border: .5rem solid ${getColor('brown')};
  border-radius: 1rem;
  background-color: ${getColor('tan')};
  width:auto;

  cursor:pointer;
  &:hover{
    background-color: ${getColor('brown_light')};
  }

  span{
    font-size:3rem;
    font-weight: bold;
  }
`;

interface LBType {
  onClick: MouseEventHandler,
  text: string
}

export function Button({ onClick, text }: LBType) {
  return (
    <ScButton onClick={onClick}><span>{text}</span></ScButton>
  )
}
