
declare type Optional<T> = {
    [prop in keyof T]?: T[prop];
};

declare module "bangbangboom-game" {
    export type NoteBase = {
        /** real time from music starts */
        time: number
        /** left: 0 ---- right : 6 */
        lane: number
    }

    export type Single = NoteBase & {
        type: "single"
        /** is the note on beat or not */
        onbeat: boolean
    }

    export type Flick = NoteBase & {
        type: "flick"
    }

    export type Slide = {
        id: number
        flickend: boolean
    }

    export type SlideNote = NoteBase & {
        type: "slide"
        slideid: number
    }

    export type NoteType = Single | Flick | SlideNote

    export type RawMap = {
        notes: NoteType[]
        slides: Slide[]
    }

    export class Game {
        constructor(canvas: HTMLCanvasElement, config: Optional<GameConfig>, loadConfig: Optional<GameLoadConfig>);
        start(): void;
        pause(): void;
        ondestroyed?: () => void;
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
        mapContent: () => (RawMap | Promise<RawMap> | null);
        backgroundSrc: string;
        skin: string;
        songName: string;
        loadingMessages?: string[];
    }

}
