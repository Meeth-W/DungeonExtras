import config from "../../config"
import { data } from "../../utils/data"
import { registerWhen } from "../../../BloomCore/utils/Utils"

let timeText = new Text('').setScale(1).setShadow(true).setAlign('CENTER').setColor(Renderer.GRAY)
let ticks = 0

register("chat", () => {
    ticks = parseInt(config.relicSpawnTimerAmt)
    tickCounter.register()
}).setCriteria("[BOSS] Necron: All this, for nothing...")

const tickCounter = register("packetReceived", () => {
    ticks--
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction")).unregister()

registerWhen(register("renderOverlay", () => {
    let timeLeft = (ticks / 20).toFixed(2)

    timeText.setString(timeLeft)
    timeText.setScale(data.relicSpawnTimer.scale)
    timeText.draw(data.relicSpawnTimer.x, data.relicSpawnTimer.y)
}), () => config.relicSpawnTimer && ticks > 0)

register("renderOverlay", () => {
    if (config.relicSpawnTimerGui.isOpen()) {
        timeText.setString("2.00")
        timeText.setScale(data.relicSpawnTimer.scale)
        timeText.draw(data.relicSpawnTimer.x, data.relicSpawnTimer.y)
    }
})

register("dragged", (dx, dy, x, y, bn) => {
    if (!config.relicSpawnTimerGui.isOpen() || bn == 2) return
    data.relicSpawnTimer.x = x
    data.relicSpawnTimer.y = y
    data.save()
})

register("scrolled", (x, y, dir) => {
    if (!config.relicSpawnTimerGui.isOpen()) return
    if (dir == 1) data.relicSpawnTimer.scale += 0.05
    else data.relicSpawnTimer.scale -= 0.05
    data.save()
})

register("guiMouseClick", (x, y, bn) => {
    if (!config.relicSpawnTimerGui.isOpen() || bn != 2) return
    data.relicSpawnTimer.x = Renderer.screen.getWidth() / 2
    data.relicSpawnTimer.y = Renderer.screen.getHeight() / 2 + 10
    data.relicSpawnTimer.scale = 1
    data.save()
})