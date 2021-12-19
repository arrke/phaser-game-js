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
    this.load.spritesheet('spriteBird','./assets/maps/birdfatidle.png',{frameWidth: 40, frameHeight: 48},8)
    Player.preload(this)
    

    
  }
  playerHit(){
    this.player.next(false)
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
    this.spikes = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    this.birds = this.physics.add.group({
      allowGravity: false,
      key: 'birds',
      collidWorldBounds:true
    });


    map.getObjectLayer('spikes').objects.forEach((spike) => {
      // Add new spikes to our sprite group
      const spikeSprite = this.spikes.create(spike.x, spike.y- spike.height, 'spike').setOrigin(0);
      spikeSprite.body.setSize(spike.width-2, spike.height - 10).setOffset(0, 10);
    });
    this.physics.add.collider(this.player, this.spikes, this.playerHit, null, this);

    map.getObjectLayer('bird').objects.forEach((bird)=>{
      var bird=this.add.sprite(bird.x,bird.y-bird.height,'spriteBird').setOrigin(0)
      this.anims.create({
        key: 'idle_bird',
        frames: this.anims.generateFrameNumbers('spriteBird',{start:0, end:7}),
        frameRate:20,
        repeat:-1
      })
      bird.setSize(40,48)
      bird.anims.play('idle_bird',true)
      this.birds.add(bird);

    })
    this.physics.add.collider(this.player, this.birds, this.playerHit, null, this);
    this.physics.add.collider(this.birds,this.map);


  }

  update(){
    this.player.update(this.cursors)
    for(const bird of this.birds.children.entries)
    {
      if(bird.x-20<=this.player.x && bird.x+20>=this.player.x && this.player.y>bird.y)
      {
        bird.body.setVelocityY(200);
      }
      if(bird.body.blocked.down)
        {
          bird.body.setVelocityY(-100);
        }
    }
    
  }
}