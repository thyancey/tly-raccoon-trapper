import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { PhaserContainer } from '../components/phasercontainer';
import { Splash } from '../components/ui/splash';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { startGame, exitGame, selectGameStatus } from '../components/ui/ui-slice';
import Sidebar from '../components/ui/sidebar';
import { createGame, killGame } from '../phaser/trapper';
import { getColor } from '../themes';

export const ScStage = styled.div`
  position:absolute;
  left:0rem;
  top:0rem;
  right:0rem;
  bottom:0rem;
  background-color:${getColor('brown_dark')};
`

export const RouteReader = ({ dispatch }) => {
  let location = useLocation();
  
  useEffect(() => {
    if(location.pathname.indexOf('game') > -1){
      dispatch(startGame());
    }else{
      dispatch(exitGame())
    }
  }, [ location, dispatch ]);

  return null;
}

function App() {
  const gameStatus = useAppSelector(selectGameStatus);
  const dispatch = useAppDispatch();
  
  const pages = [
    {
      route: '',
      text: 'SPLASH',
      element: <Splash />
    },
    {
      route: '/game',
      text: 'RACCOON TRAPPER',
      element: <PhaserContainer />
    }
  ]

  useEffect(() => {
    if(gameStatus === 'active'){
      createGame();
    }else{
      killGame();
    }
  }, [ gameStatus, dispatch ]);
  
  return (
    <HashRouter>
      <RouteReader dispatch={dispatch}/>
      <Sidebar />
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
