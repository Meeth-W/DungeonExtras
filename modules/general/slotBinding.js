import { Bindingdata, deletebinding } from "../../utils/binding.js"
import { getDyanamicColor, getPreset, getSlotCoords, prefix } from "../../utils/utils.js"
import config from "../../config"

const bindingKeybind = new KeyBind("Bind Slots", Keyboard.KEY_NONE, "Dungeon Extras")

let previousSlot = null

const getPlayerController = () => Client.getMinecraft().field_71442_b

const handleShiftClick = (slotClicked) => {
    const container = Player.getContainer()
    const hotbarSlot = Bindingdata.Presets[getPreset()][slotClicked] % 36
    if (hotbarSlot == null || hotbarSlot >= 9) return

    getPlayerController().func_78753_a(
        container.getWindowId(),
        slotClicked,
        hotbarSlot,
        2,
        Player.getPlayer()
    )
    World.playSound(config.swapSound, 2, 1)
}


register("guiRender", (x, y, gui) => {
    if (gui.class.getName() !== "net.minecraft.client.gui.inventory.GuiInventory") return;
    if (!config.bindingToggle) return

    Object.keys(Bindingdata.Presets[getPreset()]).forEach((bind) => {
        const [x, y] = getSlotCoords(parseInt(bind))
        Renderer.translate(0, 0, 1);
        Renderer.drawRect(Renderer.DARK_GRAY, x, y, 16, 16);    
        Renderer.translate(0, 0, 2);
        Renderer.drawLine(getDyanamicColor(), x, y, x+16, y, 1);
        Renderer.translate(0, 0, 2);
        Renderer.drawLine(getDyanamicColor(), x, y, x, y+16, 1);
        Renderer.translate(0, 0, 2);
        Renderer.drawLine(getDyanamicColor(), x, y+16, x+16, y+16, 1);
        Renderer.translate(0, 0, 2);    
        Renderer.drawLine(getDyanamicColor(), x+16, y+16, x+16, y, 1);
    })

    const hoverSlot = gui?.getSlotUnderMouse()?.field_75222_d;
    const hotbarBind = Bindingdata.Presets[getPreset()][`${hoverSlot}`]
    
    if (hotbarBind) {
        const [x1, y1] = getSlotCoords(hoverSlot);
        const [x2, y2] = getSlotCoords(hotbarBind);
        Renderer.translate(0, 0, 3);
        Renderer.drawLine(getDyanamicColor(), x1 + 8, y1 + 8, x2 + 8, y2 + 8, 1);
    }

    if (previousSlot) {
        let [x1, y1] = getSlotCoords(previousSlot)
        Renderer.translate(0, 0, 2);
        Renderer.drawRect(Renderer.RED, x1, y1, 16, 16);
        Renderer.translate(0, 0, 3);
        Renderer.drawLine(Renderer.RED, x1 + 8, y1 + 8, x, y, 1);
    }
})


register("guiMouseClick", (_, __, mbtn, gui, event) => {
    if (!(gui instanceof net.minecraft.client.gui.inventory.GuiInventory)) return
    const slot = gui.getSlotUnderMouse()?.field_75222_d

    if (mbtn == 1 && Keyboard.isKeyDown(bindingKeybind.getKeyCode())) {
        cancel(event)
        deletebinding(slot)
    } else {
        if (!slot || slot < 5) return

        if (previousSlot && (slot < 36 || slot > 44)) {
            ChatLib.chat(`${prefix} &cPlease click a valid hotbar slot!`)
            previousSlot = null
            return
        }
    
        if (Keyboard.isKeyDown(Keyboard.KEY_LSHIFT) && slot in Bindingdata.Presets[getPreset()]) {
            if (!config.bindingToggle) return
            cancel(event)
            handleShiftClick(slot)
            return
        }
    
        if (!Keyboard.isKeyDown(bindingKeybind.getKeyCode())) return
    
        if (!previousSlot) previousSlot = slot
        if (!(slot in Bindingdata.Presets[getPreset()]) && !previousSlot) {
            Bindingdata.Presets[getPreset()][slot] = null
            Bindingdata.save()
        }
    
        cancel(event)
    
        if (slot === previousSlot) return
        
        Bindingdata.Presets[getPreset()][previousSlot] = slot
        Bindingdata.save()
    
        ChatLib.chat(`${prefix} &aSaved binding&r: &6${previousSlot} &b-> &6${slot}`)
    
        previousSlot = null
    }
})