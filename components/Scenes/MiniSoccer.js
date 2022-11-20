import Phaser from 'phaser'
import * as Colyseus from 'colyseus.js'
export default class MiniSoccer extends Phaser.Scene {
  constructor() {
    super({
      key: 'MiniSoccer',
      physics: {
        default: 'arcade',
      },
    })
    this.score = { you: 0, other: 0 }
    this.directionStale = [0, 0]
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
    const player = this.add.sprite(0, 0, 'players', 0)
    //
    player.x = position[0]
    player.y = position[1]
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
  }

  onOtherLeft() {
    if (this.enemy) {
      this.enemy.destroy(true)
      this.enemy = undefined
    }
  }

  createEnemyPlayer(position) {
    const player = this.add.sprite(position[0], position[1], 'players', 1)
    //
    player.scale = 6

    this.enemy = player
    player.setName('enemy')
  }

  updateState(state) {
    if (state.paused !== undefined) this.paused = state.paused
    state.players.forEach((player) => {
      if (player.id === this.room.sessionId) {
        if (!this.player)
          this.createPlayer(player.position, state.players.length)
        else {
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
    const client = new Colyseus.Client('ws://localhost:2567')
    client
      .joinOrCreate('general')
      .then((room) => {
        this.room = room
        room.onMessage('joined', (msg) => {
          this.updateState(msg.state)
        })
        room.onMessage('tick', (msg) => {
          if (msg.goal) {
            if (msg.goal.player === room.sessionId) {
              this.scoreMe.text = Number(this.scoreMe.text) + 1
            } else {
              this.scoreOther.text = Number(this.scoreOther.text) + 1
            }
          }
          this.updateState(msg)
        })
        room.onMessage('ball-collide', () => {
          this.emmiter?.stop()
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

    const field = this.add.sprite(0, 0, 'field')

    field.scale = 6
    field.name = 'field'

    field.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2)

    const particles = this.add.particles('particle')

    const ball = this.add.sprite(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'players',
      2,
    )
    ball.scale = 6

    this.ball = ball
    this.right = this.input.keyboard.addKey('D', true, true)
    this.left = this.input.keyboard.addKey('A', true, true)
    this.back = this.input.keyboard.addKey('S', true, true)
    this.forward = this.input.keyboard.addKey('W', true, true)
    this.jump = this.input.keyboard.addKey('space')
    ball.setName('ball')
  }

  update() {
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
    if (
      this.direction[0] === this.directionStale[0] &&
      this.direction[1] === this.directionStale[1]
    )
      return
    console.log('setting to ', this.direction)
    if (this.direction !== this.directionStale)
      this.room.send('velocity', { velocity: this.direction })
    this.directionStale = this.direction
  }
}
