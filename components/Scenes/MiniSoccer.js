import Phaser from "phaser";
import { supabase } from "../supabse-client";
export default class MiniSoccer extends Phaser.Scene {
    constructor() {
        super({
            key: 'MiniSoccer',
            physics: {
                default: "matter",
                matter: {
                    gravity: { y: 0 },
                    debug: true,
                },
            },

        })
        this.score = { you: 0, other: 0 }
    }

    newRound(scoree) {
        this.paused = true
        this.score[scoree] += 1
        this.updateScore()
        this.player.setVelocity(0)
        setTimeout(() => {
            this.player.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2 + 200)
            this.ball.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2 - 5)
            this.ball.setVelocity(0)
            this.paused = false
        }, 1500);

    }

    updateScore() {
        this.scoreMe.text = this.score.you
        this.scoreOther.text = this.score.other
    }

    presenceChanged() {
        const newState = this.channel.presenceState()
    }

    createPlayer(currentPlayers) {
        const playerCount = Object.keys(currentPlayers).length
        const player = this.matter.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'players', 0)
        //
        player.y += 200
        player.scale = 6
        player.setBody({
            type: 'circle',
            radius: 30,

        }, {
            mass: 1,

        })
        player.setFixedRotation()
        this.player = player
        player.setName("player")
    }

    onOtherLeft() {
        if (this.enemy) {
            this.enemy.destroy(true)
            this.enemy = undefined
        }
    }

    createEnemyPlayer() {
        const player = this.matter.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'players', 1)
        //
        player.y -= 200
        player.scale = 6
        player.setBody({
            type: 'circle',
            radius: 30,

        }, {
            mass: 1,

        })
        player.setFixedRotation()
        this.enemy = player
        player.setName("player")
    }

    create() {
        const channel = supabase.channel("game_1")
        const userName = `user-${Math.ceil(Math.random() * 1000)}`
        channel
            .on(
                'broadcast',
                { event: "MOVE" },
                (event) => {
                    console.log(event)
                    if (!this.enemy) return
                    this.enemy.setVelocity(event.payload.x, -event.payload.y)
                }
            ).on('presence', { event: 'sync' }, () => {
            })
            .on('presence', { event: 'join' }, ({ newPresences }) => {
                if (newPresences[Object.keys(newPresences)[0]].user_name === userName) return
                this.createEnemyPlayer()
            })
            .on('presence', { event: 'leave' }, ({ leftPresences }) => {
                this.onOtherLeft()
            }
            )
            .subscribe(async status => {
                if (status === "SUBSCRIBED") {
                    const status = await channel.track({ user_name: userName })
                    const users = channel.presenceState()
                    console.log(users)
                    this.createPlayer(users)
                }
            })
        this.channel = channel
        this.matter.world.disableGravity()
        const field = this.matter.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'field')
        field.scale = 6
        field.name = "field"

        field.setBody(
            { type: "circle", radius: 0 },
            {
                parts: [this.matter.add.rectangle(70, 400, 50, 650), this.matter.add.rectangle(385, 42, 200, 50), this.matter.add.rectangle(385, 735, 200, 50), this.matter.add.rectangle(190, 75, 200, 50), this.matter.add.rectangle(580, 75, 200, 50), this.matter.add.rectangle(695, 400, 50, 650), this.matter.add.rectangle(190, 705, 200, 50), this.matter.add.rectangle(580, 705, 200, 50),]
            })
        field.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2)
        field.setStatic(true)


        const particles = this.add.particles("particle")

        const ball = this.matter.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 5, 'players', 2)
        ball.body.collideWorldBounds = true

        ball.setBody({
            type: 'circle',
            radius: 12,

        }, {
            restitution: 1.0,
            mass: 0.1,
            frictionAir: 0.025,
            label: 'ball'
        })
        ball.setFixedRotation()
        ball.scale = 6
        // this.matter.add.collider(ball, player)

        const enenmyGoal = this.matter.add.rectangle(600, 20, 200, 100, {
            isSensor: true
        })
        const myGoal = this.matter.add.rectangle(600, 720, 200, 100, {
            isSensor: true
        })
        myGoal.onCollideCallback = (pair) => {
            if (this.paused) return
            if (pair.bodyA.label === "ball" || pair.bodyB.label === "ball") {
                this.newRound('other')
            }
        }

        enenmyGoal.onCollideCallback = (pair) => {
            if (this.paused) return
            if (pair.bodyA.label === "ball" || pair.bodyB.label === "ball") {
                this.newRound('you')
            }
        }
        this.scoreOther = this.add.text(this.cameras.main.width - 150, 100, "0", {
            fontSize: 42
        })
        this.scoreMe = this.add.text(this.cameras.main.width - 150, 600, "0", {
            fontSize: 42
        })
        this.ball = ball

        this.right = this.input.keyboard.addKey('D', true, true)
        this.left = this.input.keyboard.addKey('A', true, true)
        this.back = this.input.keyboard.addKey('S', true, true)
        this.forward = this.input.keyboard.addKey('W', true, true)
        this.jump = this.input.keyboard.addKey('space')
        ball.setName('ball')
        ball.body.onCollide = true
        this.matter.world.on('collisionstart', (ev, b1, b2) => {
            if (b2.gameObject?.name === "ball" || b1.gameObject?.name === "ball") {
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
        if (this.paused || !this.player) return
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
        if (direction.some((e) => e !== 0))
            this.channel.send({
                type: 'broadcast',
                event: "MOVE",
                payload: { x: direction[0] * 7, y: direction[1] * 7 }
            })
        if ((this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) && direction.every((e) => e == 0)) {
            this.updatePosition = true
        }
        if (this.updatePosition) {
            this.channel.send({
                type: 'broadcast',
                event: "MOVE",
                payload: { x: 0, y: 0, position: this.player.position }
            }).then((res) => {
                if (res === 'ok')
                    this.updatePosition = false
            })
        }
        this.player.setVelocity(direction[0] * 7, direction[1] * 7)
    }
}