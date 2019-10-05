# bangbangboom game

game part for [bangbangboom](https://bangbangboom.ml)

## Usage
umd
```html
<!-- Need external PIXI -->
<script src="https://cdn.bootcss.com/pixi.js/5.1.3/pixi.min.js"></script>
<script src="./bangbangboom-game.js"></script>
<script>
  let GameConfig = {
    judgeOffset: 0,
    visualOffset: 0,
    speed: 10,
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
    mapSrc: "/assets/10001.txt",
    musicSrc: "/assets/10001.mp3",
    backgroundSrc: "/assets/10001.jpg",
    skin: "/assets/default",
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
