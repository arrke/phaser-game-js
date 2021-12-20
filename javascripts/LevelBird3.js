import { Player } from "./Player.js";

export class Level3Scene extends Phaser.Scene {
    constructor() {
        super("level2")
    }
    init(data) {
        let {
            points,
            level
        } = data
        Player.preload(this)
        this.player = new Player({
            scene: this,
            x: 100,
            y: 100,
            level: level,
            points: points
        })
        this.latestPoints = points;
    }
    getPoints(sprite, fruit) {
        this.fruits.killAndHide(fruit);
        fruit.body.enable = false;
        var nowCollectedFruit = this.add.sprite(fruit.body.x + fruit.body.width / 2, fruit.body.y + fruit.body.height / 2, 'colletedSpriteFruit');
        this.player.addPoints(10)
        nowCollectedFruit.play("collectedFruitAnim")
        nowCollectedFruit.on('animationcomplete', function () {
            this.visible = false
        });
    }
    preload() {
        this.load.tilemapTiledJSON('map_level', `./assets/maps/map1.json`);
        this.load.image('tiles', './assets/maps/terrain.png');
        this.load.image('restart', './assets/Free/Menu/Buttons/Restart.png')
        this.load.image('endlvl', 'assets/Free/Items/Checkpoints/Start/Start (Idle).png')
        this.load.spritesheet('spriteBird', './assets/Enemies/FatBird/Idle(40x48).png', { frameWidth: 40, frameHeight: 48 }, 8)
        this.load.spritesheet('spriteFruit', 'assets/Free/Items/Fruits/Kiwi.png', { frameWidth: 32, frameHeight: 32 }, 17)
        this.load.spritesheet('colletedSpriteFruit', 'assets/Free/Items/Fruits/Collected.png', { frameWidth: 32, frameHeight: 32 }, 17)
        Player.preload(this)



    }
    playerHit() {
        this.player.next(false)
    }
    sendToNextLevel() {
        if (this.player.body.touching.down && this.check.body.touching.up) {
            this.player.next(true, this.scene)
            this.player.body.x = 1000
        }
    }
    create() {
        const map = this.make.tilemap({ key: 'map_level', tileWidth: 16, tileHeight: 16 })
        const tileset = map.addTilesetImage('Terrain (16x16)', 'tiles')
        this.map = map.createLayer('map', tileset)
        this.map.setCollisionByExclusion(-1, true);
        const restartButton = this.add.image(460, 40, 'restart').setInteractive().setScrollFactor(0);
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
            collidWorldBounds: true
        });


        map.getObjectLayer('spikes').objects.forEach((spike) => {
            // Add new spikes to our sprite group
            const spikeSprite = this.spikes.create(spike.x, spike.y - spike.height, 'spike').setOrigin(0);
            spikeSprite.body.setSize(spike.width - 2, spike.height - 10).setOffset(0, 10);
        });
        this.physics.add.collider(this.player, this.spikes, this.playerHit, null, this);

        map.getObjectLayer('bird').objects.forEach((bird) => {
            var bird = this.add.sprite(bird.x, bird.y - bird.height, 'spriteBird').setOrigin(0)
            this.anims.create({
                key: 'idle_bird',
                frames: this.anims.generateFrameNumbers('spriteBird', { start: 0, end: 7 }),
                frameRate: 20,
                repeat: -1
            })
            bird.setSize(40, 48)
            bird.anims.play('idle_bird', true)
            this.birds.add(bird);

        })
        this.physics.add.collider(this.player, this.birds, this.playerHit, null, this);
        this.physics.add.collider(this.birds, this.map);

        this.checkpoint = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        map.getObjectLayer('end').objects.forEach((checkpoint) => {
            // Add new checkpoints to our sprite group
            this.check = this.checkpoint.create(checkpoint.x, checkpoint.y - checkpoint.height, 'endlvl').setOrigin(0);
            this.check.body.setSize(checkpoint.width - 23, checkpoint.height - 55).setOffset(23, 55);

        });
        this.physics.add.collider(this.player, this.check, this.sendToNextLevel, null, this);

        this.fruits = this.physics.add.group({
            allowGravity: false,
            immovable: true,
            key: 'fruits'
        });
        map.getObjectLayer('fruits').objects.forEach((fruit) => {

            var fruit = this.add.sprite(fruit.x, fruit.y - fruit.height, 'spriteFruit').setOrigin(0).setScale(0.8);
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
        this.physics.add.overlap(this.player, this.fruits, this.getPoints, null, this);

        this.point_text = this.add.text(20, 0, `Points : ${this.player.points}`).setScrollFactor(0);
        this.point_text.setDepth(99)


    }

    update() {
        this.player.update(this.cursors)
        this.point_text.setText(`Points : ${this.player.points}`)
        for (const bird of this.birds.children.entries) {
            if (bird.x - 20 <= this.player.x && bird.x + 20 >= this.player.x && this.player.y > bird.y) {
                bird.body.setVelocityY(350);
            }   
            if (bird.body.blocked.down) {
                bird.body.setVelocityY(-100);
            }
        }

    }
}