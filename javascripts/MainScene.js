import { Player } from "./Player.js";

export class MainScene extends Phaser.Scene{
  constructor(){
    super("MainScene");
  }

  preload(){
    Player.preload(this)
  }

  create(){
    this.player = new Player(
      {
        scene:this,
        x:0,
        y: 0,
        texture: 'male',
        frame: 'townsfold_m_idle_1'
      }
    );

    //Poruszanie gracza
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    })
  }
  update(){
    this.player.update();
  }
}