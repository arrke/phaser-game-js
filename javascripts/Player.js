
export class Player extends Phaser.Physics.Arcade.Sprite{
  constructor(scene){
    super(scene, 100, 200, 'player_sprite')
    scene.physics.add.existing(this);
    this.scene.add.existing(this, true) 
    this.body.setSize(this.body.width-10,this.body.height-2)
  }

  static preload(scene){
    scene.load.spritesheet('player_sprite', './assets/player.png', { frameWidth: 32, frameHeight: 32 })
    scene.load.spritesheet('player_disapear', './assets/Free/Main Characters/Desappearing (96x96).png', { frameWidth: 96, frameHeight: 96 })
  }

  create(){
    this.setVelocity(100, 200);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    
  }

  update(cursors){
    if(this.visible){
      if (cursors.left.isDown)
    {
      this.anims.play('run_left', true);
      this.lastDirection = "left"
      this.setVelocityX(-160);
    }
    else if (cursors.right.isDown)
    {
      this.anims.play('run_right', true);
      this.lastDirection = "right"
      this.setVelocityX(160);
    }
    else
    {   if(this.lastDirection == 'left')
          this.anims.play('idle_left', true);
        else this.anims.play('idle_right', true)
        this.setVelocityX(0);
    }
    if (cursors.up.isDown && this.body.onFloor())
    {
        this.setVelocityY(-330);
    }
    }else{
      this.setVelocityY(0);
      this.setVelocityX(0);
    }
  }

  next(){
    this.visible = false
    this.disappearing = this.scene.add.sprite(this.body.x, this.body.y, 'player_disapear');
    this.disappearing.play("desappearingPlayer")  
    this.disappearing.on('animationcomplete', function(){
      console.log(this.visible = false)
    });
    this.x = 100
    this.y = 200
  }

}