import './style.scss';
import { createGame } from './games/trapper';
import { createHeader } from './page';

const start = () => {
  createHeader();
  createGame()
};

start();