import Phaser from 'phaser'
import { stackingLevels } from '../../src/globals'

export default class StackingGame extends Phaser.Scene {
  private selectedItem: Phaser.GameObjects.Sprite
  private poleHover: Phaser.GameObjects.Sprite
  private allPoles: Phaser.GameObjects.Sprite[]
  private level: number = 0
  constructor() {
    super({
      key: 'StackingGame',
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 0 },
        },
      },
    })
  }

  removeItemFromPole(pole, item) {
    const currentItems = pole
      .getData('items')
      .filter((e) => e.item !== item)
      .map((e, idx, arr) => {
        const index = arr.length - 1 - idx
        e.order = index
        e.item.setData('order', index)
        return e
      })
    pole.setData('items', currentItems)
  }

  onPolePlace(
    pole: Phaser.GameObjects.Sprite,
    item: Phaser.GameObjects.Sprite,
  ) {
    const oldPole = item.getData('belongsTo')
    const currentItems = pole.getData('items').map((e, idx, arr) => {
      const order = arr.length - idx
      e.order = order
      e.item.setData('order', order)
      return e
    })
    item.setPosition(pole.x, pole.y + 44 - 16 * (currentItems?.length || 0))
    item.setData('order', 0)
    item.setData('positionPole', {
      x: pole.x,
      y: pole.y + 44 - 16 * (currentItems?.length || 0),
    })
    item.setData('belongsTo', pole)
    currentItems.push({ item: item, color: item.tintTopLeft, order: 0 })
    pole.setData('items', currentItems)
    this.removeItemFromPole(oldPole, item)
    this.checkWin()
  }

  createItem(
    x: number,
    y: number,
    tint: number,
    belongTo: Phaser.GameObjects.GameObject,
    startOrder: number,
  ) {
    const item = this.add.sprite(x, y, 'item')
    item.setScale(4)
    item.setTint(tint)
    item.setDepth(10)
    item.setInteractive(
      new Phaser.Geom.Rectangle(24, 28, 14, 6),
      Phaser.Geom.Rectangle.Contains,
    )
    item.setData('positionPole', { x: item.x, y: item.y })
    item.setData('order', startOrder)
    item.setData('belongsTo', belongTo)
    item.on(Phaser.Input.Events.POINTER_OVER, () => {
      if (this.selectedItem || item.getData('order') > 0) return
      this.tweens.add({
        targets: item,
        scale: 4.5,
        duration: 75,
      })
    })
    item.on(Phaser.Input.Events.POINTER_OUT, () => {
      if (this.selectedItem || item.getData('order') > 0) return
      this.tweens.killTweensOf(item)
      this.tweens.add({
        targets: item,
        scale: 4,
        duration: 75,
      })
    })
    item.on(Phaser.Input.Events.POINTER_DOWN, () => {
      if (item.getData('order') > 0) return
      item.setDepth(11)
      this.selectedItem = item
      this.tweens.killTweensOf(item)
      this.tweens.add({
        targets: item,
        scale: 4,
        duration: 75,
      })
    })
    item.on(Phaser.Input.Events.POINTER_UP, () => {
      item.setDepth(10)
      this.selectedItem = undefined
      if (!this.poleHover || this.poleHover === item.getData('belongsTo')) {
        const pos = item.getData('positionPole')
        item.setPosition(pos.x, pos.y)
      } else {
        this.onPolePlace(this.poleHover, item)
      }
      this.poleHover = undefined
    })
    return item
  }

  createPole(x: number, y: number, items: any[]) {
    const pole = this.add.sprite(x, y, 'pole')
    pole.setScale(4)

    const poleItems = []
    items.forEach((item, idx, arr) => {
      const order = arr.length - 1 - idx
      const createdItem = this.createItem(
        x,
        y + 44 - 16 * idx,
        item,
        pole,
        order,
      )
      poleItems.push({
        item: createdItem,
        color: item,
        order: order,
      })
    })
    pole.setData('items', poleItems)
    return pole
  }

  checkWin() {
    let filledCount = 0
    this.allPoles.forEach((pole) => {
      const poleItems = pole.getData('items') as any[]
      if (poleItems.every((e) => e.color === poleItems[0].color)) {
        filledCount++
      }
    })
    if (filledCount === this.allPoles.length) {
      // do next level or whatever
      this.scene.restart({ level: this.level + 1 })
    }
  }

  update() {
    if (!this.selectedItem) return
    this.selectedItem.x = this.game.input.activePointer.x
    this.selectedItem.y = this.game.input.activePointer.y
    let found = undefined
    this.allPoles.forEach((pole) => {
      if (
        Phaser.Geom.Rectangle.Contains(
          pole.getBounds(),
          this.game.input.activePointer.x,
          this.game.input.activePointer.y,
        )
      ) {
        found = pole
        return false
      }
    })
    this.poleHover = found
  }

  create(data) {
    this.level = data.level || 0
    if (this.level > stackingLevels.length)
      this.level = stackingLevels.length - 1
    this.allPoles = stackingLevels[this.level].map((config) =>
      this.createPole(
        this.cameras.main.width / 2 + config.xOffset,
        this.cameras.main.height / 2,
        config.items,
      ),
    )
  }
}