import config from "../../config"
import { getClass } from "../../utils/utils"
import { registerWhen } from "../../../BloomCore/utils/Utils"
import { data } from "../../utils/data"

let inP5 = false
let ticks = 0
let redSpawning = false
let orangeSpawning = false
let blueSpawning = false
let purpleSpawning = false
let greenSpawning = false
let drags = [null, null]

let timeText = new Text('').setScale(3).setShadow(true).setAlign('CENTER')

registerWhen(register("packetReceived", (packet) => {
    if (inP5 && packet.func_179749_a().toString() == "ENCHANTMENT_TABLE") {
        handleParticles(parseInt(packet.func_149220_d()), parseInt(packet.func_149226_e()), parseInt(packet.func_149225_f()))
    }
}).setFilteredClass(net.minecraft.network.play.server.S2APacketParticles), () => config.dragonSpawnTimer)

const tickCounter = register("packetReceived", () => {
    ticks--
    if (ticks <= 0) {
        tickCounter.unregister()
        spawning = false
    }
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")).unregister()

registerWhen(register("renderOverlay", () => {
    let timeLeft = (ticks / 20).toFixed(2)

    timeText.setString(timeLeft)
    timeText.setScale(data.dragonSpawnTimer.scale)
    timeText.draw(data.dragonSpawnTimer.x, data.dragonSpawnTimer.y)
}), () => config.dragonSpawnTimer && ticks > 0)

register("worldLoad", () => {
    inP5 = false
    ticks = 0
    redSpawning = false
    orangeSpawning = false
    blueSpawning = false
    purpleSpawning = false
    greenSpawning = false
    tickCounter.unregister()
    drags = [null, null]
})

register("chat", () => {
    inP5 = true
}).setCriteria("[BOSS] Necron: All this, for nothing...")

register("renderOverlay", () => {
    if (config.dragonSpawnTimerGui.isOpen()) {
        timeText.setString("5.00")
        timeText.setScale(data.dragonSpawnTimer.scale)
        timeText.draw(data.dragonSpawnTimer.x, data.dragonSpawnTimer.y)
    }
})

register("dragged", (dx, dy, x, y, bn) => {
    if (!config.dragonSpawnTimerGui.isOpen() || bn == 2) return
    data.dragonSpawnTimer.x = x
    data.dragonSpawnTimer.y = y
    data.save()
})

register("scrolled", (x, y, dir) => {
    if (!config.dragonSpawnTimerGui.isOpen()) return
    if (dir == 1) data.dragonSpawnTimer.scale += 0.05
    else data.dragonSpawnTimer.scale -= 0.05
    data.save()
})

register("guiMouseClick", (x, y, bn) => {
    if (!config.dragonSpawnTimerGui.isOpen() || bn != 2) return
    data.dragonSpawnTimer.x = Renderer.screen.getWidth() / 2
    data.dragonSpawnTimer.y = Renderer.screen.getHeight() / 2 + 40
    data.dragonSpawnTimer.scale = 3
    data.save()
})

const dragInfo = {
    purple: { color: Renderer.LIGHT_PURPLE, prio: [0, 4] },
    blue: { color: Renderer.BLUE, prio: [1, 0] },
    red: { color: Renderer.RED, prio: [2, 1] },
    green: { color: Renderer.GREEN, prio: [3, 2] },
    orange: { color: Renderer.GOLD, prio: [4, 3] }
}

function assignColor(drag) {
    if (!drags[0]) {
        drags[0] = drag
    } else if (!drags[1] && drag != drags[0]) {
        drags[1] = drag
        determinePrio()
    } else {
        // change the color of timeText
        timeText.setColor(drag.color)
    }
}

// changes color of timeText
function determinePrio() {
    if (getClass() == "Archer" || getClass() == "Tank") {
        if (drags[0].prio[0] < drags[1].prio[0]) {
            timeText.setColor(drags[0].color)
        } else {
            timeText.setColor(drags[1].color)
        }
    } else if (getClass() == "Berserk" || getClass() == "Mage") {
        if (drags[0].prio[0] > drags[1].prio[0]) {
            timeText.setColor(drags[0].color)
        } else {
            timeText.setColor(drags[1].color)
        }
    } else if (getClass() == "Healer") {
        if (drags[0].prio[1] < drags[1].prio[1]) {
            timeText.setColor(drags[0].color)
        } else {
            timeText.setColor(drags[1].color)
        }
    }
}

function handleParticles(x, y, z) {
    // check if correct height
    if (y >= 14 && y <= 19) {
        // check if red/green
        if (x >= 27 && x <= 32) {
            // check if red
            if (z == 59) {
                if (!redSpawning) {
                    assignColor(dragInfo.red)
                    ticks = 100
                    tickCounter.register()
                    redSpawning = true
                    setTimeout(() => {
                        redSpawning = false
                    }, 8000)
                }
            // check if green
            } else if (z == 94) {
                if (!greenSpawning) {
                    assignColor(dragInfo.green)
                    ticks = 100
                    tickCounter.register()
                    greenSpawning = true
                    setTimeout(() => {
                        greenSpawning = false
                    }, 8000)
                }
            }
        // check if blue/orange
        } else if (x >= 79 && x <= 85) {
            // check if blue
            if (z == 94) {
                if (!blueSpawning) {
                    assignColor(dragInfo.blue)
                    ticks = 100
                    tickCounter.register()
                    blueSpawning = true
                    setTimeout(() => {
                        blueSpawning = false
                    }, 8000)
                }
            // check if orange
            } else if (z == 56) {
                if (!orangeSpawning) {
                    assignColor(dragInfo.orange)
                    ticks = 100
                    tickCounter.register()
                    orangeSpawning = true
                    setTimeout(() => {
                        orangeSpawning = false
                    }, 8000)
                }
            }
        // check if purple    
        } else if (x == 56) {
            if (!purpleSpawning) {
                assignColor(dragInfo.purple)
                ticks = 100
                tickCounter.register()
                purpleSpawning = true
                setTimeout(() => {
                    purpleSpawning = false
                }, 8000)
            }
        }
    }
}