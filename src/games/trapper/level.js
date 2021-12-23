import img_bg_yard from './assets/yard-bg.jpg';
import img_fg_yard from './assets/yard-fg.png';
import img_lane4_yard from './assets/yard-lane4.png';

import Values from './utils/values';

const DEBUG_ALPHA = 0;
const TRIGGER_DIMS = {
  width: 25,
  height: 100
};

let sceneContext;

export const setContext = (context) => {
  sceneContext = context;
}

export const preload = () => {
  sceneContext.load.image('bg-yard', img_bg_yard);
  sceneContext.load.image('fg-yard', img_fg_yard);
  sceneContext.load.image('lane4-yard', img_lane4_yard);
}

export const create = (levelData) => {

  const platforms = sceneContext.physics.add.staticGroup();
  const leftTrigger = sceneContext.physics.add.staticGroup();
  const rightTrigger = sceneContext.physics.add.staticGroup();
  // sceneContext.make.sprite(50, 50, 'bg-yard');
  
  sceneContext.add.image(0, 0, 'bg-yard').setOrigin(0).setScale(1).setDepth(Values.zindex.BACKGROUND);
  sceneContext.add.image(0, 0, 'fg-yard').setOrigin(0).setScale(1).setDepth(Values.zindex.FOREGROUND);
  sceneContext.add.image(0, 0, 'lane4-yard').setOrigin(0).setScale(1).setDepth(Values.zindex.LANE_4);
  const GAME_WIDTH = 900;

  levelData.lanes.forEach(pO => {
    const triggerY = pO.y - TRIGGER_DIMS.height;
    platforms.create(pO.x, pO.y, 'platform-floor').setDisplaySize(pO.width, pO.height).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
    leftTrigger.create(pO.x, triggerY, 'trigger-spawn').setDisplaySize(TRIGGER_DIMS.width, TRIGGER_DIMS.height).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
    rightTrigger.create(pO.x + pO.width - TRIGGER_DIMS.width, triggerY, 'trigger-end').setDisplaySize(TRIGGER_DIMS.width, TRIGGER_DIMS.height).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
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