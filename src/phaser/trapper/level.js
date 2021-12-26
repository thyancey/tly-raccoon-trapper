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
  sceneContext.load.image('bg-yard', './assets/yard-bg.jpg');
  sceneContext.load.image('fg-yard', './assets/yard-fg.png');
  sceneContext.load.image('lane4-yard', './assets/yard-lane4.png');
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
    // lets animals keep walkin past trigger, otherwise keep it at pO.width
    const platformWidth = GAME_WIDTH - pO.x;

    platforms.create(pO.x, pO.y, 'platform-floor').setDisplaySize(platformWidth, pO.height).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
    leftTrigger.create(pO.x, triggerY, 'trigger-spawn').setDisplaySize(TRIGGER_DIMS.width, TRIGGER_DIMS.height).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
    rightTrigger.create(pO.x + pO.width - TRIGGER_DIMS.width, triggerY, 'trigger-end').setDisplaySize(TRIGGER_DIMS.width, TRIGGER_DIMS.height).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
  });

  return {
    platforms,
    leftTrigger,
    rightTrigger
  }
}

const exportMap = {
  setContext,
  preload,
  create
}
export default exportMap; 