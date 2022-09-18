import Phaser from "phaser";
import Player from "../Entities/Player";
import { createPlatform, createTooltip } from "./GameUtils";

export default class WorkScene extends Phaser.Scene {
    constructor() {
        super('Work')
    }

    create() {
        this.cameras.main.fadeIn(500)
        let bg1 = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 + 80, 'bg')
        let bg2 = this.add.sprite(this.cameras.main.width / 2 + bg1.width, this.cameras.main.height / 2 + 80, 'bg')
        let bg3 = this.add.sprite(this.cameras.main.width / 2 - bg1.width, this.cameras.main.height / 2 + 80, 'bg')

        let player = new Player({ scene: this, x: 0, y: 0 })
        player.x = this.cameras.main.width
        player.y = 200 + player.height / 2 - 5
        this.player = player
        this.forward = this.input.keyboard.addKey('D', true, true)
        this.back = this.input.keyboard.addKey('A', true, true)
        this.jump = this.input.keyboard.addKey('space')
        this.interact = this.input.keyboard.addKey('E')

        this.jump.on('down', () => { player.jump() })

        let ground = this.physics.add.staticGroup()

        let groundCollider = ground.create(this.cameras.main.width / 2, this.cameras.main.height - 20, 'grassMid')

        groundCollider.setScale(500, 1)
        groundCollider.refreshBody()

        player.body.setSize(player.width / 2, player.height * .8)
        player.body.offset.y += player.height * .1

        this.physics.add.collider(this.player, ground)
        this.physics.add.collider(this.player, createPlatform(this, 0, 3))
        this.physics.add.collider(this.player, createPlatform(this, 200, 1))

        let signRight = this.physics.add.sprite(this.cameras.main.width - 50, this.cameras.main.height * 0.7 - 200, 'signRight')
        signRight.body.allowGravity = false
        signRight.scale = 0.5

        signRight.body.setSize(300, 100)
        signRight.refreshBody()

        signRight.x -= signRight.width / 2
        signRight.y -= signRight.height / 2

        this.rightSignToolTip = createTooltip(this, 150, signRight.x, signRight.y - signRight.height * 0.8, "Home")
        this.rightSignToolTip.alpha = 0
        this.physics.add.overlap(this.player, signRight, () => {
            this.singRightLast = this.time.now
            this.rightSignToolTip.alpha = 1
        })

        this.player.moveTowards(-125, 600)

        this.interact.on('down', () => {
            if (this.physics.overlap(signRight, this.player)) {
                this.cameras.main.fadeOut(500, 0, 0, 0)
                this.player.moveTowards(this.cameras.main.width - this.player.x, 600)
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('Main', {
                        direction: -1,
                    })
                })
            }
        })

    }


    update(time, dt) {
        if (this.rightSignToolTip.alpha > 0 && Math.abs(time - this.singRightLast) > 100) {
            this.rightSignToolTip.alpha = 0
        }

        this.player.update(dt)
        if (this.forward.isDown) {
            this.player.move(1)
        } else if (this.back.isDown) {
            this.player.move(-1)
        } else {
            this.player.move(0)
        }
    }
}