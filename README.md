# bangbangboom game

[![State-of-the-art Shitcode](https://img.shields.io/static/v1?label=bangbangboom%20game&message=Shitcode&color=7B5804)](https://github.com/trekhleb/state-of-the-art-shitcode)

game part for [bangbangboom](https://github.com/K024/bangbangboom)

## Usage
umd
```html
<script src="./bangbangboom-game.js"></script>
<script>
  let GameConfig = {
    judgeOffset: 20,
    visualOffset: 10,
    speed: 10.5,
    resolution: 1,
    noteScale: 1,
    barOpacity: 0.7,
    backgroundDim: 0.7,
    effectVolume: 1,
    showSimLine: true,
    laneEffect: true,
    mirror: false,
    beatNote: true
  }

  GameLoadConfig = {
    mapContent: loadMap, // some function that loads the map content
    musicSrc: "/assets/local/10001.mp3",
    backgroundSrc: "/assets/local/10001.jpg",
    skin: "/assets/skin/default",
    songName: "Ringing Bloom - Hard"
  }

  function GameStart() {
    const div = document.getElementById("app")
    const canvas = document.createElement("canvas")
    canvas.style.height = "100%"
    canvas.style.width = "100%"
    div.appendChild(canvas)

    const game = new BangGame.Game(canvas, GameConfig, GameLoadConfig)
    game.start()
    game.ondestroyed = () => {
      div.removeChild(canvas)
    }
  }
  GameStart()
</script>
```

typescript
```ts
import { Game } from "bangbangboom-game"
```

See detailed definations in [index.d.ts](./types/index.d.ts)
