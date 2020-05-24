import img_bar from '../assets/bar.png';

let platforms;
let sceneContext;


export const setContext = (context) => {
  sceneContext = context;
}

export const preload = () => {
  sceneContext.load.image('bar', img_bar);
}

export const create = () => {
  platforms = sceneContext.physics.add.staticGroup();
  platforms.create(450, 500, 'bar').setScale(4, .5).refreshBody();
  platforms.create(800, 480, 'bar');
  platforms.create(50, 220, 'bar').setScale(-1, .5).refreshBody();

  return platforms;
}

export default {
  setContext,
  preload,
  create
}