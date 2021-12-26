import Phaser from 'phaser';

let game;

export const createGame = () =>{
  const config = {
    type: Phaser.AUTO,
    width: 800,
    parent: 'game-container',
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
  }
  game = new Phaser.Game(config);
}

function preload(){
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create(){
  this.add.image(400, 300, 'sky');
  this.add.image(400, 300, 'star');
  this.add.image(450, 350, 'star');
}

function update(){

}
global.game = game;