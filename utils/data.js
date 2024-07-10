import PogObject from "../../PogData/index"

export const data = new PogObject("DungeonExtras", {
    relicSpawnTimer: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2 + 10,
        scale: 1
    },
    predevTimer: {
        pb: 999999999
    },
    relicTimer: {
        Purple: 999,
        Blue: 999,
        Red: 999,
        Green: 999,
        Orange: 999
    },
    dragonSpawnTimer: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2 + 40,
        scale: 3
    },
    crystalSpawnTimer: {
        x: Renderer.screen.getWidth() / 2,
        y: Renderer.screen.getHeight() / 2 + 10,
        scale: 1
    }, 
    campSplits: {
        x: 0,
        y: 0,
        scale: 1
    }
}, "data/data.json")