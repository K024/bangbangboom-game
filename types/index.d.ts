
declare type Optional<T> = {
    [prop in keyof T]?: T[prop];
};

declare module "bangbangboom-game" {
    export class Game {
        constructor(canvas: HTMLCanvasElement, config: Optional<GameConfig>, loadConfig: Optional<GameLoadConfig>);
        start(): void;
        pause(): void;
        ondestroyed: () => void;
        destroy(): void;
    }

    export class GameConfig {
        judgeOffset: number;
        visualOffset: number;
        speed: number;
        resolution: number;
        noteScale: number;
        barOpacity: number;
        backgroundDim: number;
        effectVolume: number;
        showSimLine: boolean;
        laneEffect: boolean;
        mirror: boolean;
        beatNote: boolean;
        autoplay: boolean;
        debug?: boolean;
    }

    export class GameLoadConfig {
        musicSrc: string;
        mapSrc: string;
        backgroundSrc: string;
        skin: string;
        songName: string;
        loadingMessages?: string[];
    }

}
