/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata"
import { EffectInfo } from "../../Common/InfoType"
import { FixRatioContainer } from "../../Common/FixRatioContainer"
import { LayerWidth, LayerHeight, LaneBottomY, FarLineY, LaneCenterXs, CenterX, LaneInfY, LaneWidth } from "../../Core/Constants"
import { EffectLayer, SingleEffectLayer } from "./EffectLayer"
import { LaneLayer } from "./LaneLayer"
import { LaneEffect } from "./LaneEffectLayer"
import { Application } from "pixi.js"

type EffectLayerInfo = {
    tap: EffectInfo
    single: EffectInfo
    slide: EffectInfo
    flick: EffectInfo
    fullcombo: EffectInfo
}
const info: EffectLayerInfo = {
    tap: {
        sprites: [{
            texture: "line_effect",
            position: { anchor: 0.5, scale: 0.7 },
            animations: {
                alpha: {
                    keyframes: [{ time: 0, value: 0.7, type: "bezier", ctrl: [.42, 0, 1, 1] },
                    { time: 0.3, value: 0, type: "static" }],
                    totaltime: 0.3
                }
            },
            tint: "#BBDEFB",
            blend: "add"
        }, {
            texture: "tap_light",
            position: { anchor: { x: 0.5, y: 1 }, scale: 0.7 },
            animations: {
                alpha: {
                    keyframes: [{ time: 0, value: 0.7, type: "bezier", ctrl: [.42, 0, 1, 1] },
                    { time: 0.2, value: 0, type: "static" }],
                    totaltime: 0.2
                }
            },
            tint: "#BBDEFB",
        }],
        particles: [{
            textures: ["tap_effect"],
            option: {
                duration: 0.01,
                emissionRate: 1000,
                emitRect: { x: { base: 0, offset: 70 }, y: 0 },
                lifeTime: { max: 0.8, min: 0.2 },
                radian: -1.52,
                speed: { max: 500, min: 120 },
                gravity: { x: 0, y: 300 },
                start: { size: { min: 0.05, max: 0.35 }, r: [160, 200], g: 255, b: 255, alpha: 1 },
                end: { alpha: 0, size: 0.1 },
                blend: "add"
            }
        }]
    },
    single: {
        sprites: [{
            animations: {
                scale: {
                    keyframes: [{ time: 0, value: 0, type: "bezier", ctrl: [0, 0, .3, 1] },
                    { time: 0.4, value: 2.3, type: "static" }],
                    totaltime: 0.4
                },
                alpha: {
                    keyframes: [{ time: 0, value: 1, type: "bezier", ctrl: [0.6, 0, 1, 1] },
                    { time: 0.35, value: 0, type: "static" }],
                    totaltime: 0.35
                }
            },
            children: [{
                texture: "circle",
                position: { scale: { x: 1, y: 0.6 }, anchor: 0.5 },
                tint: "#B3E5FC",
            }, {
                texture: "circle",
                position: { scale: { x: 0.8, y: 0.48 }, anchor: 0.5 },
                tint: "#B3E5FC",
            }],
        }, {
            texture: "line_effect",
            position: { anchor: 0.5, scale: 0.7 },
            animations: {
                alpha: {
                    keyframes: [{ time: 0, value: 0.7, type: "bezier", ctrl: [.42, 0, 1, 1] },
                    { time: 0.5, value: 0, type: "static" }],
                    totaltime: 0.5
                }
            },
            tint: "#B3E5FC",
            blend: "add"
        }, {
            texture: "line_light",
            position: { anchor: { x: 0.5, y: 0.95 } },
            animations: {
                alpha: {
                    keyframes: [{ time: 0, value: 0.7, type: "bezier", ctrl: [.42, 0, 1, 1] },
                    { time: 0.4, value: 0, type: "static" }],
                    totaltime: 0.4
                }
            },
            tint: "#B3E5FC",
            blend: "add"
        }, {
            texture: "light",
            position: { anchor: 0.5 },
            animations: {
                alpha: {
                    keyframes: [{ time: 0, value: 0.7, type: "bezier", ctrl: [.42, 0, 1, 1] },
                    { time: 0.4, value: 0, type: "static" }],
                    totaltime: 0.4
                }
            },
            tint: "#03A9F4",
            blend: "add"
        }],
        particles: [{
            textures: ["star", "star_trans"],
            option: {
                duration: 0.02,
                emissionRate: 1000,
                emitRect: { x: { base: 0, offset: 70 }, y: 0 },
                lifeTime: { max: 0.8, min: 0.2 },
                radian: -1.52,
                speed: { max: 800, min: 100 },
                gravity: { x: 0, y: 300 },
                start: { size: { min: 0.05, max: 0.35 }, r: [100, 160], g: 220, b: 250, alpha: 0.6, spin: { base: 0, offset: 3.14 } },
                end: { alpha: 0, size: 0.1, spin: 0 },
                blend: "add"
            }
        }]
    },
    slide: {
        sprites: [{
            texture: "slide",
            position: { anchor: 0.5, scale: 0.7 },
        }, {
            texture: "light",
            position: { anchor: 0.5 },
            animations: {
                alpha: {
                    keyframes: [{ time: 0, value: 0.6, type: "linear" },
                    { time: 1, value: 0, type: "static" }],
                    totaltime: 1, yoyo: true
                }
            },
            blend: "add"
        }, {
            position: { scale: { x: 1, y: 0.6 } },
            children: [{
                texture: "ring_light",
                position: { anchor: 0.5 },
                tint: "#69F0AE", blend: "add"
            }, {
                texture: "circle_notch",
                position: { anchor: 0.5, scale: 0.85 },
                animations: {
                    rotation: {
                        keyframes: [{ type: "linear", time: 0, value: 0 },
                        { type: "static", time: 1.2, value: 6.28 }],
                        totaltime: 1.2, loop: true
                    }
                },
                tint: "#64FFDA"
            }, {
                texture: "circle_notch",
                position: { anchor: 0.5, scale: 1.15 },
                animations: {
                    rotation: {
                        keyframes: [{ type: "linear", time: 0, value: 0 },
                        { type: "static", time: 1.2, value: -6.28 }],
                        totaltime: 1.2, loop: true
                    }
                },
                tint: "#64FFDA"
            }]
        }],
        particles: [{
            textures: ["note_single", "note_double", "star_four"],
            option: {
                duration: 0,
                emissionRate: 20,
                emitRect: { x: { base: 0, offset: 70 }, y: 0 },
                lifeTime: { max: 0.8, min: 0.2 },
                radian: -1.52,
                speed: { max: 700, min: 300 },
                gravity: { x: 0, y: 300 },
                start: { size: { min: 0.2, max: 0.4 }, r: [80, 140], g: 255, b: 190, alpha: 0.6, spin: { base: 0, offset: 0.4 } },
                end: { alpha: 0, size: 0.2 },
                blend: "add"
            }
        }]
    },
    flick: {
        sprites: [{
            animations: {
                scale: {
                    keyframes: [{ time: 0, value: 0, type: "bezier", ctrl: [0, 0, .3, 1] },
                    { time: 0.4, value: 2.3, type: "static" }],
                    totaltime: 0.4
                },
                alpha: {
                    keyframes: [{ time: 0, value: 1, type: "bezier", ctrl: [0.6, 0, 1, 1] },
                    { time: 0.35, value: 0, type: "static" }],
                    totaltime: 0.35
                }
            },
            children: [{
                texture: "circle",
                position: { scale: { x: 1, y: 0.6 }, anchor: 0.5 },
                tint: "#ff93d2",
            }],
        }, {
            texture: "line_effect",
            position: { anchor: 0.5, scale: 0.7 },
            animations: {
                alpha: {
                    keyframes: [{ time: 0, value: 0.7, type: "bezier", ctrl: [.42, 0, 1, 1] },
                    { time: 0.5, value: 0, type: "static" }],
                    totaltime: 0.5
                }
            },
            tint: "#ff93d2",
            blend: "add"
        }, {
            texture: "light",
            position: { anchor: 0.5 },
            animations: {
                alpha: {
                    keyframes: [{ time: 0, value: 0.7, type: "bezier", ctrl: [.42, 0, 1, 1] },
                    { time: 0.4, value: 0, type: "static" }],
                    totaltime: 0.4
                },
                scalex: {
                    keyframes: [{ time: 0, value: 1, type: "bezier", ctrl: [0, 1, 0.5, 1] },
                    { time: 0.4, value: 0.1, type: "static" }],
                    totaltime: 0.4
                },
                scaley: {
                    keyframes: [{ time: 0, value: 1, type: "bezier", ctrl: [0, 1, 0.5, 1] },
                    { time: 0.4, value: 3, type: "static" }],
                    totaltime: 0.4
                },
            },
            tint: "#ff93d2",
            blend: "add"
        }],
        particles: [{
            textures: ["star", "star_trans"],
            option: {
                duration: 0.03,
                emissionRate: 1000,
                emitRect: { x: { base: 0, offset: 70 }, y: 0 },
                lifeTime: { max: 0.8, min: 0.2 },
                radian: -1.52,
                speed: { max: 800, min: 100 },
                gravity: { x: 0, y: 300 },
                start: { size: { min: 0.05, max: 0.35 }, r: 255, g: 130, b: [172, 255], alpha: 0.6, spin: { base: 0, offset: 3.14 } },
                end: { alpha: 0, size: 0.1, spin: 0 },
                blend: "add"
            }
        }]
    },
    fullcombo: {
        sprites: [{
            position: { scale: 0.6 },
            children: [{
                texture: "FullCombo_F",
                position: { x: -450, anchor: { x: 1, y: 0.5 } },
                animations: {
                    scale: {
                        keyframes: [{ time: 0.1, value: 0, type: "bezier", ctrl: [0, 0, .3, 1.3] },
                        { time: 0.5, value: 1, type: "static" }],
                        totaltime: 0.5
                    },
                }
            }, {
                texture: "FullCombo_U",
                position: { x: -360, anchor: { x: 0.9, y: 0.5 } },
                animations: {
                    scale: {
                        keyframes: [{ time: 0.15, value: 0, type: "bezier", ctrl: [0, 0, .3, 1.3] },
                        { time: 0.55, value: 1, type: "static" }],
                        totaltime: 0.55
                    },
                }
            }, {
                texture: "FullCombo_L",
                position: { x: -295, anchor: { x: 0.8, y: 0.5 } },
                animations: {
                    scale: {
                        keyframes: [{ time: 0.2, value: 0, type: "bezier", ctrl: [0, 0, .3, 1.3] },
                        { time: 0.6, value: 1, type: "static" }],
                        totaltime: 0.6
                    },
                }
            }, {
                texture: "FullCombo_L",
                position: { x: -235, anchor: { x: 0.7, y: 0.5 } },
                animations: {
                    scale: {
                        keyframes: [{ time: 0.25, value: 0, type: "bezier", ctrl: [0, 0, .3, 1.3] },
                        { time: 0.65, value: 1, type: "static" }],
                        totaltime: 0.65
                    },
                }
            }, {
                texture: "FullCombo_C",
                position: { x: -70, anchor: { x: 0.6, y: 0.5 } },
                animations: {
                    scale: {
                        keyframes: [{ time: 0.3, value: 0, type: "bezier", ctrl: [0, 0, .3, 1.3] },
                        { time: 0.7, value: 1, type: "static" }],
                        totaltime: 0.7
                    },
                }
            }, {
                texture: "FullCombo_O",
                position: { x: 20, anchor: { x: 0.5, y: 0.5 } },
                animations: {
                    scale: {
                        keyframes: [{ time: 0.35, value: 0, type: "bezier", ctrl: [0, 0, .3, 1.3] },
                        { time: 0.75, value: 1, type: "static" }],
                        totaltime: 0.75
                    },
                }
            }, {
                texture: "FullCombo_M",
                position: { x: 125, anchor: { x: 0.4, y: 0.5 } },
                animations: {
                    scale: {
                        keyframes: [{ time: 0.4, value: 0, type: "bezier", ctrl: [0, 0, .3, 1.3] },
                        { time: .8, value: 1, type: "static" }],
                        totaltime: .8
                    },
                }
            }, {
                texture: "FullCombo_B",
                position: { x: 225, anchor: { x: 0.3, y: 0.5 } },
                animations: {
                    scale: {
                        keyframes: [{ time: 0.45, value: 0, type: "bezier", ctrl: [0, 0, .3, 1.3] },
                        { time: 0.85, value: 1, type: "static" }],
                        totaltime: 0.85
                    },
                }
            }, {
                texture: "FullCombo_O",
                position: { x: 303, anchor: { x: 0.2, y: 0.5 } },
                animations: {
                    scale: {
                        keyframes: [{ time: 0.5, value: 0, type: "bezier", ctrl: [0, 0, .3, 1.3] },
                        { time: 0.9, value: 1, type: "static" }],
                        totaltime: 0.9
                    },
                }
            }, {
                texture: "FullCombo_thunder",
                position: { x: 410, anchor: { x: 0.1, y: 0.5 } },
                animations: {
                    scale: {
                        keyframes: [{ time: 0.55, value: 0, type: "bezier", ctrl: [0, 0, .3, 1.3] },
                        { time: 0.95, value: 1, type: "static" }],
                        totaltime: 0.95
                    },
                }
            }, {
                texture: "FullCombo_star",
                position: { x: 425, y: 60, anchor: { x: 0.5, y: 0.5 } },
                animations: {
                    scale: {
                        keyframes: [{ time: 0, value: 0, type: "bezier", ctrl: [.1, 3, .77, 3] },
                        { time: 0.6, value: 1, type: "static" }],
                        totaltime: 0.6
                    },
                    x: {
                        keyframes: [{ time: 0.5, value: 0, type: "bezier", ctrl: [.24, .01, .12, 1] },
                        { time: 1.2, value: 425, type: "static" }],
                        totaltime: 1.2
                    },
                    y: {
                        keyframes: [{ time: 0.5, value: 0, type: "bezier", ctrl: [.24, .01, .12, 1] },
                        { time: 1.2, value: 60, type: "static" }],
                        totaltime: 1.2
                    },
                    rotation: {
                        keyframes: [{ time: 0, value: -1, type: "bezier", ctrl: [0, 0, .58, 1] },
                        { time: 1.2, value: 0, type: "static" }],
                        totaltime: 1.2
                    }
                }
            }],
            animations: { alpha: { keyframes: [{ type: "bezier", time: 4, value: 1, ctrl: [.25, .1, .25, 1] }, { type: "linear", time: 5, value: 0 }], totaltime: 5, } }
        }]
    }
}

