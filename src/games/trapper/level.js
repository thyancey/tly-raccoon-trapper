import img_bar_red from './assets/bar-red.png';
import img_bar_yellow from './assets/bar-yellow.png';
import img_bar_green from './assets/bar-green.png';
import img_bar_blue from './assets/bar-blue.png';
import img_bar_purple from './assets/bar-purple.png';
import img_bar_grey from './assets/bar-grey.png';
import img_bar_white from './assets/bar-white.png';
import img_bg_yard from './assets/yard-bg.jpg';
import img_fg_yard from './assets/yard-fg.png';
import img_lane4_yard from './assets/yard-lane4.png';

import Values from './utils/values';

const DEBUG_ALPHA = 0;

let sceneContext;

export const setContext = (context) => {
  sceneContext = context;
}

export const preload = () => {
  sceneContext.load.image('bg-yard', img_bg_yard);
  sceneContext.load.image('fg-yard', img_fg_yard);
  sceneContext.load.image('lane4-yard', img_lane4_yard);
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
  // sceneContext.make.sprite(50, 50, 'bg-yard');
  
  sceneContext.add.image(0, 0, 'bg-yard').setOrigin(0).setScale(1).setDepth(Values.zindex.BACKGROUND);
  sceneContext.add.image(0, 0, 'fg-yard').setOrigin(0).setScale(1).setDepth(Values.zindex.FOREGROUND);
  sceneContext.add.image(0, 0, 'lane4-yard').setOrigin(0).setScale(1).setDepth(Values.zindex.LANE_4);

  const spawnW = parseInt(levelData.values.spawn_width);
  levelData.platforms.forEach(pO => {
    const x = parseInt(pO.x);
    const y = parseInt(pO.y);
    // const w = parseInt(pO.width) / 100;
    const w = 900 - x;
    const h = parseInt(pO.height) / 100;
    const deadX = parseInt(pO.width) + x + 60;
    const porchX = parseInt(pO.width) + x - 120;

    platforms.create(x, y, 'bar-white').setScale(w, h).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
    platforms.create(x - spawnW, y, 'bar-purple').setScale(1, h).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
    leftTrigger.create(x - (spawnW) - 20, y - 100, 'bar-green').setScale(1, 10).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
    rightTrigger.create(deadX, y - 100, 'bar-red').setScale(1, 10).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
    platforms.create(porchX, y - 10  , 'bar-white').setScale(3, 2).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
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