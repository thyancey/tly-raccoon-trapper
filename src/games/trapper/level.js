import img_bar_red from './assets/bar-red.png';
import img_bar_yellow from './assets/bar-yellow.png';
import img_bar_green from './assets/bar-green.png';
import img_bar_blue from './assets/bar-blue.png';
import img_bar_purple from './assets/bar-purple.png';
import img_bar_grey from './assets/bar-grey.png';
import img_bar_white from './assets/bar-white.png';

let sceneContext;


export const setContext = (context) => {
  sceneContext = context;
}

export const preload = () => {
  sceneContext.load.image('bar-red', img_bar_red);
  sceneContext.load.image('bar-yellow', img_bar_yellow);
  sceneContext.load.image('bar-green', img_bar_green);
  sceneContext.load.image('bar-blue', img_bar_blue);
  sceneContext.load.image('bar-purple', img_bar_purple);
  sceneContext.load.image('bar-grey', img_bar_grey);
  sceneContext.load.image('bar-white', img_bar_white);
}

export const create = (levelData) => {
  const platforms = sceneContext.physics.add.staticGroup();
  const leftTrigger = sceneContext.physics.add.staticGroup();
  const rightTrigger = sceneContext.physics.add.staticGroup();

  const spawnW = parseInt(levelData.values.spawn_width);
  levelData.platforms.forEach(pO => {
    const x = parseInt(pO.x);
    const y = parseInt(pO.y);
    // const w = parseInt(pO.width) / 100;
    const w = 900 - x;
    const h = parseInt(pO.height) / 100;
    const endX = parseInt(pO.width) + x + 60;

    platforms.create(x, y, 'bar-white').setScale(w, h).setOrigin(0,0).refreshBody();
    platforms.create(x - spawnW, y, 'bar-purple').setScale(1, h).setOrigin(0,0).refreshBody();
    leftTrigger.create(x - (spawnW) - 20, y - 100, 'bar-green').setScale(1, 10).setOrigin(0,0).setAlpha(.5).refreshBody();
    rightTrigger.create(endX, y - 100, 'bar-red').setScale(1, 10).setOrigin(0,0).setAlpha(.5).refreshBody();
  });

  return {
    platforms,
    leftTrigger,
    rightTrigger
  }
}

export default {
  setContext,
  preload,
  create
}