import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Counter } from './examples/counter/Counter';
import { Template } from './experiments/template';
import { getColor } from './themes/';
// import { Route, Link, withRouter, Redirect } from 'react-router-dom';
import { HashRouter, Route, Routes, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const GroupContainer = styled.div`
  background-color: ${getColor('blue')};
  border: 1rem solid ${getColor('white')};
  border-radius: 5rem;
  margin: 3rem;
  padding: 2rem 3.3rem;
`;

export const ScHeader = styled.div`
  position:fixed;
  top:0;
  left:0;
  transition: top .5s ease-in-out;

  width: 100%;
  height:10rem;
  border-bottom:1rem solid blue;
  color:white;
  z-index:1;
  background-color:black;

  &.collapsed{
    top:-8rem;
    transition: top .5s ease-in-out;
  }

  >.link-button{
    color:white;
    display:inline-block;
    vertical-align:middle;
    margin:1.4rem 1.8rem;
    transition: color .5s ease-in;
    &:hover{
      color: ${getColor('yellow')};
      transition: color .2s ease-out;
    }
  }
`;

export const ScStage = styled.div`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  padding-top:5rem;
`

function App() {
  const [ collapsed, setCollapsed ] = useState(false);
  const pages = [
    {
      route: '/example1',
      text: 'Example',
      element: <Counter/>
    },
    {
      route: '/experiment1',
      text: 'Experiment 1',
      element: <Template/>
    }
  ]
  
  return (
    <HashRouter>
      <ScHeader className={ collapsed ? 'collapsed' : ''} onClick={() => setCollapsed(!collapsed)}>
        {pages.map((p, i) => (
          <Link key={i} to={p.route} className="link-button">
            <h2>{p.text}</h2>
          </Link>
        ))}
      </ScHeader>
      <ScStage>
        <Routes>
          {pages.map((p, i) => (
            <Route key={i} path={p.route} element={p.element} />
          ))}
        </Routes>
      </ScStage>
    </HashRouter>
  );
}

export default App;
