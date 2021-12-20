import { MainScene } from './MainScene.js';
import { Level1Scene } from './Level1Scene.js';
import { Level2Scene } from './LevelWithEnemies.js';
import { Level3Scene } from './LevelBird3.js';

var config = {
  type: Phaser.AUTO,
  width: 512,
  height: 512 ,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 900 },
          debug: false
      }
  },
  scene: [
    MainScene, 
    Level1Scene,
    Level2Scene,
    Level3Scene
  ]
};

new Phaser.Game(config);

