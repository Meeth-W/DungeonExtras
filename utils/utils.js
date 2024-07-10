import { getScoreboard, removeUnicode } from "../../BloomCore/utils/Utils"
import config from "../config";

export const prefix = "§6[§cD§5E§6]§r "

export function getDistance(x1, z1, x2, z2) {
    return Math.sqrt((x1 - x2) ** 2 + (z1 - z2) ** 2)
}

export function formatNumber(number) {
    let format = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let ind = format.indexOf(".")
    if (ind > -1) return format.substring(0, ind)
    else return format
}

export function isInDungeon() {
    try {
        return TabList?.getNames()?.some(a => a.removeFormatting() == 'Dungeon: Catacombs')
    } catch (e) { }
}

export function getClass() {
    let index = TabList?.getNames()?.findIndex(line => line?.includes(Player.getName()))
    if (index == -1) return
    let match = TabList?.getNames()[index]?.removeFormatting().match(/.+ \((.+) .+\)/)
    if (!match) return "EMPTY"
    return match[1];
}

export function getSlotCoords(i) {
    if (i >= Player.getContainer().getSize()) return [0, 0];

    const gui = Client.currentGui.get();
    const slot = gui.field_147002_h?.func_75139_a(i);
    const x = slot.field_75223_e  + gui?.getGuiLeft() ?? 0;
    const y = slot.field_75221_f  + gui?.getGuiTop() ?? 0;
  
    return [x, y];
  }

export function getPreset() {
    if (!config.autoSelect) return config.bindingPreset // Auto off: use preset
    if (!isInDungeon()) return config.bindingPreset // Auto on but outside dungeon: use preset

    // auto on but in dungeon
    let selectedClass = getClass()
    if (selectedClass == "Mage") return 0
    else if (selectedClass == "Archer") return 1
    else if (selectedClass == "Berserker") return 2
    else if (selectedClass == "Healer") return 3
    else if (selectedClass == "Tank") return 4
    else return config.bindingPreset // err in class check: use preset
}

export function getDyanamicColor() {
    if (!config.dynamicColoring) return Renderer.WHITE
    // if (!config.dynamicColoring) return Renderer.getColor(config.bindingColor)
    let preset = getPreset()
    if (preset == 0) return Renderer.BLUE
    else if (preset == 1) return Renderer.GOLD
    else if (preset == 2) return Renderer.RED
    else if (preset == 3) return Renderer.LIGHT_PURPLE
    else if (preset == 4) return Renderer.DARK_GREEN
    // else return Renderer.getColor(config.bindingColor)
    else return Renderer.WHITE
}

// Credits: Cyan

export function InDungeon() {
    let world = TabList.getNames().find(tab => tab.includes("Dungeon:"));
    if (!world) return false;
    else return true;
  }

 export function leftClick() {
    const leftClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147116_af", null)
    leftClickMethod.setAccessible(true);
    leftClickMethod.invoke(Client.getMinecraft(), null)
}


export function rightClick() {
    const rightClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147121_ag", null)
    rightClickMethod.setAccessible(true);
    rightClickMethod.invoke(Client.getMinecraft(), null);
} 

export function SetSlot(index) {
    Player.getPlayer().field_71071_by?.field_70461_c = index;
}


export function getSprayIndex() {
    hotbar = Player.getInventory().getItems().slice(0, 8)

    for (i = 0; i < 8; i ++) {
        if (hotbar[i] && hotbar[i].getLore()[0].includes("Ice Spray Wand")) {
            return i
        }
    }
    ChatLib.chat(`${prefix}Spray not in hotbar!`)
    return Player.getHeldItemIndex()
}

export function randomize(num, flux) {
    const randomizedNum = Math.round((Math.random() * 2 - 1) * flux * 100) / 100; // round to two decimal places
    return num + randomizedNum;
}

export const getScoreboard = (formatted=false) => {
    if (!World.getWorld()) return null
    let sb = Scoreboard.getLines().map(a => a.getName())
    if (formatted) return Scoreboard.getLines()
    return sb.map(a => ChatLib.removeFormatting(a))
}

export const removeUnicode = (string) => typeof(string) !== "string" ? "" : string.replace(/[^\u0000-\u007F]/g, "")


export function setBlockTo(x, y, z, block) {
    const pos = new BlockPos(x * 1, y * 1, z * 1);
    World.getWorld().func_175656_a(pos.toMCBlock(), new BlockType(block).getDefaultState());
}

export function scanFor(blockID, scanRadius) {
    let coordsFound = []
    const Radius = scanRadius
    const playerX = Math.floor(Player.getX())
    const playerY = Math.floor(Player.getY())
    const playerZ = Math.floor(Player.getZ())
    
    for (let x = playerX - Radius; x <= playerX + Radius; x++) {
        for (let y = playerY - Radius; y <= playerY + Radius; y++) {
          for (let z = playerZ - Radius; z <= playerZ + Radius; z++) {
            let block = World.getBlockAt(x, y, z);
            if (block?.getType()?.getID() === blockID) {
                coordsFound.push([x, y, z])
            }
          }
        }
      }

    return coordsFound
}