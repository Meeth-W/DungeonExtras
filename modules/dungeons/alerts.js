import config from "../../config"
import { getClass, prefix } from "../../utils/utils"

let showText = false
let text = new Text("")

// AutoPet
register("chat", (lvl, pet) => {
    if (!config.autopetAlert) return
    World.playSound(config.alertSound, 100.0, 1.0)
    text = new Text(`${pet}`).setShadow(true).setScale(4).setColor(Renderer.LIGHT_PURPLE);
    showText = true;
    setTimeout(() => {
        showText = false;
    }, 4000)
}).setCriteria("Autopet equipped your [Lvl ${lvl}] ${pet}! VIEW RULE")

// Blood Camp
register("chat", () => {
    if (!config.campAlert) return
    if (getClass() != "Mage") return
    World.playSound(config.alertSound, 100.0, 2.0)
    text = new Text(`BLOOD READY!`).setShadow(true).setScale(4).setColor(Renderer.GOLD);
    showText = true;
    setTimeout(() => {
        showText = false;
    }, 4000)
}).setCriteria("[BOSS] The Watcher: Let's see how you can handle this.")

// P5 Rag Axe
register("chat", () => {
    if (!config.ragAlert) return
    World.playSound(config.alertSound, 100.0, 2.0)
    text = new Text(`RAG AXE!`).setShadow(true).setScale(4).setColor(Renderer.RED);
    showText = true;
    setTimeout(() => {
        showText = false;
    }, 4000)
}).setCriteria("[BOSS] Wither King: I no longer wish to fight, but I know that will not stop you.")

// Tact
register("chat", () => {
    if (!config.tactAlert) return
    World.playSound(config.alertSound, 100.0, 2.0)
    text = new Text(`TACT!`).setShadow(true).setScale(4).setColor(Renderer.DARK_PURPLE);
    showText = true;
    setTimeout(() => {
        showText = false;
    }, 4000)
}).setCriteria("Starting in 3 seconds.")

register("renderOverlay", () => {
    if (showText) {
        text.draw((Renderer.screen.getWidth() - text.getWidth()) / 2, (Renderer.screen.getHeight() - text.getHeight()) / 2 - 50);
    }
})