export class TestApp extends Application {
    constructor(canvas: HTMLCanvasElement) {
        super({
            view: canvas,
            width: canvas.clientWidth,
            height: canvas.clientHeight,
        })
        this.loader.add("effect", "/assets/skins/default/effect.json")
        this.loader.add("game", "/assets/skins/default/game.json")
        this.loader.load(this.loaded)
        this.resizeTo = window
    }

    loaded = () => {
        const container = new FixRatioContainer(LayerWidth, LayerHeight)
        container.resize(this.view.width, this.view.height)
        container.addChild(new LaneLayer(this.loader.resources))

        // const info = this.loader.resources.effect.data.info as EffectLayerInfo
        const textures = this.loader.resources.effect.textures
        const layer = new SingleEffectLayer(info.single, textures, 1)

        const list = [0.166, 0.23, 0.36, 0.5]

        const effects = [0, 1, 2, 3, 4, 5, 6].map(x => {
            const i = (3 - Math.abs(x - 3))
            const e = new LaneEffect(this.loader.resources.game.textures!["bg_line" + i], x > 3)
            e.y = LaneBottomY
            e.x = LaneCenterXs[x]
            e.visible = false
            e.anchor.set(list[i], 1)
            return e
        })

        let time = 0

        container.addChild(layer, ...effects)
        this.stage.addChild(container)
        this.ticker.add(() => {
            this.resize()
            const dt = this.ticker.deltaMS / 1000
            time += dt
            container.resize(this.renderer.width, this.renderer.height)
            layer.update(dt)
            effects.forEach(x => x.update(dt))
        })
        // setInterval(() => {
        //     layer.setEffect(LaneCenterXs[Math.floor(7 * Math.random())], LaneBottomY)
        // }, 1000)
        // layer.setTrackedEffect(() => {
        //     return {
        //         x: (time - Math.floor(time)) * 100 + LaneCenterXs[3],
        //         y: LaneBottomY,
        //         visible: time < 5
        //     }
        // })
        // layer.setEffect(LayerWidth / 2, LayerHeight / 2)
        setInterval(() => {
            const i = Math.floor(7 * Math.random())
            effects[i].setAnim()
            layer.setEffect(LaneCenterXs[i], LaneBottomY)
        }, 200)

        setInterval(() => {
            console.log(layer.children.length)
        }, 2000)
    }
}



