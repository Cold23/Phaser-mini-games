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
    this.load.image('item', 'assets/stacker/stacking-item.png')
    this.load.image('pole', 'assets/stacker/stacking-pole.png')
    this.load.audio('hit', 'assets/hitHurt.wav')
    this.load.audio('whistle', 'assets/whistle8.wav')
    this.load.audio('metal1', ['assets/metal1.ogg', 'assets/metal1.m4a'])
    this.load.audio('metal2', ['assets/metal2.ogg', 'assets/metal2.m4a'])
    this.load.audio('metal3', ['assets/metal3.ogg', 'assets/metal3.m4a'])
    this.load.audio('metal4', ['assets/metal4.ogg', 'assets/metal4.m4a'])
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
