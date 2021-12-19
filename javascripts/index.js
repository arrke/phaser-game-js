import { MainScene } from './MainScene.js';
var config = {
  type: Phaser.AUTO,
  width: 512,
  height: 512 ,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 900 },
          debug: true
      }
  },
  scene: [MainScene]
};

new Phaser.Game(config);

