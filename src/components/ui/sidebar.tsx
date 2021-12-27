import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { getColor } from '../../themes/';
import Stats from './components/stats';
import Controls from './components/controls';

const ScSidebar = styled.div`
  position:fixed;
  top:0;
  left:0;
  transition:left .5s ease-in-out;

  width:40rem;
  height:100%;
  margin:0;
  color:white;
  z-index:1;

  &.collapsed{
    left:-40rem;
    transition:left .5s ease-in-out;
  }

  >.link-button{
    color:white;
    display:inline-block;
    vertical-align:middle;
    margin:0rem 1.8rem;
    margin-top:1.5rem;
    transition:color .5s ease-in;
    color:${getColor('tan')};
    
    h4{
      font-size:2.5rem;
    }
    &:hover{
      color: ${getColor('green_light')};
      transition:color .2s ease-out;
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
  border-right: .5rem solid ${getColor('brown')};
`

const ScTab = styled.div`
  width:5rem;
  height:calc(100% + .5rem);
  position:absolute;
  top:0rem;
  left:calc(100% - 1rem);
  background-color:${getColor('brown_dark')};
  border:.5rem solid ${getColor('brown')};
  border-radius: 0 0 1rem 0;
  border-left:0;
  border-top:0;
  transition:background-color .2s ease-out;

  z-index:1;

  &:hover{
    background-color: ${getColor('brown')};
    color: ${getColor('white')};
  }
  
  color: ${getColor('brown_light')};
  padding-right:1rem;
  text-align:center;
  writing-mode: vertical-rl;
  text-orientation: mixed;
`;

const ScBody = styled.div`
  display:flex;
  flex-direction: column;
  height:100%;
`

const ScTop = styled.div`
  min-height:20rem;
  position:relative;
  cursor:pointer;
  border-bottom:.5rem solid ${getColor('brown')};
  padding:1rem;
`

const ScBottom = styled.div`
  flex-grow:1;
  padding:1rem;
`

const ScLink = styled(Link)`
  color:${getColor('tan')};
  margin:2rem;
  font-size:2rem;

  &:hover{
    color:white;
  }
`

const ScHelp = styled.div`
  
`

const HelpList = () => {
  const instructions = [
    'Feed the raccoons and give them hugs!',
    'Kick the ones who don\'t love you!',
    'Arrow Up/Down: Change langes',
    'Arrow Left: Hug',
    'Arrow Right: Charge kick',
    'Space: Throw food',
    '... you can\'t win or lose right now'
  ];
  return (
    <ScHelp>
      <ul>
        {instructions.map((i, idx) => (
          <li key={idx}>${i}</li>
        ))}
      </ul>
    </ScHelp>
  )
}

function Sidebar() {
  const [ collapsed, setCollapsed ] = useState(true);

  return (
    <ScSidebar className={ collapsed ? 'collapsed' : ''} >
      <ScBody>
        <ScTop>
          <h2>{'RACCOON TRAPPER'}</h2>
          <ScLink to={'/'} >
            {'menu'}
          </ScLink>
          <HelpList />
          <ScTab onClick={() => setCollapsed(!collapsed)}><span>{'MENU'}</span></ScTab>
        </ScTop>
        <ScBottom>
          <Controls/>
          <hr/>
          <Stats/>
        </ScBottom>
      </ScBody>
      <ScBg />
    </ScSidebar>
  )
}

export default Sidebar;
