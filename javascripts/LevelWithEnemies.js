import { EnemyMushroom } from "./EnemyMushroom.js";
import { Player } from "./Player.js";

export class Level2Scene extends Phaser.Scene{
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
      x:70,
      y:20,
      level: level,
      points: points
    })
    this.latestPoints = points;
  }

  preload(){
    this.load.tilemapTiledJSON('map_level2',`./assets/maps/mapa2.json`);
    this.load.image('spike','./assets/Free/Traps/Spikes/Idle.png');
    this.load.image('tiles','./assets/maps/terrain.png');
    this.load.image('restart', './assets/Free/Menu/Buttons/Restart.png')
    this.load.image('endlvl', 'assets/Free/Items/Checkpoints/Start/Start (Idle).png')
    this.load.spritesheet('spriteFruit', 'assets/Free/Items/Fruits/Kiwi.png',{ frameWidth: 32, frameHeight: 32 }, 17)
    this.load.spritesheet('colletedSpriteFruit', 'assets/Free/Items/Fruits/Collected.png',{ frameWidth: 32, frameHeight: 32 }, 17)
    EnemyMushroom.preload(this)
    Player.preload(this)
  }

  sendToNextLevel(){
    if(this.player.body.touching.down && this.check.body.touching.up){
      this.player.next(true, this.scene)
      this.player.body.x = 1000
    }
  }

  killMushroom(player, mush){
    if(player.body.onFloor() && mush.body.touching.up){
      player.addPoints(50)
      this.firstMobs.killAndHide(mush);
      var nowCollectedFruit= this.add.sprite(mush.body.x + mush.body.width/2, mush.body.y + mush.body.height/2, 'mushroom');
      nowCollectedFruit.play("mushroom_dead")
      nowCollectedFruit.on('animationcomplete', function(){
        this.visible = false
      });
      mush.destroy()
      if(this.firstMobs.countActive(false) == 0){
        this.physics.world.removeCollider(this.firstWallCollider);
        this.firstWall.visible= false
      }
    }else{
      player.next(false)  
    }
  }
  
  killMushroom2(player, mush){
    if(player.body.onFloor() && mush.body.touching.up){
      player.addPoints(50)
      this.secondMobs.killAndHide(mush);
      var nowCollectedFruit= this.add.sprite(mush.body.x + mush.body.width/2, mush.body.y + mush.body.height/2, 'mushroom');
      nowCollectedFruit.play("mushroom_dead")
      nowCollectedFruit.on('animationcomplete', function(){
        this.visible = false
      });
      mush.destroy()  
      if(this.secondMobs.countActive(false) ===  0){ 
        this.physics.world.removeCollider(this.secondWallCollider);
        this.secondWall.visible= false
      }
    }else{
      player.next(false)  
    }
  }

  killMushroom3(player, mush){
    if(player.body.onFloor() && mush.body.touching.up){
      player.addPoints(50)
      this.thirdMobs.killAndHide(mush);
      var nowCollectedFruit= this.add.sprite(mush.body.x + mush.body.width/2, mush.body.y + mush.body.height/2, 'mushroom');
      nowCollectedFruit.play("mushroom_dead")
      nowCollectedFruit.on('animationcomplete', function(){
        this.visible = false
      });
      mush.destroy()  
      if(this.thirdMobs.countActive(false) ===  0){ 
        this.physics.world.removeCollider(this.thirdWallCollider);
        this.thirdWall.visible= false
      }
    }else{
      player.next(false)  
    }
  }

  killMushroom4(player, mush){
    if(player.body.onFloor() && mush.body.touching.up){
      player.addPoints(50)
      this.fourthMobs.killAndHide(mush);
      var nowCollectedFruit= this.add.sprite(mush.body.x + mush.body.width/2, mush.body.y + mush.body.height/2, 'mushroom');
      nowCollectedFruit.play("mushroom_dead")
      nowCollectedFruit.on('animationcomplete', function(){
        this.visible = false
      });
      mush.destroy()  
      if(this.fourthMobs.countActive(false) ===  0){ 
        this.physics.world.removeCollider(this.fourthWallCollider);
        this.fourthWall.visible= false
      }
    }else{
      player.next(false)  
    }
  }

  playerHit(){
    this.player.next(false)
    this.cameras.main.startFollow(this.player.disappearing);
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
  
  create(){
    const map = this.make.tilemap({key: 'map_level2', tileWidth: 16, tileHeight: 16})
    const tileset = map.addTilesetImage('terrain', 'tiles')

    this.border = map.createLayer('border', tileset)
    this.firstWall = map.createLayer('firstWall', tileset)
    this.secondWall = map.createLayer('secondWall', tileset)
    this.thirdWall = map.createLayer('thirdWall', tileset)
    this.fourthWall = map.createLayer('fourthWall', tileset)

    const restartButton = this.add.image(460,40,'restart').setInteractive().setScrollFactor(0);
    restartButton.setScale(1.5)
    restartButton.setDepth(99)
    restartButton.on('pointerup', () => {
      this.scene.start(this,
        {
          level: this.player.level,
          points: this.latestPoints
        }
      )
    })

    this.border.setCollisionByExclusion(-1, true);
    this.firstWall.setCollisionByExclusion(-1, true);
    this.secondWall.setCollisionByExclusion(-1, true);
    this.thirdWall.setCollisionByExclusion(-1, true);
    this.fourthWall.setCollisionByExclusion(-1, true);


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
      key: 'mushroom_run_left',
      frames: this.anims.generateFrameNumbers('mushroom', { start: 0, end: 15 }),
      frameRate: 17,
      repeat: true
    });
    this.anims.create({
      key: 'mushroom_run_right',
      frames: this.anims.generateFrameNumbers('mushroom', { start: 16, end: 31 }),
      frameRate: 17,
      repeat: true
    });
    this.anims.create({
      key: 'mushroom_dead',
      frames: this.anims.generateFrameNumbers('mushroom', { start: 32, end: 36}),
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

    this.fruits = this.physics.add.group({
      allowGravity: false,
      immovable: true,
      key: 'fruits'
    });
  
    map.getObjectLayer('fruitPoints').objects.forEach((fruit) => {
     
      var fruit = this.add.sprite(fruit.x, fruit.y- fruit.height, 'spriteFruit').setOrigin(0).setScale(0.8);
      fruit.setSize(fruit.width, fruit.height, true);
      this.anims.create({
        key: 'idle_level2_point',
        frames: this.anims.generateFrameNumbers('spriteFruit', { start: 0, end: 16 }),
        frameRate: 30,
        repeat: -1
      });
  
      fruit.anims.play('idle_level2_point', true)
      this.fruits.add(fruit)
    
    });

    this.firstMobs = this.physics.add.group({
      allowGravity: true,
      immovable: true,
      key: 'firstMobs'
    });
  
    map.getObjectLayer('firstMobs').objects.forEach((enemy) => {
     
      var mush = new EnemyMushroom({
        scene: this,
        x: enemy.x,
        y: enemy.y - enemy.height
      });

      this.firstMobs.add(mush)
    
    });
    for(const mush of this.firstMobs.children.entries){
      this.physics.add.collider(mush, this.border, mush.changeDirection)
      this.physics.add.collider(mush, this.firstWall);
    }

    this.physics.add.collider(this.player, this.firstMobs, this.killMushroom, null, this);

    this.secondMobs = this.physics.add.group({
      allowGravity: true,
      immovable: true,
      key: 'secondMobs'
    });
  
    map.getObjectLayer('secondMobs').objects.forEach((enemy) => {
     
      var mush = new EnemyMushroom({
        scene: this,
        x: enemy.x,
        y: enemy.y - enemy.height
      });

      this.secondMobs.add(mush)
    
    });
    for(const mush of this.secondMobs.children.entries){
      this.physics.add.collider(mush, this.border, mush.changeDirection)
      this.physics.add.collider(mush, this.secondWall);
    }

    this.physics.add.collider(this.player, this.secondMobs, this.killMushroom2, null, this);

    this.thirdMobs = this.physics.add.group({
      allowGravity: true,
      immovable: true,
      key: 'thirdMobs'
    });
  
    map.getObjectLayer('thirdMobs').objects.forEach((enemy) => {
     
      var mush = new EnemyMushroom({
        scene: this,
        x: enemy.x,
        y: enemy.y - enemy.height
      });

      this.thirdMobs.add(mush)
    
    });
    for(const mush of this.thirdMobs.children.entries){
      this.physics.add.collider(mush, this.border, mush.changeDirection)
      this.physics.add.collider(mush, this.thirdWall);
    }

    this.physics.add.collider(this.player, this.thirdMobs, this.killMushroom3, null, this);

    this.fourthMobs = this.physics.add.group({
      allowGravity: true,
      immovable: true,
      key: 'fourthMobs'
    });
  
    map.getObjectLayer('fourthMobs').objects.forEach((enemy) => {
     
      var mush = new EnemyMushroom({
        scene: this,
        x: enemy.x,
        y: enemy.y - enemy.height
      });

      this.fourthMobs.add(mush)
    
    });
    for(const mush of this.fourthMobs.children.entries){
      this.physics.add.collider(mush, this.border, mush.changeDirection)
      this.physics.add.collider(mush, this.fourthWall);
    }

    this.physics.add.collider(this.player, this.fourthMobs, this.killMushroom4, null, this);


    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0);
    this.cameras.main.startFollow(this.player);

    this.physics.add.collider(this.player, this.border);
    this.firstWallCollider = this.physics.add.collider(this.player, this.firstWall);
    this.secondWallCollider = this.physics.add.collider(this.player, this.secondWall);
    this.thirdWallCollider = this.physics.add.collider(this.player, this.thirdWall);
    this.fourthWallCollider = this.physics.add.collider(this.player, this.fourthWall);


    this.physics.add.overlap(this.player, this.fruits, this.getPoints, null, this);

    this.point_text = this.add.text(20, 0, `Points : ${this.player.points}`).setScrollFactor(0);
    this.point_text.setDepth(99)

  }

  update(){
    this.player.update(this.cursors)
    this.point_text.setText(`Points : ${this.player.points}`)
    for(const mush of this.firstMobs.children.entries){
      mush.update()
    }
    for(const mush of this.secondMobs.children.entries){
      mush.update()
    }
    for(const mush of this.thirdMobs.children.entries){
      mush.update()
    }
    for(const mush of this.fourthMobs.children.entries){
      mush.update()
    }
  }
}