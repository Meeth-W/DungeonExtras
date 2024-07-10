import config from "../../config"

let inP3 = false;

register('packetReceived', (packet) => {
    if (packet.func_148916_d()) return
    const message = packet.func_148915_c().func_150254_d().removeFormatting()
    if (message == "[BOSS] Storm: I should have known that I stood no chance.") {
        inP3 = true;
    }
    if (message == "The Core entrance is opening!")
        inP3 = false;
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S02PacketChat"))

register('guiOpened', () => {
    if (!inP3) return
    Client.scheduleTask(2, () => {
        if (Player?.getContainer()?.getName() != 'Click the button on time!') return
        claySlots = new Map([
            [25, `pc ${config.melodyText} 25%`],
            [34, `pc ${config.melodyText} 50%`],
            [43, `pc ${config.melodyText} 75%`]
        ])
        if (!config.announceMelody) return
        ChatLib.command(`pc ${config.melodyText}`)
    })
})

let claySlots = new Map([
    [25, `pc ${config.melodyText} 25%`],
    [34, `pc ${config.melodyText} 50%`],
    [43, `pc ${config.melodyText} 75%`]
])

register('step', () => {
    if (!inP3 || Player?.getContainer()?.getName() != 'Click the button on time!' || !config.melodyProgress) return

    let greenClays = Array.from(claySlots.keys()).filter(index => Player?.getContainer()?.getItems()[index]?.getMetadata() == 5)
    if (!greenClays.length) return
    
    ChatLib.command(claySlots.get(greenClays[greenClays.length - 1]))
    greenClays.forEach(clay => claySlots.delete(clay))
    greenClays = []
}).setFps(5)