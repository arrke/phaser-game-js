import { Player } from "./Player.js";

export class Level1Scene extends Phaser.Scene{
  constructor(){
    super("level1")
  }
  init(data){
    let{
      points,
      level
    } = data
    Player.preload(this)
    this.player = new Player({
      scene:this,
      x:100,
      y:100,
      level: level,
      points: points
    })
    this.latestPoints = points;
  }

  preload(){
    this.load.tilemapTiledJSON('map_level',`./assets/maps/map${this.player.level}.json`);
    this.load.image('spike','./assets/Free/Traps/Spikes/Idle.png');
    this.load.image('tiles','./assets/maps/terrain.png');
    this.load.image('restart', './assets/Free/Menu/Buttons/Restart.png')
    this.load.image('endlvl', 'assets/Free/Items/Checkpoints/Start/Start (Idle).png')

    Player.preload(this)
  }
  sendToNextLevel(){
    if(this.player.body.touching.down && this.check.body.touching.up){
      this.player.next(true, this.scene)
      this.player.body.x = 1000
    }
  }

  playerHit(){
    this.player.next(false)
    this.cameras.main.startFollow(this.player.disappearing);
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
  
    restartButton.on('pointerup', () => {
      this.scene.start(this, {
        level: this.player.level,
        points: this.latestPoints
      })
    })

    this.physics.add.collider(this.player, this.background);
    this.physics.add.collider(this.player, this.map);

    this.spikes = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
  
    map.getObjectLayer('spikes').objects.forEach((spike) => {
      // Add new spikes to our sprite group
      const spikeSprite = this.spikes.create(spike.x, spike.y- spike.height, 'spike').setOrigin(0);
      spikeSprite.body.setSize(spike.width-2, spike.height - 10).setOffset(0, 10);
    });
    this.physics.add.collider(this.player, this.spikes, this.playerHit, null, this);

    this.checkpoint = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    map.getObjectLayer('end').objects.forEach((checkpoint) => {
      // Add new checkpoints to our sprite group
      this.check = this.checkpoint.create(checkpoint.x, checkpoint.y- checkpoint.height, 'endlvl').setOrigin(0);
      this.check.body.setSize(checkpoint.width- 23, checkpoint.height - 55).setOffset(23, 55);
    });
    this.physics.add.collider(this.player, this.check, this.sendToNextLevel, null, this);

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

    this.point_text = this.add.text(20, 0, `Points : ${this.player.points}`).setScrollFactor(0);
    this.point_text.setDepth(99)
  }

  update(){
    this.player.update(this.cursors)
    this.point_text.setText(`Points : ${this.player.points}`)
  }
}