import { Game } from "./game/Game"

const div = document.getElementById("app") as HTMLElement
div.style.position = "fixed"
div.style.left = "0"
div.style.right = "0"
div.style.top = "0"
div.style.bottom = "0"

const canvas = document.createElement("canvas")
canvas.style.height = "100%"
canvas.style.widows = "100%"
div.appendChild(canvas)

// tslint:disable-next-line: no-unused-expression
// new TestApp(canvas)
new Game(canvas, {}, {
    mapSrc: "/assets/10001.txt",
    musicSrc: "/assets/10001.mp3",
    backgroundSrc: "/assets/10001.jpg",
    skin: "/assets/default",
    songName: "Ringing Bloom",
    loadingMessages: ["Message1", "Message2"]
}).start()


document.getElementById("loader").style.display = "none"
