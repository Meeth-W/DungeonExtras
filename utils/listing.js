import PogObject from "../../PogData";
import { chatid } from "./apiInteract";
import Promise from "../../PromiseV2"
import request from "../../requestV2"
import { prefix } from "./utils";

const makeRequest = (address) => request({
    url: address,
    headers: {
        'User-Agent': ' Mozilla/5.0',
        'Content-Type': 'application/json'
    },
    json: true
})


export const savedData = new PogObject("DungeonExtras", {
    uuids: {
        blacklist: [],
        whitelist: []
    }, igns: {
        blacklist: [],
        whitelist: []
    }, reasons: {
        blacklist: [], 
        whitelist: []
    }
}, "data/pfinder.json")


export function addWhitelist(username) {
    chatid(`${prefix} &fGetting &6${username} &fUUID Data...`, 1515)
    Promise.resolve(makeRequest(`https://api.mojang.com/users/profiles/minecraft/${username}`)).then(response => {
        ChatLib.clearChat(1515)
        const uuid = response.id
        if (savedData.uuids.whitelist.includes(uuid)) {
            ChatLib.chat(`${prefix} &6${username} &cis already whitelisted.`)
        } else {
            savedData.uuids.whitelist.push(uuid);
            savedData.igns.whitelist.push(username)
            savedData.save()
            ChatLib.chat(`${prefix} &6${username} &aadded to the whitelist!`)
            return 0
        }
    }).catch(error => {
        // ChatLib.chat(error)
        ChatLib.clearChat(1515)
        ChatLib.chat(`&cUsername does not exist.`)
    })
}

export function unWhitelist(username) {
    chatid(`${prefix} &fGetting &6${username} &fUUID Data...`, 1515)
    Promise.resolve(makeRequest(`https://api.mojang.com/users/profiles/minecraft/${username}`)).then(response => {
        ChatLib.clearChat(1515)
        const uuid = response.id

        const index = savedData.uuids.whitelist.indexOf(uuid)
        if (index !== -1) {
            savedData.uuids.whitelist.splice(index, 1)
            savedData.igns.whitelist.splice(index, 1)
            savedData.save()
            ChatLib.chat(`${prefix} &6${username} &aremoved from the whitelist!`)
            return 0
        } else {
            ChatLib.chat(`${prefix} &6${username} &cis not in the whitelist.`)
        }
    }).catch(error => {
        // ChatLib.chat(error)
        ChatLib.clearChat(1515)
        ChatLib.chat(`&cUsername does not exist.`)
    })
}

export function addBlacklist(username) {
    chatid(`${prefix} &fGetting &6${username} &fUUID Data...`, 1515)
    Promise.resolve(makeRequest(`https://api.mojang.com/users/profiles/minecraft/${username}`)).then(response => {
        ChatLib.clearChat(1515)
        const uuid = response.id

        if (savedData.uuids.blacklist.includes(uuid)) {
            ChatLib.chat(`${prefix} &6${username} &cis already blacklisted.`)
        } else {
            savedData.uuids.blacklist.push(uuid);
            savedData.igns.blacklist.push(username)
            savedData.save()
            ChatLib.chat(`${prefix} &6${username} &aadded to the blacklist!`)
            return 0
        }
    }).catch(error => {
        // ChatLib.chat(error)
        ChatLib.clearChat(1515)
        ChatLib.chat(`&cUsername does not exist.`)
    })
}
export function unBlacklist(username) {
    chatid(`${prefix} &fGetting &6${username} &fUUID Data...`, 1515)
    Promise.resolve(makeRequest(`https://api.mojang.com/users/profiles/minecraft/${username}`)).then(response => {
        ChatLib.clearChat(1515)
        const uuid = response.id

        const index = savedData.uuids.blacklist.indexOf(uuid)
        if (index !== -1) {
            savedData.uuids.blacklist.splice(index, 1)
            savedData.igns.blacklist.splice(index, 1)
            savedData.save()
            ChatLib.chat(`${prefix} &6${username} &aremoved from the blacklist!`)
            return 0
        } else {
            ChatLib.chat(`${prefix} &6${username} &cis not in the blacklist.`)
        }
    }).catch(error => {
        // ChatLib.chat(error)
        ChatLib.clearChat(1515)
        ChatLib.chat(`&cUsername does not exist.`)
    })
}