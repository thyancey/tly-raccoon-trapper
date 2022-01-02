
let gameContext;
let sceneContext;

export const SOUNDS = {
  SPLAT: null,
  GOOD: 'sfxtest_trainwhistle',
  BAD: 'sfxtest_slidewhistle',
  HUG: 'sfxtest_trainwhistle',
  ENEMY_BITE: 'sfxtest_bite',
  ENEMY_EATING: 'sfxtest_eat',
  ENEMY_CAPTURED: 'sfxtest_trainwhistle',
  ENEMY_ESCAPED: 'sfxtest_slidewhistle',
}

export const init = (sContext, gContext) => {
  gameContext = gContext;
  sceneContext = sContext;
}

export const preload = () => {
  sceneContext.load.audioSprite('sfx_test', './assets/sfx/sfx-test.json', [ 'assets/sfx/sfx-test.ogg', 'assets/sfx/sfx-test.mp3'] );
}

export const playSound = (soundKey, params = {}) => {
  gameContext.sound.playAudioSprite('sfx_test', soundKey, params);
}