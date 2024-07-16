import { calcSkillLevel, convertToPBTime } from "../../../BloomCore/utils/Utils";
import config from "../../config";
import { getPlayerData, getSbLevelPrefix, chat, chatid } from "../../utils/apiInteract";

import Promise from "../../../PromiseV2"
import request from "../../../requestV2"
import { savedData } from "../../utils/listing";
import { pbCheck } from "./pfStats.js";
import { prefix } from "../../utils/utils";



const makeRequest = (address) => request({
    url: address,
    headers: {
        'User-Agent': ' Mozilla/5.0',
        'Content-Type': 'application/json'
    },
    json: true
})

register("command", (username) => {
    try {
        if (config.apiKey == "null") return chat(`${prefix} &cError Invalid Api Key`)
        const impData = {
            ign: null,
            cata: null,
            class: {
                name: "Mage",
                level: 60 // Hard coded cuz icba
            },
            mp: null,
            sbLevel: null,
            pb: null,
            secrets: null,
            spr: null
        }
        if (!username) username = Player.getName();
        getPlayerData(username, (profileData) => {
            const playerProfile = profileData.profileApi?.[0]

            impData.ign = profileData.username
            impData.cata = calcSkillLevel("catacombs", playerProfile.dungeons?.dungeon_types?.catacombs?.experience)
            impData.mp = playerProfile?.accessory_bag_storage?.highest_magical_power
            impData.sbLevel = (playerProfile?.leveling?.experience) / 100
            let masterSPlusPB = Object.keys(playerProfile?.dungeons?.dungeon_types?.master_catacombs?.fastest_time_s_plus ?? {})
                .reduce((accumulative, floorName) => {
                    accumulative[`M${floorName}`] = playerProfile.dungeons.dungeon_types.master_catacombs.fastest_time_s_plus[floorName]
                    return accumulative
                }
                    , {})
            impData.pb = masterSPlusPB["M7"]  // Other Floor support coming soon tm
            impData.secrets = profileData.secrets
            impData.spr = profileData.secrets / (playerProfile?.dungeons?.dungeon_types?.catacombs?.times_played?.total + playerProfile?.dungeons?.dungeon_types?.master_catacombs?.times_played?.total)

            chatid(`${prefix} &fGetting &6${impData.ign} &fUUID Data...`, 1515)
            Promise.resolve(makeRequest(`https://api.mojang.com/users/profiles/minecraft/${impData.ign}`)).then(response => {
                ChatLib.clearChat(1515)
                const uuid = response.id
                let toKick = [false, "&aRequirements Met"]
                if (config.BlacklistUse) {
                    if (savedData.uuids.blacklist.includes(uuid)) {
                        toKick = [true, `&cBlacklisted Player.`]
                    }
                }
                if (config.WhitelistUse) {
                    if (savedData.uuids.whitelist.includes(uuid)) {
                        toKick = [false, `&aWhitelisted Player`]
                    }
                }
                if (impData.cata < config.minCata) { // Cata Check
                    toKick = [true, `&cLow Cata &7(${impData.cata})`]
                } else if (parseInt(impData.class.level) < config.minClass) {
                    toKick = [true, `&cLow Class Level &7(${impData.class.level})`]
                } else if (parseInt(impData.mp) < parseInt(config.minMP)) {
                    toKick = [true, `&6Low Magical Power &7(${impData.mp})`]
                } else if (parseInt(impData.sbLevel) < config.minLvl) {
                    toKick = [true, `&6Low Skyblock Level`]
                } else if (parseInt(impData.secrets) < parseInt(config.minSecrets)) {
                    toKick = [true, `&6Low Secret Count &7(${impData.secrets})`]
                } else if (!pbCheck(impData.pb)) {
                    toKick = [true, `&6Slow PB &7(${convertToPBTime(impData.pb)})`]
                }

                let msg = `${prefix} &8[${getSbLevelPrefix(impData.sbLevel)}${parseInt(impData.sbLevel)}&8] &6${impData.ign} &f| Cata: &6${impData.cata}&f | Magical Power: &6${impData.mp}&f | PB: &6${convertToPBTime(impData.pb)} &f| Secrets: &6${impData.secrets}`
                new Message(new TextComponent(msg).setHover(
                    "show_text",
                    `&cKick: ${toKick[0] ? "&a✔":"&c✖"}\n&cReason: ${toKick[1]}\n\n&aClick to invite ${username}`
                ).setClick('run_command', `/party invite ${username}`)).chat()

            }).catch(error => {
                ChatLib.chat(error)
            })
        })
    } catch (e) {
        ChatLib.chat(e);
    }
}).setName("nicepb").setAliases("m7stats")