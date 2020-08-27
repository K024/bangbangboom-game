import { ParticleOption, ParticleEmitter } from "./ParticleEmitter"
import { Application } from "pixi.js"
import { assert } from "../Utils/Utils"

const testoption: ParticleOption = {
    duration: 0.02,
    emissionRate: 1000,
    emitRect: { x: { base: 0, offset: 70 }, y: 0 },
    lifeTime: { max: 0.8, min: 0.2 },
    radian: -1.52,
    speed: { max: 800, min: 100 },
    gravity: { x: 0, y: 300 },
    start: {
        size: { min: 0.05, max: 0.35 },
        r: [100, 160],
        g: 220,
        b: 250,
        alpha: 0.6,
        spin: { base: 0, offset: 3.14 },
    },
    end: { alpha: 0, size: 0.1, spin: 0 },
    blend: "add",
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
        const emitter = new ParticleEmitter([assert(this.loader.resources.effect.textures).note_single], testoption)
        this.stage.addChild(emitter)
        emitter.position.set(200)
        this.ticker.add(() => emitter.update(this.ticker.deltaMS / 1000))
        setInterval(() => (emitter.currentTime = 0), 2000)
    }
}
