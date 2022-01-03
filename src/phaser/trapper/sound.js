
let gameContext;
let sceneContext;

export const SOUNDS = {
  SPLAT: 'crash',
  GOOD: 'beepUp',
  BAD: 'beepDown',
  BOWL_LOST: 'beepBoop',
  BOWL_SLING: 'charge_slice',
  ENEMY_HUG: 'beepUp',
  ENEMY_BITE: 'chomp',
  ENEMY_EATING: 'chomp_repeat',
  ENEMY_CAPTURED: 'beepUp',
  ENEMY_ESCAPED: 'badBeep',
  KICK: 'bigPunt',
  CHARGE: 'chargeUp',
  PLAYER_HUG: 'beep',
  CHANGE_LANE: 'beepDown_slice'
}

export const init = (sContext, gContext) => {
  gameContext = gContext;
  sceneContext = sContext;
}

export const preload = () => {
  sceneContext.load.audioSprite('sfx', './assets/sfx/sfx.json', [ 'assets/sfx/sfx.ogg', 'assets/sfx/sfx.mp3'] );
}

export const playSound = (soundKey, params = {}) => {
  const sound = gameContext.sound.addAudioSprite('sfx');
  sound.play(soundKey, params);
  return sound;
}

export const cancelSound = soundThing => {
  return gameContext.sound.remove(soundThing)
}