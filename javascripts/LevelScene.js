import { Player } from "./Player.js";

export class LevelScene extends Phaser.Scene{
  constructor(){
    super("level")
  }
  init(data){
    Player.preload(this)
    this.player = new Player({
      scene:this,
      x:100,
      y:100,
      level: data
    })
  }

  preload(){
    this.load.tilemapTiledJSON('map_level',`./assets/maps/map${this.player.level}.json`);
    this.load.image('tiles','./assets/maps/terrain.png');
    this.load.image('restart', './assets/Free/Menu/Buttons/Restart.png')
    Player.preload(this)
  }

  create(){
    const map = this.make.tilemap({key: 'map_level', tileWidth: 16, tileHeight: 16})
    const tileset = map.addTilesetImage('Terrain (16x16)', 'tiles')
    this.background = map.createLayer('background', tileset)
    this.background.setCollisionByExclusion(-1, true);
    this.map = map.createLayer('map', tileset)
    this.map.setCollisionByExclusion(-1, true);

    const restartButton = this.add.image(460,40,'restart').setInteractive().setScrollFactor(0);
    restartButton.setScale(1.5)
    restartButton.setDepth(99)
    restartButton.fixedToCamera = true;
  
    restartButton.on('pointerup', () => {
      this.scene.start(this, this.player.level)
    })
    
    this.physics.add.collider(this.player, this.background);
    this.physics.add.collider(this.player, this.map);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.setBounds(0, 0);
    this.cameras.main.startFollow(this.player);


    this.anims.create({
      key: 'idle_right',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 0, end: 10 }),
      frameRate: 17,
      repeat: -1
    });
    this.anims.create({
      key: 'desappearingPlayer',
      frames: this.anims.generateFrameNumbers('player_disapear', { start: 0, end: 8 }),
      frameRate: 17,
    });
    this.anims.create({
      key: 'idle_left',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 11, end: 21 }),
      frameRate: 17,
      repeat: -1
    });
    this.anims.create({
      key: 'run_right',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 22, end: 33 }),
      frameRate: 17,
    });
    this.anims.create({
      key: 'run_left',
      frames: this.anims.generateFrameNumbers('player_sprite', { start: 35, end: 47 }),
      frameRate: 17,
    });

  }

  update(){
    this.player.update(this.cursors)
  }
}