import { MainScene } from './MainScene.js';
import { Level1Scene } from './Level1Scene.js';
import { Level2Scene } from './LevelWithEnemies.js';

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
  scene: [
    MainScene, 
    Level1Scene,
    Level2Scene
  ]
};

new Phaser.Game(config);

