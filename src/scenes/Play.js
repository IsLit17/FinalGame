class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('tiles', './assets/tilesheet.png');
        this.load.tilemapTiledJSON('map', './assets/tutorial_level.json');
        this.load.image('spike', './assets/spike.png');
        this.load.spritesheet('player', './assets/player.png', {frameWidth: 64, frameHeight: 128, startFrame: 0, endFrame: 3});
        this.load.spritesheet('portal', './assets/portal.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 5});
    }

    create() {
        // move keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.text(20, 20, "Play Scene");
        this.healthText = this.add.text(700, 20, "Health: " + 3);


        // map
        const map = this.make.tilemap({ key: 'map' });
        const tileSet = map.addTilesetImage('simple_tileset', 'tiles');
        const platforms = map.createLayer('Platforms', tileSet, 0, 200);
        platforms.setCollisionByExclusion(-1, true);

        // player
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3, first: 0}),
            frameRate: 1,
            repeat: -1
        });
        this.player = new Player(this, 0, 130, 'player', 0, keyLEFT, keyRIGHT, keySPACE).setOrigin(0,0);
        this.player.play('idle');

        // set up camera
        const viewH = 640;
        const viewW = 800;
        this.cam = this.cameras.main.setViewport(0, 0, viewW, viewH).setZoom(1);
        this.cam.setBounds(0,0,55*64, 8*64);
        this.cam.startFollow(this.player);
        //this.cam.ignore(this.healthText);

        // collision
        this.physics.add.collider(this.player, platforms);

        // spikes
        this.spikes = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Spikes').objects.forEach((spike) => {
            let sSprite = this.spikes.create(spike.x, spike.y + 200 - spike.height, 'spike').setOrigin(0);
            sSprite.body.setSize(spike.width, spike.height - 32).setOffset(0, 32);
        });
        this.physics.add.collider(this.player, this.spikes, this.looseHealth, null, this);
    }

    update() {
        this.healthText.setText("Health: " + this.player.health);
        if (!gameOver) {
            this.player.update();
        } else {
            let x = game.config.width + this.player.x;
            let y = this.player.y;
            this.add.text(x/2, y/2, 'Game Over', scoreConfig).setOrigin(0.5);
            this.add.text(x/2, y/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
        }
    }

    looseHealth() {
        this.player.health -= 1;
        if (this.player.health <= 0) {
            this.player.health = 0;
            gameOver = true;
        }
        this.player.x -= 50;
        this.player.setVelocity(0,0);
    }
}