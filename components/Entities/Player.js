import Phaser from "phaser";
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'player');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this)
        const frames = this.anims.generateFrameNumbers('player')
        this.airTime = 0
        this.anims.create({
            key: "walk",
            frameRate: 4,
            frames: [frames[9], frames[10]],
            repeat: -1
        })
        this.body.setFriction(0, 0)
    }

    jump() {
        if (this.disableInput) return
        if (this.jumping || this.disableJump) return;
        this.jumping = true;
        this.anims.stop()
        this.setFrame(1)
        this.setVelocityY(-600)
    }


    update(dt) {
        const standing = (this.body.blocked.down || this.body.touching.down)
        if (!standing) {
            this.airTime += dt
            if (this.airTime > 250) {
                this.disableJump = true
            }
        } else {
            this.disableJump = false
            this.airTime = 0
        }
        if (!this.jumping) return
        if (this.body.velocity.y > 200 && !standing) {
            this.setFrame(2)
        }
        if (standing) {
            this.jumping = false
        }
    }

    moveTowards(x, duration) {
        this.disableInput = true;
        this.anims.play('walk')
        this.flipX = x < 0
        this.scene.tweens.add({
            targets: this,
            x: this.x + x,
            duration: duration,
            onComplete: () => {
                this.anims.stop()
                this.setFrame(0)
                this.disableInput = false
            }
        })
    }

    move(direction) {
        if (this.disableInput) return
        if (direction === 0 && this.anims.currentAnim?.key === 'walk' && !this.jumping) {
            this.body.velocity.x = 0
            this.anims.stop()
            this.setFrame(0)
            return
        }
        if (direction !== 0)
            this.flipX = direction === -1
        this.body.velocity.x = direction * 200
        const standing = (this.body.blocked.down || this.body.touching.down)
        if (!standing) {
            if (this.anims.isPlaying && this.anims.currentAnim.key === 'walk') {
                this.anims.stop()
                this.setFrame(2)
            }
            return
        }
        if (this.anims.isPlaying && this.anims.currentAnim.key === 'walk' || this.jumping) return
        this.play('walk')
    }

}