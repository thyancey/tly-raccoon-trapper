import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { PhaserContainer } from '../components/phasercontainer';
import { Splash } from '../components/ui/splash';
import { useAppDispatch } from '../app/hooks';
import { startGame, exitGame } from '../components/ui/ui-slice';
import Sidebar from '../components/ui/sidebar';

export const ScStage = styled.div`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  padding-top:1rem;
`

export const RouteReader = () => {
  let location = useLocation();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if(location.pathname.indexOf('game') > -1){
      dispatch(startGame())
    }else{
      dispatch(exitGame())
    }
  }, [ location, dispatch ]);

  return null;
}

function App() {
  const pages = [
    {
      route: '',
      text: 'SPLASH',
      element: <Splash />
    },
    {
      route: '/game',
      text: 'RACCOON TRAPPER',
      element: <PhaserContainer/>
    }
  ]
  
  return (
    <HashRouter>
      <RouteReader />
      <Sidebar pages={pages} />
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
