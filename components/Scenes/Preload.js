import Phaser from 'phaser'
import { eventsStore } from '../../src/globals'

export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preload')
  }

  preload() {
    this.load.image('bg', 'assets/backgroundColorForest.png')
    this.load.spritesheet('player', 'assets/player_tilesheet.png', {
      frameWidth: 80,
      frameHeight: 110,
    })
    this.load.image('grassLeft', 'assets/grassLeft.png')
    this.load.image('grassMid', 'assets/grassMid.png')
    this.load.image('grassRight', 'assets/grassRight.png')
    this.load.image('signLeft', 'assets/signLeft.png')
    this.load.image('signRight', 'assets/signRight.png')
    this.load.rexWebFont({
      google: {
        families: ['Silkscreen'],
      },
    })
    this.load.image('field', 'assets/field.png')
    this.load.spritesheet('players', 'assets/players.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.image('particle', 'assets/particle.png')
  }

  create() {
    const setEventManager = eventsStore.getState().setEventManager
    setEventManager(this.events)
    this.events.on('start', (scene) => {
      this.scene.start(scene)
    })
    this.events.on('stop', (scene) => {
      this.scene.remove(scene)
      this.game.destroy(true, false)
    })
  }
}
