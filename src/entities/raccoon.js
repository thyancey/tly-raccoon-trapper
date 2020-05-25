import Phaser from "phaser";

const KILL_TIMEOUT = 5000;

export const STATUS = {
  ROAMING: 0,
  EATING: 1,
  ANGRY: 2,
  TAME: 3
}

const animationStatus = {
  [STATUS.ROAMING]: 'raccoonTest_walk',
  [STATUS.EATING]: 'raccoonTest_eat',
  [STATUS.ANGRY]: 'raccoonTest_walk',
  [STATUS.TAME]: 'raccoonTest_loveWalk',
  [STATUS.DEAD]: 'raccoonTest_dead'
}

export class Raccoon extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y, physicsGroup) {
    super(scene, x, y, 'raccoonTest');

    // this.status = STATUS.ROAMING;
    this.love = 0;
    this.maxLove = 100;

    //- custom properties
    this.isAlive = true;

    //- parent stuff
    scene.add.existing(this);
    if(physicsGroup){
      physicsGroup.add(this);
    }else{
      scene.physics.add.existing(this);
    }
    
    //- physics
    this.setBounce(.4);
    this.setCollideWorldBounds(true);
    this.allowGravity = false;

    //- squeeze in hit box from edge of sprite
    this.body.setSize(60,70);
    this.body.offset.x = 35;
    this.body.offset.y = 30;
    // this.anims.play('raccoonTest_walk');
    this.setStatus(STATUS.ROAMING, true);

    //- interaction listeners
    this.setInteractive();
    this.on('pointerdown', (thing) => {
      this.kill();
    });
  }

  kill(){
    this.setStatus(STATUS.DEAD);
    this.body.setDrag(500);
    this.isAlive = false;

    global.setTimeout(() => {
      this.destroy();
    }, KILL_TIMEOUT)
  }

  update(){
    //- turn if facing left
    if(this.flipX){
      if(this.body.velocity.x > 0) this.flipX = false;
    }else{
      if(this.body.velocity.x < 0) this.flipX = true;
    }

    this.checkForJump(.05);
  }

  checkForJump(chance){
    if(this.isAlive && this.status === STATUS.ROAMING && this.body.touching.down && Math.random() < chance){
      this.setVelocityX((1 + Math.random()) * this.body.velocity.x);
      this.setVelocityY(Math.random() * - 300);
    }
  }

  //- if 
  touched(key){
    // console.log('touched')
    if(this.status !== STATUS.TAME && this.status !== STATUS.EATING){
      this.setStatus(STATUS.EATING);
    }
  }

  setStatus(status, force){
    if(force || this.status !== status){
      this.status = status;

      switch(this.status){
        case STATUS.EATING: this.body.velocity.x = 0; break;
      }
      const animKey = animationStatus[this.status];
      if(animKey){
        console.log('play', animKey)
        this.anims.play(animKey);
      }
    }
  }
}