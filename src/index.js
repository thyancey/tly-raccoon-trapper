import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import img_blood from "./assets/blood.png";
import './style.scss';

import { spawn_update, spawn_preload, spawn_create } from './spawn-manager';

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 900,
  height: 500,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 800 },
          debug: false
      }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);
let emitter;

function preload() {
  this.load.image('blood', img_blood);
  spawn_preload(this);

}

function onObjectClicked(pointer, gameObject){
  // gameObject.anims.play('raccoon_dead');
  // console.log('clicked it', gameObject);
  // gameObject.kill();

  emitter.setPosition(pointer.x, pointer.y);
  // emitter.reset();
  emitter.explode(20);
  emitter.visible = true;
}

function create() {
  // const logo = this.add.image(400, 150, "logo");

  spawn_create(this);

  
  this.input.on('gameobjectdown', onObjectClicked);

  // this.tweens.add({
  //   targets: logo,
  //   y: 450,
  //   duration: 2000,
  //   ease: "Power2",
  //   yoyo: true,
  //   loop: -1
  // });

  var particles = this.add.particles('blood');
/*
  emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: 'ADD',
  });
*/

// emitter = particles.createEmitter({
//   speed: 100,
//   scale: { start: 1, end: 0 },
//   blendMode: 'ADD',
//   maxParticles: 10
// });

  emitter = particles.createEmitter({
    // speed: 100,
    // scale: { start: 1, end: 0 },
    // active:false,
    visible: false,
    blendMode: 'SCREEN',
    speed: { min: -400, max: 400 },
    angle: { min: 0, max: 360 },
    scale: { start: 1, end: 0 },
    lifespan: 500,
    gravityY: 1000
  });
}

function update ()
{
    // console.log('hi')
    spawn_update();
}