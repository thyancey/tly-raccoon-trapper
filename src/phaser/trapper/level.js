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
  sceneContext.load.image('bg', './assets/levels/level-backyard-0.jpg');
  sceneContext.load.image('lane1', './assets/levels/level-backyard-1.png');
  sceneContext.load.image('lane2', './assets/levels/level-backyard-2.png');
  sceneContext.load.image('lane3', './assets/levels/level-backyard-3.png');
  sceneContext.load.image('fg', './assets/levels/level-backyard-4.png');
  // sceneContext.load.image('fg-yard', './assets/yard-fg.png');
  // sceneContext.load.image('lane4-yard', './assets/yard-lane4.png');
}

export const create = (levelData) => {

  const platforms = sceneContext.physics.add.staticGroup();
  const leftTrigger = sceneContext.physics.add.staticGroup();
  const rightTrigger = sceneContext.physics.add.staticGroup();
  // sceneContext.make.sprite(50, 50, 'bg-yard');
  
  sceneContext.add.image(0, 0, 'bg').setOrigin(0).setScale(1).setDepth(Values.zindex.BACKGROUND);
  sceneContext.add.image(0, 0, 'lane1').setOrigin(0).setScale(1).setDepth(Values.zindex.LANE_2);
  sceneContext.add.image(0, 0, 'lane2').setOrigin(0).setScale(1).setDepth(Values.zindex.LANE_3);
  sceneContext.add.image(0, 0, 'lane3').setOrigin(0).setScale(1).setDepth(Values.zindex.LANE_4);
  sceneContext.add.image(0, 0, 'fg').setOrigin(0).setScale(1).setDepth(Values.zindex.FOREGROUND);
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