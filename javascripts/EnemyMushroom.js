export class EnemyMushroom extends Phaser.Physics.Arcade.Sprite{
  constructor(data){
    let{
      scene,
      x,
      y,
    } = data
    super(scene, x, y, 'mushroom')
    scene.physics.add.existing(this);
    this.scene.add.existing(this, true) 
    this.body.setSize(this.body.width-10,this.body.height-2)
    this.setDepth(99);
    if(Math.random * 1245 / 5 % 2 == 0){
      this.direction = 'left'
    }
    else this.direction = 'right'
    this.alive = true
  }
  static preload(scene){
    scene.load.spritesheet('mushroom', 'assets/Enemies/Mushroom/mushroom_sprite.png',{ frameWidth: 32, frameHeight: 32 }, 17)
  }

  create(){
    this.setVelocity(100, 200);
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
  }
  update(){
    if(this.alive){
      if(this.direction == 'left'){
        this.anims.play('mushroom_run_left', true);
        this.setVelocityX(-60);
      }
      else if(this.direction == 'right'){
        this.anims.play('mushroom_run_right', true);
        this.setVelocityX(60);
      }
    }
  }

  changeDirection(mush, border){
    if(mush.alive){
      if(mush.body.blocked.right){
        mush.direction = 'left'
        console.log("left")
      }
      else if(mush.body.blocked.left){
        mush.direction = 'right' 
      }
    }
  }
  dead(){
    this.disappearing = this.scene.add.sprite(this.body.x, this.body.y, 'mushroom');
    this.disappearing.setDepth(99)
    this.disappearing.play("mushroom_dead")
    this.disappearing.self = this
    this.alive = false
    this.visible = false
    this.disappearing.on('animationcomplete', function(){
      this.visible = false
      this.self.remove()
    })
    
  }
}