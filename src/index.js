import Phaser from "phaser";
import logoImg from "./assets/logo.png";

import { spawn_update, spawn_preload, spawn_create } from './spawn-manager';

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
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

function preload() {
  this.load.image("logo", logoImg);
  spawn_preload(this);

}

function create() {
  const logo = this.add.image(400, 150, "logo");

  spawn_create(this);

  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 2000,
    ease: "Power2",
    yoyo: true,
    loop: -1
  });
}

function update ()
{
    // console.log('hi')
    spawn_update();
}