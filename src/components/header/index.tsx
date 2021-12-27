import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { getColor } from '../../themes/';
import { useAppDispatch } from '../../app/hooks';
import { startGame, exitGame } from '../menu/menu-slice';

const ScHeader = styled.div`
  position:fixed;
  top:0;
  left:0;
  transition: top .5s ease-in-out;

  width: 100%;
  height:5rem;
  margin:0;
  color:white;
  z-index:1;

  &.collapsed{
    top:-4rem;
    transition: top .5s ease-in-out;
  }

  >.link-button{
    color:white;
    display:inline-block;
    vertical-align:middle;
    margin: 0rem 1.8rem;
    margin-top:1.5rem;
    transition: color .5s ease-in;
    color:${getColor('brown_beige')};
    
    h4{
      font-size:2.5rem;
    }
    &:hover{
      color: ${getColor('green_light')};
      transition: color .2s ease-out;
    }
  }
`;

const ScBg = styled.div`
  position:absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  z-index:-1;
  
  background-color: ${getColor('brown_dark')};
  border-bottom: .5rem solid ${getColor('brown')};
`

const ScTab = styled.div`
  width:5rem;
  height:calc(100% + 2rem);
  position:absolute;
  top:0%;
  right:2rem;
  background-color:${getColor('brown_dark')};
  border:.5rem solid ${getColor('brown')};
  border-top:0;
  border-radius: 0 0 1rem 1rem;

  cursor:pointer;
`;

const ScLink = styled(Link)`
  color:white;
  margin:2rem;
  font-size:3rem;
`

function Header( { pages }) {
  const [ collapsed, setCollapsed ] = useState(false);
  let location = useLocation();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if(location.pathname.indexOf('game') > -1){
      dispatch(startGame())
    }else{
      dispatch(exitGame())
    }
  }, [ location, dispatch ]);

  return (
    <ScHeader className={ collapsed ? 'collapsed' : ''} >
      <div>
        {pages.map((p, i:integer) => (
          <ScLink key={i} to={p.route} >
            {p.text}
          </ScLink>
        ))}
      </div>
      <ScBg />
      <ScTab onClick={() => setCollapsed(!collapsed)} />
    </ScHeader>
  )
}

export default Header;
