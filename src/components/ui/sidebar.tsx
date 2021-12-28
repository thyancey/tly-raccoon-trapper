import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { getColor } from '../../themes/';
import Controls from './components/controls';
import { DebugStats } from './components/debugstats';

const ScSidebar = styled.div`
  position:fixed;
  top:0;
  left:0;
  transition:left .5s ease-in-out;

  width:30rem;
  height:100%;
  margin:0;
  color:${getColor('tan')};
  z-index:1;

  &.collapsed{
    left:-30rem;
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

const ScBody = styled.div`
  display:flex;
  flex-direction: column;
  height:100%;
`


const ScBottom = styled.div`
  flex-grow:1;
  overflow-y:auto;
  padding:1rem;
`

const ScTop = styled.div`
  min-height:20rem;
  position:relative;
  cursor:pointer;
  border-bottom:.5rem solid ${getColor('brown')};
  padding:1rem;
`

const ScLogo = styled.div`
  background: center / contain no-repeat url('./assets/logo.gif');
  position:absolute;
  left:100%;
  top:0;
  width:30rem;
  height:20rem;
  z-index:1;

  -webkit-filter: drop-shadow(.5rem .5rem .5rem ${getColor('grey_dark')});
  filter: drop-shadow(.5rem .5rem .5rem ${getColor('grey_dark')});

  &:hover{
    -webkit-filter: drop-shadow(1rem 1rem 1rem ${getColor('tan')});
    filter: drop-shadow(1rem 1rem 1rem ${getColor('tan')});
  }
`;

const ScLink = styled(Link)`
  color:${getColor('tan')};
  text-align:center;
  font-size:2rem;

  &:hover{
    color:white;
  }
`

const ScHelp = styled.div`
  li{
    font-size:1.5rem;
    margin-left:1rem;
  }
`

const ScSideImage = styled.div`
background: center / contain no-repeat url('./assets/raccoon-on-branch.gif');
  position:absolute;
  left:100%;
  width:20rem;
  height:50rem;
  -webkit-filter: drop-shadow(.5rem .5rem .5rem ${getColor('grey_dark')});
  filter: drop-shadow(.5rem .5rem .5rem ${getColor('grey_dark')});

  &:hover{
    -webkit-filter: drop-shadow(1rem 1rem 1rem ${getColor('tan')});
    filter: drop-shadow(1rem 1rem 1rem ${getColor('tan')});
  }
  top:0;
  margin-left:-12rem;
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
      <h4>{'Instructions'}</h4>
      <ul>
        {instructions.map((i, idx) => (
          <li key={idx}>{i}</li>
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
          <ScLogo onClick={() => setCollapsed(!collapsed)} /> 
          <ScSideImage onClick={() => setCollapsed(!collapsed)} />
          <HelpList />
          <ScLink to={'/'} >
            {'back to main menu'}
          </ScLink>
        </ScTop>
        <ScBottom>
          <hr/>
          <Controls/>
          <hr/>
          <DebugStats/>
        </ScBottom>
      </ScBody>
      <ScBg />
    </ScSidebar>
  )
}

export default Sidebar;
