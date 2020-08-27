import { Container, Loader, LoaderResource } from "pixi.js"
import { Container as IOC, injectable } from "inversify"
import { GameLoadConfig, jsonNames, soundNames } from "../Core/GameConfig"
import { Resources, MainStage } from "../Utils/SymbolClasses"
import { LoadingLayer } from "../Layers/LoadingLayer"
import { BackgroundLayer } from "../Layers/BackgroundLayer"
import { ReadyScene } from "./ReadyScene"
import { SceneSwitcher } from "./SceneSwitcher"
import { ValidateRawMap } from "../Core/RawMap"
import { AudioSource } from "../Common/AudioCtx"

function howlerMiddleware(resource: LoaderResource, next: () => void) {
    if (resource.loadType !== LoaderResource.LOAD_TYPE.AUDIO) {
        return next()
    }
    AudioSource.from(fetch(resource.url).then(res => res.blob()))
        .then(audio => {
            resource.data = audio
            resource.complete()
        })
        .catch(err => {
            resource.error = err
            resource.abort("load error")
        })
        .finally(next)
}

const mapContentLoadConfig = {
    load: null as GameLoadConfig["mapContent"],
    url: "object:///rawmap",
}

function validateMap(map: unknown) {
    if (!ValidateRawMap(map)) {
        console.error(ValidateRawMap.errors)
        throw new Error("invalid raw map format")
    }
}

async function mapContentMiddleWare(resource: LoaderResource, next: () => void) {
    if (resource.url !== mapContentLoadConfig.url) {
        return next()
    }
    try {
        const res =
            typeof mapContentLoadConfig.load === "function" ? mapContentLoadConfig.load() : mapContentLoadConfig.load
        if (!res) {
            throw new Error("Invalid load config")
        }
        const map = await res
        validateMap(map)
        resource.data = map
        resource.complete()
    } catch (err) {
        resource.error = err
        resource.abort("Load error")
    } finally {
        next()
    }
}

@injectable()
export class LoadingScene extends Container {
    constructor(
        private ioc: IOC,
        // private stage: MainStage,
        config: GameLoadConfig
    ) {
        super()

        const loader = new Loader()
        loader.pre(howlerMiddleware)
        loader.pre(mapContentMiddleWare)
        mapContentLoadConfig.load = config.mapContent

        loader.add("music", config.musicSrc, { loadType: LoaderResource.LOAD_TYPE.AUDIO })
        if (config.backgroundSrc)
            loader.add("background", config.backgroundSrc, { loadType: LoaderResource.LOAD_TYPE.IMAGE })
        loader.add("map", mapContentLoadConfig.url, { loadType: LoaderResource.LOAD_TYPE.XHR })
        for (const key in jsonNames) loader.add(key, `${config.skin}/${jsonNames[key as keyof typeof jsonNames]}`)
        for (const key in soundNames) loader.add(key, `${config.skin}/${soundNames[key as keyof typeof soundNames]}`)

        loader.onProgress.add(this.progress)
        loader.onError.add(this.error)
        loader.load(this.loaded)

        this.layer = ioc.resolve(LoadingLayer)
        this.addChild(this.layer)
    }

    private layer: LoadingLayer

    private loadedcount = 0
    private progress = (loader: Loader) => {
        this.loadedcount++
        let count = 0
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const key in loader.resources) count++

        this.layer.progress.set(this.loadedcount === count ? 1 : this.loadedcount / (count + 3))
    }

    private loaded = (loader: Loader, res: Partial<Record<string, LoaderResource>>) => {
        this.ioc.bind(Resources).toConstantValue(res as any)
        const stage = this.ioc.get(MainStage)

        stage.addChildAt(this.ioc.resolve(BackgroundLayer), 0)
        const ready = this.ioc.resolve(ReadyScene)

        const swicher = this.ioc.get(SceneSwitcher)
        swicher.switch(this, ready).outEnd.add(remove => {
            this.destroy({ children: true })
            return remove()
        })
    }

    private alertedError = false
    private error = (err: Error, loader: Loader, res: LoaderResource) => {
        console.error("load ", res, " error:", err)
        if (!this.alertedError) {
            alert("load " + res.url + " error: " + err)
            this.alertedError = true
        }
    }
}
