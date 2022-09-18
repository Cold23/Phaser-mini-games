import Phaser from "phaser";

export default class MiniSoccer extends Phaser.Scene {
    constructor() {
        super({
            key: 'MiniSoccer',
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: 0 },
                },
            },

        })
    }

    create() {
        const field = this.add.sprite(100, 500, 'field')
        field.scale = 6
        field.x = this.cameras.main.width / 2
        field.y = this.cameras.main.height / 2

        const fieldBounds = this.physics.add.staticGroup()
        const boundLeft = fieldBounds.create(this.cameras.main.width / 2, this.cameras.main.height / 2)
        boundLeft.alpha = 0
        boundLeft.body.setSize(100, 600)
        boundLeft.body.x -= 340
        const boundRight = fieldBounds.create(this.cameras.main.width / 2, this.cameras.main.height / 2)
        boundRight.body.setSize(100, 600)
        boundRight.body.x += 340
        boundRight.alpha = 0

        const boundTop = fieldBounds.create(this.cameras.main.width / 2, this.cameras.main.height / 2)
        boundTop.body.setSize(600, 100)
        boundTop.body.y -= 340
        boundTop.alpha = 0

        const boundBot = fieldBounds.create(this.cameras.main.width / 2, this.cameras.main.height / 2)
        boundBot.body.setSize(600, 100)
        boundBot.body.y += 340
        boundBot.alpha = 0

        field.name = "field"


        const particles = this.add.particles("particle")

        const ball = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'players', 2)
        ball.body.collideWorldBounds = true
        const player = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'players', 0)
        //
        player.y += 50
        player.scale = 6
        player.body.setCircle(5, 3, 3)

        ball.body.setBounce(0.95)
        ball.body.setMass(0.5)
        ball.body.setDrag(0.2)
        ball.body.useDamping = true

        this.player = player

        ball.scale = 6
        ball.body.setCircle(2, 6, 6)
        this.physics.add.collider(ball, fieldBounds)
        this.physics.add.collider(player, fieldBounds)
        this.physics.add.collider(ball, player)



        this.right = this.input.keyboard.addKey('D', true, true)
        this.left = this.input.keyboard.addKey('A', true, true)
        this.back = this.input.keyboard.addKey('S', true, true)
        this.forward = this.input.keyboard.addKey('W', true, true)
        this.jump = this.input.keyboard.addKey('space')
        ball.name = "ball"
        player.name = "player"
        ball.body.onCollide = true

        this.physics.world.on('collide', (b1, b2) => {
            if (b1.name === "ball") {
                this.emmiter?.stop()
                this.emmiter = particles.createEmitter({
                    x: ball.x,
                    y: ball.y,
                    followOffset: { y: Phaser.Math.Clamp(-ball.body.velocity.y, -5, 5), x: Phaser.Math.Clamp(-ball.body.velocity.x, -5, 5) },
                    follow: ball,
                    lifespan: 500,
                    speed: { min: 1, max: 5 },
                    gravityY: 10,
                    alpha: { start: 1, end: 0 },
                    scale: { min: 0.1, max: 1.0 },
                    angle: { min: 20, max: 180 },
                    frequency: 50,
                    quantity: 5,
                    blendMode: 'ADD'
                });
                this.cameras.main.shake(200, 0.001)
                this.tweens.add({
                    targets: ball,
                    duration: 750,
                    alpha: 1,
                    onComplete: () => {
                        this.emmiter.stop()

                    }
                })
            }
        })


    }


    update() {
        const direction = [0, 0]
        if (this.right.isDown) {
            direction[0] = 1
        }
        if (this.left.isDown) {
            direction[0] = -1
        }
        if (this.forward.isDown) {
            direction[1] = -1

        }
        if (this.back.isDown) {
            direction[1] = 1
        }
        this.player.setVelocity(direction[0] * 300, direction[1] * 300)
    }
}