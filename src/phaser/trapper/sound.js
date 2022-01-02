
let gameContext;
let sceneContext;

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