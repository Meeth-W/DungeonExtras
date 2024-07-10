import { calcSkillLevel, convertToPBTime, prefix } from "../../../BloomCore/utils/Utils";
import config from "../../config";
import { getPlayerData, getSbLevelPrefix, chat, chatid} from "../../utils/apiInteract";
import { savedData } from "../../utils/listing";
import { prefix } from "../../utils/utils";

import Promise from "../../../PromiseV2"
import request from "../../../requestV2"

const makeRequest = (address) => request({
    url: address,
    headers: {
        'User-Agent': ' Mozilla/5.0',
        'Content-Type': 'application/json'
    },
    json: true
})

export function pbCheck(pb) {
    switch ( config.minPB ) {
        case 0: // 4:40 = 280000
            if ( parseInt(pb) > 280000) {
                return false
            } else return true;
        case 1: // 5:00 = 300000
            if ( parseInt(pb) > 300000) {
                return false
            } else return true;
        case 2: // 5:30 = 330000
            if ( parseInt(pb) > 330000) {
                return false
            } else return true;
        case 3: // 6:00 = 360000
            if ( parseInt(pb) > 360000) {
                return false
            } else return true;
        case 4: // Custom PB
            if ( parseInt(pb) > parseInt(config.customMinPB)) {
                return false
            } else return true;
    }
}

register("chat", (player, classs, level) => {
    // Sound
    if ( config.PFSound ) { World.playSound( config.PFSoundID, config.PFSoundVolume, 1.0) }

    // Getting Data
    if ( config.apiKey == "null") return chat(`${prefix} &cError Invalid Api Key`)
    const impData = {
        ign: null,
        cata: null,
        class: {
            name: classs,
            level: level
        },
        mp: null,
        sbLevel: null,
        pb: null,
        secrets: null,
        spr: null
    }

    getPlayerData(player, (profileData) => {
        const playerProfile = profileData.profileApi?.[0]
        
        impData.ign = profileData.username
        impData.cata = calcSkillLevel("catacombs", playerProfile.dungeons?.dungeon_types?.catacombs?.experience)
        impData.mp = playerProfile?.accessory_bag_storage?.highest_magical_power
        impData.sbLevel = (playerProfile?.leveling?.experience)/100
        let masterSPlusPB = Object.keys(playerProfile?.dungeons?.dungeon_types?.master_catacombs?.fastest_time_s_plus ?? {})
        .reduce((accumulative, floorName) => {
            accumulative[`M${floorName}`] = playerProfile.dungeons.dungeon_types.master_catacombs.fastest_time_s_plus[floorName]
            return accumulative
        }
        , {})
        impData.pb = masterSPlusPB["M7"]  // Other Floor support coming soon tm
        impData.secrets = profileData.secrets
        impData.spr = profileData.secrets/(playerProfile?.dungeons?.dungeon_types?.catacombs?.times_played?.total + playerProfile?.dungeons?.dungeon_types?.master_catacombs?.times_played?.total)

        // chatid(`${prefix} &fGetting &6${impData.ign} &fUUID Data...`, 1515)
        Promise.resolve(makeRequest(`https://api.mojang.com/users/profiles/minecraft/${impData.ign}`)).then(response => {
            // ChatLib.clearChat(1515)
            const uuid = response.id
            let toKick = [false, "&aRequirements Met"]
            if (config.BlacklistUse && savedData.uuids.blacklist.includes(uuid)) {
                toKick = [true, `&cBlacklisted Player.`]
            } else if (config.WhitelistUse && savedData.uuids.whitelist.includes(uuid)) {
                toKick = [false, `&aWhitelisted Player`]
            } else if (impData.cata < config.minCata) { // Cata Check
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
            } else {
                toKick = [false, "&aRequirements Met"]
            }


            // Send Message
            let msg = `${prefix} &8[${getSbLevelPrefix(impData.sbLevel)}${parseInt(impData.sbLevel)}&8] &6${impData.ign} &f| Kick: ${toKick[0] ? "&cTrue":"&aFalse"} &f| Reason: ${toKick[1]}`
            new Message(new TextComponent(msg).setHover(
                "show_text", 
                `&c&l-------------------------\n&6Catacombs Level: &c${impData.cata}\n&6Magical Power: &c${impData.mp}\n&6PB: &c${convertToPBTime(impData.pb)}\n&6Total Secrets: &c${impData.secrets}\n&c&l-------------------------`
            )).chat()

            // Party Message
            if (config.SendStats) {
                setTimeout(() => {
                    ChatLib.command(
                        `pc Skyblock Level: ${parseInt(impData.sbLevel)} | M7 PB: ${convertToPBTime(impData.pb)} | Highest Magical Power: ${impData.mp}`
                    )
                }, 500);
            }

            // Auto Kick 
            if (config.AutoKick && toKick[0]) {
                setTimeout(() => {
                    ChatLib.command(
                        `p kick ${impData.ign}`
                    )
                }, 1000);
            }

            }).catch(error => {
                ChatLib.chat(error)
            })
    })
}).setCriteria("Party Finder > ${player} joined the dungeon group! (${classs} Level ${level})")
