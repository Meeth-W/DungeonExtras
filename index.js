import config from "./config";

import "./modules/dungeons/dragPrio.js"
import "./modules/dungeons/alerts.js"
import "./modules/dungeons/locationMessages.js"
import "./modules/dungeons/relicTimer.js"
import "./modules/dungeons/crystalTimer.js"
import "./modules/dungeons/terminalTimestamps.js"
import "./modules/dungeons/campHelper.js"
import "./modules/dungeons/melody.js"
import "./modules/dungeons/campAssist.js"

import "./modules/general/chat.js"
import "./modules/general/slotBinding.js"

import "./modules/pfinder/commands.js"
import "./modules/pfinder/pfStats.js"

import "./modules/cheats/Auto4.js"
import "./modules/cheats/AutoLeap.js"

import { addBlacklist, unBlacklist, addWhitelist, unWhitelist, savedData } from './utils/listing'
import { prefix, rightClick, getSprayIndex, randomize } from "./utils/utils.js";
import { resetBindings, resetPreset, deletebinding } from "./utils/binding.js";
import { chat, spcmd } from "./utils/apiInteract.js";

let mc = Client.getMinecraft()
let jumpKey = new KeyBind(mc.field_71474_y.field_74314_A)
let reason

register("command", (...args) => {
    try {
        if (!args || !args[0]) {
            return config.openGUI()
        } else if (args[0].toLowerCase() == "help") {
            let messages = [
                `&6&m${ChatLib.getChatBreak(" ")}`,
                `       &6&lDungeon Extras`,
                `&c- Whitelist & Blacklist Commands`,
                `&f/de whitelist &a- Displays the whitelist`,
                `&f/de whitelist add (user) &a- Adds player to whitelist`,
                `&f/de whitelist remove (user) &a- Removes player from whitelist`,
                `&f/de blacklist &a- Displays the blacklist`,
                `&f/de blacklist add (user) &a- Adds player to whitelist`,
                `&f/de blacklist remove (user) &a- Removes player from whitelist`,
                `&c- Slot Binding Commands`,
                `&f/de binding delete {slot} &a- Deletes a certain slot binding in curr preset.`,
                `&f/de binding clear {preset} &a- Deletes a specified preset (1-6)`,
                `&f/de binding clearall &a- Deletes all slot binding data.`,
                `&c- Other Commands`,
                `&f/de spray &a- Ice sprays for you. &4(Cheat)`,
                `&f/de spcmd {soopy cmd} {username} &a- Use soopy commands.`,
                `&f/nicepb {username} &a- Check m7 stats for a user.`,
                `&6&m${ChatLib.getChatBreak(" ")}`
            ]
            ChatLib.chat(messages.join("\n"))
        } else if (args[0].toLowerCase() == "binding") {
            if (!args[1]) {
                let bindmessages = [
                    `&6&m${ChatLib.getChatBreak(" ")}`,
                    `&c&lSlot Binding Commands`,
                    `&f/de binding delete {slot} &a- Deletes a certain slot binding in curr preset.`,
                    `&f/de binding clear {preset} &a- Deletes a specified preset (1-6)`,
                    `&f/de binding clearall &a- Deletes all slot binding data.`,
                    `&6&m${ChatLib.getChatBreak(" ")}`
                ]
                ChatLib.chat(bindmessages.join("\n"))
            } else if (args[1].toLowerCase() == "delete") {
                if (args[2]) return deletebinding(parseInt(args[2]));
                ChatLib.chat(`${prefix} Speficy a valid slot.`)
            } else if (args[1].toLowerCase() == "clear") {
                if (args[2]) return resetPreset(parseInt(args[2]));
                ChatLib.chat(`${prefix} Speficy a valid preset (1-6).`)
            } else if (args[1].toLowerCase() == "clearall") {
                resetBindings()
            }
        } else if (args[0].toLowerCase() == "blacklist") {
            if ( !args[1] ) {
                ChatLib.chat(`${prefix} &cBlacklisted Players: &7` + savedData.igns.blacklist.join(", ")) 
                return
            } else if (args[1].toLowerCase() == "add") {
                if (!args[2]) return ChatLib.chat("&cSpecify a username.")
                addBlacklist(args[2])
            } else if ( args[1].toLowerCase() == "remove") {
                if (!args[2]) return ChatLib.chat("&cSpecify a username.")
                unBlacklist(args[2])
            } 
        } else if ( args[0].toLowerCase() == "whitelist") {
            if ( !args[1] ) {
                ChatLib.chat(`${prefix} &aWhitelisted Players: &7` + savedData.igns.whitelist.join(", "))
                return
            } else if ( args[1].toLowerCase() == "add") {
                if (!args[2]) return ChatLib.chat("&cSpecify a username.")
                addWhitelist(args[2])
            } else if ( args[1].toLowerCase() == "remove") {
                if (!args[2]) return ChatLib.chat("&cSpecify a username.")
                unWhitelist(args[2])
            }
        } else if (args[0].toLowerCase() == "spray") {
            curr = Player.getHeldItemIndex()
            setTimeout(() => {
                Player.setHeldItemIndex(getSprayIndex())
                if (config.jumpSpray) jumpKey.setState(true)
                setTimeout(() => {
                    rightClick()
                    if (config.jumpSpray) jumpKey.setState(false)
                    setTimeout(() => {
                        if (config.iceSlot == 0) return Player.setHeldItemIndex(curr)
                        Player.setHeldItemIndex(config.iceSlot - 1)
                    }, randomize(70, 25))
                }, randomize(150, 25))
            }, randomize(70, 25))
        } else if (args[0].toLowerCase() == "spcmd") {
            spcmd(args[1], args[2])
        }
    } catch (e) {
        ChatLib.chat(e);
    }
}).setName("de").setAliases("dungeonextras")