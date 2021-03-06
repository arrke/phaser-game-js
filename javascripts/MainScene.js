import {Player} from './Player.js'

export class MainScene extends Phaser.Scene{

  constructor(){
    super("MainScene")
  }
  
  preload ()
  {
    this.load.image('tiles','./assets/maps/terrain.png');
    this.load.image('spike','./assets/Free/Traps/Spikes/Idle.png');
    this.load.image('endlvl', 'assets/Free/Items/Checkpoints/Start/Start (Idle).png')
    this.load.spritesheet('spriteFruitKey', 'assets/Free/Items/Fruits/Pineapple.png',{ frameWidth: 32, frameHeight: 32 }, 17)
    this.load.spritesheet('spriteFruit', 'assets/Free/Items/Fruits/Apple.png',{ frameWidth: 32, frameHeight: 32 }, 17)
    this.load.spritesheet('colletedSpriteFruit', 'assets/Free/Items/Fruits/Collected.png',{ frameWidth: 32, frameHeight: 32 }, 17)

    this.load.tilemapTiledJSON('map','./assets/maps/map0.json');
    this.load.image('restart', './assets/Free/Menu/Buttons/Restart.png')
    Player.preload(this)
  }
  playerHit(){
    this.player.next(false)
  }
  

  sendToNextLevel(){
    if(this.player.body.touching.down && this.check.body.touching.up){
      this.player.next(true, this.scene)
      this.player.body.x = 1000
    }
  }

  getKey(){
    this.physics.world.removeCollider(this.keyCollider);
    this.key.remove()
    this.unlockKey.destroy()
    if(this.notDestroyed){
      this.physics.world.removeCollider(this.wallCollider);
      this.walls.destroy()
      this.notDestroyed = false;
    }
  }

  getPoints(sprite, fruit){
    this.fruits.killAndHide(fruit);
    fruit.body.enable = false;
    var nowCollectedFruit= this.add.sprite(fruit.body.x + fruit.body.width/2, fruit.body.y + fruit.body.height/2, 'colletedSpriteFruit');
    this.player.addPoints(10)
    nowCollectedFruit.play("collectedFruitAnim")
    nowCollectedFruit.on('animationcomplete', function(){
      this.visible = false
    });
  }

create ()
{
    const map = this.make.tilemap({key: 'map', tileWidth: 16, tileHeight: 16})
    const tileset = map.addTilesetImage('terrain', 'tiles')

    const restartButton = this.add.image(460,40,'restart').setInteractive()
    restartButton.setScale(1.5)
    restartButton.setDepth(99)
    restartButton.on('pointerup', () => {
      this.scene.start(this)
    })
    this.notDestroyed = true;
    this.border = map.createLayer('border', tileset)
    this.terrain = map.createLayer('terrain', tileset)
    this.walls = map.createLayer('walls', tileset)
    this.border.setCollisionByProperty({colides:true})
    this.terrain.setCollisionByExclusion(-1, true);
    this.walls.setCollisionByProperty({colides:true})

  this.anims.create({
    key: 'idle_right',
    frames: this.anims.generateFrameNumbers('player_sprite', { start: 0, end: 10 }),
    frameRate: 17,
    repeat: -1
  });

  this.anims.create({
    key: 'collectedFruitAnim',
    frames: this.anims.generateFrameNumbers('colletedSpriteFruit', { start: 0, end: 5 }),
    frameRate: 20,
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

  this.player = new Player({
    scene:this,
    x:100,
    y:200,
    level: 0,
    points: 0
  });

  this.cursors = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(this.player, this.terrain);
  this.physics.add.collider(this.player, this.border);
  this.wallCollider = this.physics.add.collider(this.player, this.walls);

  //Dodanie kolc??w
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

  //Dodanie przej??cia na kolejn?? mapk??
  this.checkpoint = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });
  map.getObjectLayer('checkpoint').objects.forEach((checkpoint) => {
    // Add new checkpoints to our sprite group
    this.check = this.checkpoint.create(checkpoint.x, checkpoint.y- checkpoint.height, 'endlvl').setOrigin(0);
    this.check.body.setSize(checkpoint.width- 23, checkpoint.height - 55).setOffset(23, 55);
    
  });


  this.key = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  map.getObjectLayer('keys').objects.forEach((keyObj) => {
   
    this.unlockKey = this.add.sprite(keyObj.x, keyObj.y- keyObj.height, 'spriteFruitKey').setOrigin(0);

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('spriteFruitKey', { start: 0, end: 16 }),
      frameRate: 17,
      repeat: -1
    });
    this.unlockKey.anims.play('idle', true)
    this.key.add(this.unlockKey)
    
  });

  this.fruits = this.physics.add.group({
    allowGravity: false,
    immovable: true,
    key: 'fruits'
  });

  map.getObjectLayer('fruitPoints').objects.forEach((fruit) => {
   
    var fruit = this.add.sprite(fruit.x, fruit.y- fruit.height, 'spriteFruit').setOrigin(0).setScale(0.8);
    fruit.setSize(fruit.width, fruit.height, true);
    this.anims.create({
      key: 'idle_point',
      frames: this.anims.generateFrameNumbers('spriteFruit', { start: 0, end: 16 }),
      frameRate: 30,
      repeat: -1
    });

    fruit.anims.play('idle_point', true)
    this.fruits.add(fruit)
    
  });


  this.physics.add.collider(this.player, this.spikes, this.playerHit, null, this);
  this.physics.add.collider(this.player, this.check, this.sendToNextLevel, null, this);
  this.physics.add.overlap(this.player, this.fruits, this.getPoints, null, this);
  
  this.keyCollider = this.physics.add.collider(this.player, this.key, this.getKey, null, this);
  
  this.point_text = this.add.text(20, 0, `Points : ${this.player.points}`)
  this.point_text.setDepth(99)
}

  update ()
  {
    this.player.update(this.cursors)
    this.point_text.setText(`Points : ${this.player.points}`)
  }

  
}