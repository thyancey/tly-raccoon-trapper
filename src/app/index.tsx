import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { PhaserContainer } from '../components/game/phaser-container';
import { Splash } from '../components/ui/splash';
import { useAppDispatch, useAppSelector } from '../services/hooks';
import { startGame, exitGame, selectGameStatus, selectPlayStatus } from '../services/game/status-slice';
import Sidebar from '../components/ui/sidebar';
import { createGame, killGame, resumeGame, pauseGame } from '../phaser/trapper';
import { getColor } from '../themes';
import { createGameInterface } from '../components/game/game-interface';
import { Modals } from '../components/ui/modals';
import { Music } from '../components/ui/components/music';

export const ScStage = styled.div`
  position:absolute;
  left:0rem;
  top:0rem;
  right:0rem;
  bottom:0rem;
  background-color:${getColor('brown_dark')};
`

export const RouteReader = ({ dispatch }: any) => {
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
  const playStatus = useAppSelector(selectPlayStatus);
  const dispatch = useAppDispatch();
  
  // only need to do this once, hence the []
  useEffect(() => {createGameInterface();}, [])
  
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
    if(playStatus === 'playing'){
      resumeGame();
    }else if(['won', 'lost', 'paused'].some(s => s === playStatus)){
      pauseGame();
    }
  }, [ playStatus ]);

  useEffect(() => {
    if(gameStatus === 'active'){
      createGame();
    }else{
      killGame();
    }
  }, [ gameStatus ]);
  
  return (
    <HashRouter>
      <RouteReader dispatch={dispatch}/>
      <Sidebar />
      <Modals />
      <Music />
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
