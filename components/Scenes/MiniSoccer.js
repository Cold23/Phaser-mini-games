import Phaser from 'phaser'
import * as Colyseus from 'colyseus.js'

export default class MiniSoccer extends Phaser.Scene {
  constructor() {
    super({
      key: 'MiniSoccer',
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 0 },
        },
      },
    })

    this.frameCount = 0
    this.ms = 0
    this.cooldown = 0
    this.score = { you: 0, other: 0 }
    this.directionStale = [0, 0]
    this.DASH_COOLDOWN_BASE = 1000
  }

  newRound() {
    this.paused = true
    // this.score[scoree] += 1
    // this.updateScore()
    // this.player.setVelocity(0)
    // setTimeout(() => {
    //   this.player.setPosition(
    //     this.cameras.main.width / 2,
    //     this.cameras.main.height / 2 + 200,
    //   )
    //   this.ball.setPosition(
    //     this.cameras.main.width / 2,
    //     this.cameras.main.height / 2 - 5,
    //   )
    //   this.ball.setVelocity(0)
    //   this.paused = false
    // }, 1500)
  }

  updateScore() {
    this.scoreMe.text = this.score.you
    this.scoreOther.text = this.score.other
  }

  createPlayer(position, playersNum) {
    const player = this.matter.add.sprite(0, 0, 'players', 0, {
      frictionAir: 0,
      friction: 0,
    })
    //
    player.setPosition(position[0], position[1])

    player.setBody(
      {
        type: 'circle',
        radius: 30,
      },
      {
        mass: 10,
      },
    )
    player.setFixedRotation()

    player.scale = 6
    this.player = player
    player.setName('player')
    if (playersNum === 1) {
      this.scoreOther = this.add.text(this.cameras.main.width - 150, 100, '0', {
        fontSize: 42,
      })
      this.scoreMe = this.add.text(this.cameras.main.width - 150, 600, '0', {
        fontSize: 42,
      })
    } else {
      this.scoreOther = this.add.text(this.cameras.main.width - 150, 600, '0', {
        fontSize: 42,
      })
      this.scoreMe = this.add.text(this.cameras.main.width - 150, 100, '0', {
        fontSize: 42,
      })
    }
    const skill = this.add.graphics({
      fillStyle: {
        color: 0xffffff,
        alpha: 1,
      },
    })
    skill.fillCircle(100, this.cameras.main.height * 0.8, 40)
    this.skill = skill
    this.scene.get('Preload').events.emit('loaded')
  }

  onOtherLeft() {
    if (this.enemy) {
      this.enemy.destroy(true)
      this.enemy = undefined
    }
  }

  doInfoText(textContent) {
    this.sound.play('whistle')
    const text = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      textContent,
      {
        fontSize: 12,
        color: 'white',
        stroke: 'black',
        strokeThickness: 1,
      },
    )
    text.setDepth(10)
    this.tweens.addCounter({
      from: 12,
      to: 64,
      duration: 125,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      onUpdate: (tween) => {
        text.setFontSize(tween.getValue())
        text.x = this.cameras.main.width / 2 - text.width / 2
        text.y = this.cameras.main.height / 2 - text.height / 2
      },
    })
    setTimeout(() => {
      text.destroy(true)
    }, 1500)
  }

  createEnemyPlayer(position) {
    const player = this.matter.add.sprite(
      position[0],
      position[1],
      'players',
      1,
    )
    player.setBody(
      {
        type: 'circle',
        radius: 30,
      },
      {
        mass: 10,
      },
    )
    player.setFixedRotation()
    //
    player.scale = 6

    this.enemy = player
    player.setName('enemy')
    this.scene.get('Preload').events.emit('ready')
  }

  doPing(ms) {
    if (!this.scene.settings) return

    this.ping.text = `ping:${Math.floor(ms)} ms`
  }

  updateState(state) {
    if (!this.scene.settings) return
    if (state.paused !== undefined) this.paused = state.paused
    state.players.forEach((player) => {
      if (player.id === this.room.sessionId) {
        if (!this.player)
          this.createPlayer(player.position, state.players.length)
        else {
          this.player.setVelocity(0, 0)
          this.player.setPosition(player.position[0], player.position[1])
        }
      } else {
        if (!this.enemy) this.createEnemyPlayer(player.position)
        else {
          this.enemy.setPosition(player.position[0], player.position[1])
        }
      }
    })
    if (state.ball) {
      this.ball.setPosition(state.ball.position.x, state.ball.position.y)
    }
  }

  create() {
    this.events.on(Phaser.Scenes.Events.DESTROY, () => {
      this.room.leave(true)
      clearInterval(this.pingInterval)
    })
    this.ping = this.add.text(this.cameras.main.width - 100, 20, 'ping: 0 ms', {
      fontSize: 12,
    })
    const client = new Colyseus.Client('ws://localhost:2567')
    client
      .joinOrCreate('general')
      .then((room) => {
        this.room = room
        this.pingInterval = setInterval(() => {
          if (!this.scene.settings) return

          this.room.send('ping', { time: this.time.now })
        }, 250)
        room.onMessage('joined', (msg) => {
          this.updateState(msg.state)
        })
        room.onMessage('pong', (msg) => {
          this.doPing(this.time.now - msg.time)
        })
        room.onMessage('tick', (msg) => {
          if (msg.goal) {
            if (msg.goal.player === room.sessionId) {
              this.scoreMe.text = Number(this.scoreMe.text) + 1
              this.doInfoText('YOU SCORED!')
            } else {
              this.scoreOther.text = Number(this.scoreOther.text) + 1
              this.doInfoText('OPPONENT SCORED!')
            }
          }
          if (msg.out) {
            this.doInfoText('OUT!!')
          }
          this.updateState(msg)
        })
        room.onMessage('ball-collide', () => {
          this.emmiter?.stop()
          this.sound.play('hit', {
            volume: 0.5,
          })
          this.emmiter = particles.createEmitter({
            x: ball.x,
            y: ball.y,
            follow: ball,
            lifespan: 500,
            speed: { min: 1, max: 5 },
            gravityY: 10,
            alpha: { start: 1, end: 0 },
            scale: { min: 0.1, max: 1.0 },
            angle: { min: 20, max: 180 },
            frequency: 50,
            quantity: 5,
            blendMode: 'ADD',
          })
          this.cameras.main.shake(200, 0.001)
          this.tweens.add({
            targets: ball,
            duration: 750,
            alpha: 1,
            onComplete: () => {
              this.emmiter.stop()
            },
          })
        })
        room.onMessage('left', (msg) => {
          this.enemy.destroy()
          this.enemy = undefined
        })
        room.onStateChange.once((state) => {
          this.updateState(state)
        })
      })
      .catch((e) => {
        console.log('JOIN ERROR', e)
      })

    const field = this.matter.add.sprite(0, 0, 'field')

    this.matter.world.disableGravity()
    field.scale = 6
    field.name = 'field'

    field.setBody(
      { type: 'circle', radius: 0 },
      {
        parts: [
          this.matter.add.rectangle(70, 400, 50, 1000),
          this.matter.add.rectangle(385, 42, 1000, 50),
          this.matter.add.rectangle(385, 735, 1000, 50),
          this.matter.add.rectangle(190, 75, 200, 50),
          this.matter.add.rectangle(580, 75, 200, 50),
          this.matter.add.rectangle(695, 400, 50, 1000),
          this.matter.add.rectangle(190, 705, 200, 50),
          this.matter.add.rectangle(580, 705, 200, 50),
        ],
      },
    )
    field.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2)
    field.setStatic(true)

    field.scale = 6
    field.name = 'field'

    const particles = this.add.particles('particle')

    const ball = this.matter.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'players',
      2,
    )
    ball.body.collideWorldBounds = true

    ball.setBody(
      {
        type: 'circle',
        radius: 12,
      },
      {
        restitution: 1.0,
        mass: 0.1,
        frictionAir: 0.025,
        label: 'ball',
      },
    )
    ball.setFixedRotation()
    ball.scale = 6
    ball.y -= 8

    this.ball = ball
    this.right = this.input.keyboard.addKey('D', true, true)
    this.left = this.input.keyboard.addKey('A', true, true)
    this.back = this.input.keyboard.addKey('S', true, true)
    this.forward = this.input.keyboard.addKey('W', true, true)
    this.jump = this.input.keyboard.addKey('space')
    this.shift = this.input.keyboard.addKey('shift')
    ball.setName('ball')
  }

  update(time, dt) {
    if (this.cooldown > 0) {
      this.cooldown -= dt
    }
    this.direction = [0, 0]
    if (this.paused || !this.player) return
    if (this.right.isDown) {
      this.direction[0] = 1
    }
    if (this.left.isDown) {
      this.direction[0] = -1
    }
    if (this.forward.isDown) {
      this.direction[1] = -1
    }
    if (this.back.isDown) {
      this.direction[1] = 1
    }
    if (this.shift.isDown && this.cooldown <= 0 && this.scene.settings) {
      this.skill.setAlpha(0.5)
      this.dash = true
      this.player.setVelocity(this.direction[0] * 30, this.direction[1] * 30)
      setTimeout(() => {
        this.dash = false
        this.player.setVelocity(this.direction[0] * 6, this.direction[1] * 6)
      }, 150)
      this.room.send('dash', {
        position: this.player.body.position,
        direction: this.direction,
      })
      setTimeout(() => {
        this.skill.setAlpha(1)
      }, this.DASH_COOLDOWN_BASE)
      this.cooldown = this.DASH_COOLDOWN_BASE
    }

    if (
      this.direction[0] === this.directionStale[0] &&
      this.direction[1] === this.directionStale[1]
    )
      return
    if (!this.dash)
      this.player.setVelocity(this.direction[0] * 6, this.direction[1] * 6)
    if (this.direction !== this.directionStale && this.scene.settings) {
      this.room.send('velocity', {
        velocity: this.direction,
        startTime: this.serverTime,
      })
    }

    this.directionStale = this.direction
  }
}
