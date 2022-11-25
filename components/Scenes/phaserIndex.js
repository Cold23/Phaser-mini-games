import Main from './Main'
import { useEffect, useRef } from 'react'
import 'phaser'
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js'
import Preload from './Preload'
import Portfolio from './Portfolio'
import WorkScene from './WorkExperience'
import MiniSoccer from './MiniSoccer'
const baseSize = {
  width: 1200,
  height: 762,
}

export default function Index() {
  const loaded = useRef(false)
  const gameRef = useRef()

  useEffect(() => {
    loadGame()
    const resize = () => {
      const [w, h] = [window.innerWidth, window.innerHeight - 196]
      const scale = Math.min(w / baseSize.width, h / baseSize.height)
      const width = Math.min(w / scale, baseSize.width)
      const height = Math.min(h / scale, baseSize.height)

      gameRef.current.scale.resize(width, height)
      const container = document.getElementById('game')
      gameRef.current.canvas.style.width = width * scale + 'px'
      gameRef.current.canvas.style.height = height * scale + 'px'
      container.style.width = width * scale + 'px'
      container.style.height = height * scale + 'px'
      container.style.marginLeft = (w - width * scale) / 2 + 'px'
      container.style.marginTop = (h - height * scale) / 2 + 60 + 'px'
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const loadGame = async () => {
    if (typeof window !== 'object' || loaded.current) {
      return
    }
    loaded.current = true
    var config = {
      pixelArt: true,
      type: Phaser.AUTO,
      width: baseSize.width,
      height: baseSize.height,
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          gravity: { y: 800 },
        },
      },
      parent: 'game',
      scale: {
        mode: Phaser.Scale.NONE,
      },
      plugins: {
        global: [
          {
            key: 'rexWebFontLoader',
            plugin: WebFontLoaderPlugin,
            start: true,
          },
        ],
      },
      scene: [Preload, MiniSoccer],
    }

    var game = new Phaser.Game(config)
    gameRef.current = game
  }

  return <></>
}
