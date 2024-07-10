import PogObject from "../../PogData/index"
import config from "../config"
import { prefix } from "./utils"

export const Bindingdata = new PogObject("DungeonExtras", {
    Presets: [
        {}, {}, {}, {}, {}, {}
    ]
}, "data/bindings.json")

export function resetBindings() {
    Bindingdata.Presets = [{}, {}, {}, {}, {}, {}]
    Bindingdata.save()
    ChatLib.chat(`${prefix} &aAll bindings have been reset.`)
}

export function resetPreset(index) {
    if (index < 0 || index > 6) {
        ChatLib.chat(`${prefix} &cPreset must be between 0 and 6.`)
        return
    }

    Bindingdata.Presets[index - 1] = {}
    Bindingdata.save()
    ChatLib.chat(`${prefix} &aPreset ${index} has been reset.`)
}

export function deletebinding(slotNumber) {
    const slot = parseInt(slotNumber)
    if (!(slot in Bindingdata.Presets[config.bindingPreset])) return ChatLib.chat(`${prefix} &cPlease set a valid slot! &7slots&r: &b${Object.keys(Bindingdata.Presets[config.bindingPreset]).join(", &b")}`)

    delete Bindingdata.Presets[config.bindingPreset][slot]
    Bindingdata.save()

    ChatLib.chat(`${prefix} &aBinding with slot &b${slot} &adeleted`)
}