import { getDistanceToCoord } from "../../../BloomCore/utils/Utils";
import config from "../../config";
import { getClass, prefix, rightClick } from "../../utils/utils";

let waitingLeap = false
let leaptarget = null
let item

const clickLeap = () => {
    leapSlot = parseInt(Player.getInventory().indexOf(Player.getInventory().getItems().find(a => a?.getName()?.removeFormatting() == "Infinileap")?.getID()))
    if (leapSlot > 7 || leapSlot < 0) { ChatLib.chat(`${prefix} &4Leap Not Found in Hotbar`); return } else {
        heldItem = Player.getHeldItemIndex()
        waitingLeap = true
        Client.scheduleTask(0, () => { Player.setHeldItemIndex(leapSlot) })
        Client.scheduleTask(1, () => {
            ChatLib.chat(`Attempting to Leap`)
            rightClick()
        })
        Client.scheduleTask(3, () => { Player.setHeldItemIndex(heldItem) })
    }
}

const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
register("packetReceived", (packet) => {
    if (!waitingLeap) return
    waitingLeap = false
    Client.scheduleTask(1, () => {
        if (Player.getContainer().getName() !== "Spirit Leap") return
        const items = Player.getContainer()?.getItems()
        for (let i = 0; i < items.length; i++) {
            item = (items[i]?.getName())?.substring(2)?.toLowerCase()
            if (leaptarget && item == leaptarget.toLowerCase()) {
                Player.getContainer().click(i)
                leaptarget = null
            } else if (item == (config.leapPlayer.toLowerCase())) {
                Player.getContainer().click(i)
            }
        }
    })
}).setFilteredClass(S2DPacketOpenWindow)

// I4 Auto Leap Back
register("chat", (message) => {
    if (!config.i4AutoLeap) return;
    const match = message.match(/(.*) completed a device! \(\d\/\d\)/)
    if (match === null) return
    if (match[1] !== Player.getName()) return
    if (getDistanceToCoord(63.5, 127, 35.5) < 1.5) {
        clickLeap()
    }
}).setCriteria("${message}")

// Blood Door Leap
register("chat", (user) => {
    if (!config.leapdoor) return;
    if (user == Player.getName()) return
    leaptarget = user
    clickLeap()
}).setCriteria("${user} opened a WITHER door!")

// s1/s2/s3 leaps soon.

register("command", (target) => {
    if (target) leaptarget = target
    clickLeap()
}).setName("autoleapdebug")