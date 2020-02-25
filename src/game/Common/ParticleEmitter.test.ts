import { ParticleOption, ParticleEmitter } from "./ParticleEmitter"
import { Application } from "pixi.js"
import { assert } from "../../core/Utils"

const testoption: ParticleOption = {
    duration: 0,
    emissionRate: 100,
    emitRect: {
        x: { base: 300, offset: 50 },
        y: { base: 300, offset: 0 },
    },
    lifeTime: { base: 0.5, offset: 0.2 },
    radian: -Math.PI / 2,
    speed: { base: 300, offset: 200 },
    accelRad: -400,
    blend: "add",

    start: {
        size: 0.2,
        r: 51,
        g: 102,
        b: { base: 178, offset: 30 }
    },
    end: {
        size: 0.3,
        r: 80,
        g: 20,
        b: 50
    }
}

export class TestApp extends Application {
    constructor(canvas: HTMLCanvasElement) {
        super({
            view: canvas,
            width: canvas.clientWidth,
            height: canvas.clientHeight,
        })
        this.loader.add("effect", "/assets/default/effect.json")
        this.loader.load(this.loaded)
        this.resizeTo = window
        this.ticker.add(() => {
            this.resize()
        })
    }

    loaded = () => {
        const emitter = new ParticleEmitter(
            [assert(this.loader.resources.effect.textures).note_single], testoption)
        this.stage.addChild(emitter)
        this.ticker.add(() => emitter.update(this.ticker.deltaMS / 1000))
        setInterval(() => emitter.currentTime = 0, 5000)
    }
}

