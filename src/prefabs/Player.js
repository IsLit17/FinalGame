class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, frame, kLeft, kRight, kUp, kSpace, mW, mH) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.keyLeft = kLeft;
        this.keyRight = kRight;
        this.keyUp = kUp;
        this.keySpace = kSpace;
        this.health = 3;
        this.mw = mW;
        this.mh = mH;
        this.setScale(1);
        this.setBounce(0.1);
        this.isFire = false;
    }

    preload() {
        this.load.audio('Jump_noise', './assets/Jump.wav');
        this.load.image('bullet', './assets/bullet.png');
    }

    create() {
        this.jump = this.sound.add('Jump_noise');
        this.setMaxVelocity(200, 2000);
    }

    update(enemy, platform) {
        // move
        if (this.keyLeft.isDown && this.x > 0) {
            this.setVelocityX(-300);
        } else if (this.keyRight.isDown && this.x <= this.mw - this.width) {
            this.setVelocityX(300);
        } else {
            this.setVelocityX(0);
        }

        // fire
        if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
            this.isFire = true;
        } else {
            this.isFire = false;
        }

        // jump
        if (this.keyUp.isDown && this.body.onFloor()) {
            // this.jump.play();
            this.setVelocityY(-500);
        }

        // change direction
        if (this.body.velocity.x > 0 ) {
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        }

        if(this.isFire) {
            if (!this.flipX) {
                this.spawnBullet('right', enemy, platform);
            }
            else if (this.flipX) {
                this.spawnBullet('left', enemy, platform);
            }
            this.isFire = false;
        }
    }

    spawnBullet(dir, enemy, platform) {
        console.log(dir);
        console.log(enemy);
        let bullet = new Bullet(this.scene, this.x + 64, this.y + 96, 'bullet', 0, dir);
        console.log(enemy);
        this.scene.physics.add.overlap(bullet, enemy, (obj1, obj2) => {
            console.log("obj2 name : " + obj2);
            obj2.setActive(false).setVisible(false);
            obj2.destroy();
            obj1.setActive(false).setVisible(false);
            obj1.destroy();
        })
        this.scene.physics.add.collider(bullet, platform, (obj1, obj2) => {
            console.log("obj2 name : " + obj2.yyName);
            obj1.setActive(false).setVisible(false);
            obj1.destroy();
        })
        bullet.update();
    }
}