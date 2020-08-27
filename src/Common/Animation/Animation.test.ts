import { Animation, AnimationManager, CreatePixiPropSetter } from "./Animation"
import { Application, Sprite } from "pixi.js"

const testanim: Animation = {
    totaltime: 5,
    loop: true,
    yoyo: false,
    keyframes: [
        { time: 0, value: 0, type: "linear" },
        { time: 1, value: 100, type: "linear" },
        { time: 2, value: 200, type: "bezier", ctrl: [0.3, 1.29, 0.3, 1.29] },
        { time: 4, value: 300, type: "linear" },
        { time: 5, value: 0, type: "linear" },
    ],
}

export class TestApp extends Application {
    constructor(canvas: HTMLCanvasElement) {
        super({
            view: canvas,
            width: canvas.clientWidth,
            height: canvas.clientHeight,
        })
        this.loader.add("effect", "/assets/skins/default/effect.json")
        this.loader.load(this.loaded)
        this.resizeTo = window
        this.ticker.add(() => {
            this.resize()
        })
    }

    loaded = () => {
        const manager = new AnimationManager()
        const sprite = new Sprite(this.loader.resources.effect.textures?.note_double)
        const mapper = CreatePixiPropSetter(sprite)
        mapper.r(0xff)
        mapper.g(0x00)
        mapper.b(0x88)
        manager.propSetter = mapper
        manager.animations.set("x", testanim)
        manager.animations.set("y", testanim)
        this.ticker.add(() => manager.update(this.ticker.deltaMS / 1000))
        this.stage.addChild(sprite)
    }
}
