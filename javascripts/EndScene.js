export class EndScene extends Phaser.Scene{
  constructor(){
    super("level3")
  }
  init(data){
    let{points} = data;
    this.points = points;
  }
  preload(){

  }
  create(){
    this.add.text(50, 50, "KONIEC GRY").setScrollFactor(0);
    this.add.text(50, 80, `Udało Ci się zdobyc łącznie: ${this.points} punktów`).setScrollFactor(0);
    this.reset_text = this.add.text(100, 200, `Kliknij ten napis aby zacząc jeszcze raz`).setInteractive().setScrollFactor(0);
    this.reset_text.on('pointerup', () => {
      this.scene.start('MainScene')
  })
  }
  update(){

  }
}