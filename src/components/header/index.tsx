import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { getColor } from '../../themes/';
import { useAppDispatch } from '../../app/hooks';
import { startGame, exitGame } from '../menu/menu-slice';

export const ScHeader = styled.div`
  position:fixed;
  top:0;
  left:0;
  transition: top .5s ease-in-out;

  width: 100%;
  height:5rem;
  margin:0;
  color:white;
  z-index:1;
  background-color: ${getColor('brown_dark')};

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
    <ScHeader className={ collapsed ? 'collapsed' : ''} onClick={() => setCollapsed(!collapsed)}>
      {pages.map((p, i) => (
        <Link key={i} to={p.route} className="link-button">
          <h4>{p.text}</h4>
        </Link>
      ))}
    </ScHeader>
  )
}

export default Header;
