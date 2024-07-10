import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @DecimalSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
    @SliderProperty,
    @NumberProperty
} from '../Vigilance/index';

@Vigilant('DungeonExtras', 'Dungeon Extras', {
    getCategoryComparator: () => (a, b) => {
        const categories = ['General', "Slot Binding", "F7/M7", "Dungeons", "Chat", "Party Finder", "Cheats"];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {

    campSplitsGui = new Gui()
    relicSpawnTimerGui = new Gui()
    dragonSpawnTimerGui = new Gui()
    crystalSpawnTimerGui = new Gui()

    constructor() {
        this.initialize(this);

        this.setCategoryDescription("General", "&6Mod Settings\n\nAuthor: &7Ghostyy (.ghxstyy)\n\n&8/de help&f: &7To view the list of available commands.")
        this.setSubcategoryDescription("General", "API Settings", "&cEnter your API Key here, might exipre though so just make a new one")

		this.setCategoryDescription("F7/M7", "&6QOL Features for F7/M7")
		this.setSubcategoryDescription("F7/M7", "Dragon Timer", "&cSimple timer displayed on screen when drag spawns. Contains built in Drag Prio.")
		this.setSubcategoryDescription("F7/M7", "Location Messages", "&cSends a message in party chat when player reaches a speficic location in boss.")
        this.setSubcategoryDescription("F7/M7", "Crystals", "&cPhase 1 Crystal Utils")
        this.setSubcategoryDescription("F7/M7", "Relics", "&cM7 Phase 5 Relic Utils")
        this.setSubcategoryDescription("F7/M7", "Terminal Timestamps", "&cLittle buggy in s3 arrow device...")
        this.setSubcategoryDescription("F7/M7", "Melody", "&cMelody QOL. Credits: KingClient")
        
		this.setCategoryDescription("Dungeons", "&6QOL Features for Dungeons.")
		this.setSubcategoryDescription("Dungeons", "Alerts", "&cDisplays a Title on screen on various triggers.")
        this.setSubcategoryDescription("Dungeons", "Blood Camp", "&cBlood Camp Utils.")

        this.setCategoryDescription("Chat", "&6General chat features")
        this.setSubcategoryDescription("Chat", "Emotes", "&cCredits: AzuredClient")

        this.setCategoryDescription("Party Finder", "&6Party Finder Features")
        this.setSubcategoryDescription("Party Finder", "Settings", "&cRequirements at which the module kicks players at.")
        this.setSubcategoryDescription("Party Finder", "Player Stats", "&cPlayer stats options displayed when a player joins.\n\n&8/m7stats {user}&f:&7 to manually check someones stats.")
        this.setSubcategoryDescription("Party Finder", "Toggles", "&cMain Toggles for the AutoKick part of the module.")

        this.setCategoryDescription("Slot Binding", "&6Advanced Version of DocilElm's Slot Binding.\n\nSetup a hotkey from Minecraft Controls.\n\n&cTo Bind: &7Hold Keybind -> Left-Click a slot in your inventory -> Left-Click a slot in your hotbar.\n&cTo Un-Bind: &7Hold Keybind -> Right-Click a bound slot in your inventory.\n&cTo Swap: &7Shift + Left-Click any bound slot in your hotbar.")

        this.setCategoryDescription("Cheats",  "&6The Cheats Section.\n\n&4Use at your own risk. Might ban if misused.")
        this.setSubcategoryDescription("Cheats", "Auto 4", "&cAuto i4 Settings.")
        this.setSubcategoryDescription("Cheats", "Auto Leap", "&cAuto Leap Settings.\n\n&7Uses &aClient&c.&9scheduleTask&a()&7 and no delay.")

    }
    // --- --- General Settings --- --- //

    // Api Key
    @TextProperty({
        name: 'API Key',
        description: 'Your API Key &chttps://developer.hypixel.net/dashboard',
        category: 'General',
        subcategory: 'API Settings'
    })
    apiKey = "null";


    // --- --- Slot Binding --- --- //
    @SwitchProperty({
        name: "Toggle",
        description: "Turns Slotbinding &aON &7or &cOFF.",
        category: "Slot Binding"
    })
    bindingToggle = false
    
    @SelectorProperty({
        name: 'Preset',
        description: 'The current preset in use. \nSelected preset will be edited with keybind.',
        category: 'Slot Binding',
        options: ['Mage', 'Archer', 'Berserker', 'Healer', 'Tank', 'General'],
    })
    bindingPreset = 0;

    @SwitchProperty({
        name: "Auto Select",
        description: "&7Selects slot bind preset based on your selected class in dungeons.\n&cSelected preset will be used outside dungeons.",
        category: "Slot Binding"
    })
    autoSelect = false

    @TextProperty({
        name: "Swap Sound",
        description: "Sound used for slot binding.",
        category: "Slot Binding",
        placeholder: "note.pling"
    })
    swapSound = "note.pling";

    @SwitchProperty({
        name: "Dynamic Coloring",
        description: "Changes the color of the line overlay based on the preset being used.",
        category: "Slot Binding"
    })
    dynamicColoring = false

    // @ColorProperty({
    //     name: "General Color",
    //     description: "Change the highlight color",
    //     category: "Slot Binding"
    // })
    // bindingColor = Color.WHITE;

	// --- --- F7/M7 Options --- --- //

	// Dragons
	@SwitchProperty({
        name: "Dragon Spawn Timer",
        description: "Server tick based dragon timer. Syncs with lag",
        category: "F7/M7",
        subcategory: "Dragon Timer"
    })
    dragonSpawnTimer = false
    
    @ButtonProperty({
        name: "Move Dragon Spawn Timer",
        description: "Scroll to change scale, middle click to reset",
        category: "F7/M7",
        subcategory: "Dragon Timer",
        placeholder: "Move"
    })
    MoveDragonSpawnTimerGui() {
        this.dragonSpawnTimerGui.open()
    };

	// Location Messages
	@SwitchProperty({
        name: "Alert Toggle",
        description: "Shows a title and plays a sound when a party member sends a location message",
        category: "F7/M7",
        subcategory: "Location Messages"
    })
    locationNotif = false;

    @TextProperty({
        name: "Location Notification Sound",
        description: "Sound used for Location Notification Sound",
        category: "F7/M7",
        subcategory: "Location Messages",
        placeholder: "note.harp"
    })
    locationSound = "note.harp";

    @SwitchProperty({
        name: "SS Nearby Message",
        category: "F7/M7",
        subcategory: "Location Messages"
    })
    ssCoord = false;

    @SwitchProperty({
        name: "Pre Enter 2 Nearby Message",
        category: "F7/M7",
        subcategory: "Location Messages"
    })
    pre2Coord = false;

    @SwitchProperty({
        name: "Insta 3 Nearby Message",
        category: "F7/M7",
        subcategory: "Location Messages"
    })
    i3Coord = false;

    @SwitchProperty({
        name: "Pre Enter 3 Nearby Message",
        category: "F7/M7",
        subcategory: "Location Messages"
    })
    pre3Coord = false;
    
    @SwitchProperty({
        name: "At Core Message",
        category: "F7/M7",
        subcategory: "Location Messages"
    })
    slingshotCoord = false;

    @SwitchProperty({
        name: "Inside Tunnel Message",
        category: "F7/M7",
        subcategory: "Location Messages"
    })
    tunnelCoord = false;

    // Crystal Spawn Timers
    @SwitchProperty({
        name: "Crystal Spawn Timer",
        description: "Shows when the second set of crystals will spawn",
        category: "F7/M7",
        subcategory: "Crystals"
    })
    crystalSpawnTimer = false

    @ButtonProperty({
        name: "Move Crystal Spawn Timer",
        description: "Scroll to change scale, middle click to reset",
        category: "F7/M7",
        subcategory: "Crystals",
        placeholder: "Move"
    })
    MoveCrystalSpawnTimerGui() {
        this.crystalSpawnTimerGui.open()
    };

    // Relic Spawn Timer

    @SwitchProperty({
        name: "Relic Spawn Timer",
        description: "Shows time until relics spawn, NOT accurate with server lag",
        category: "F7/M7",
        subcategory: "Relics"
    })
    relicSpawnTimer = false;

    @TextProperty({
        name: "Relic Spawn Timer Amount",
        description: "Since relic spawn is so rng, choose your own time... \nDefault is 42",
        category: "F7/M7",
        subcategory: "Relics",
        placeholder: "42"
    })
    relicSpawnTimerAmt = "42"

    @ButtonProperty({
        name: "Move Relic Spawn Timer",
        description: "Scroll to change scale, middle click to reset",
        category: "F7/M7",
        subcategory: "Relics",
        placeholder: "Move"
    })
    MoveRelicSpawnTimerGui() {
        this.relicSpawnTimerGui.open()
    };

    // Terminal Timestamps
    @SwitchProperty({
        name: "Toggle",
        description: "Shows what time each terminal, device, or lever was completed",
        category: "F7/M7",
        subcategory: "Terminal Timestamps"
    })
    terminalTimestamps = false;

    // Melody
    @SwitchProperty({
        name: 'Announce Melody',
        description: 'Sends a message in Party Chat if you get the Melody Terminal',
        category: 'F7/M7',
        subcategory: 'Melody'
    })
    announceMelody = false;

    @SwitchProperty({
        name: 'Announce Melody Progress',
        description: 'Sends a message in Party Chat with the progress of your terminal',
        category: 'F7/M7',
        subcategory: 'Melody'
    })
    melodyProgress = false;

    @TextProperty({
        name: "Announce Melody Text",
        description: "Text used for Announce Melody",
        category: "F7/M7",
        subcategory: "Melody",
        placeholder: "null"
    })
    melodyText = "melody";

	// --- --- Dungeons --- --- //

    // Ice spray
    @NumberProperty({
        name: 'Slot Swap',
        description: "Decides what slot to swap to after ice spraying.\nUse 0 to swap back to the item you were previously holding.",
        category: 'Dungeons',
		subcategory: "Ice Spray",
        min: 0,
        max: 9
    })
    iceSlot = 0;

    @SwitchProperty({
        name: "Jump Spray",
        description: "Clicks the space bar when ice spraying.",
        category: "Dungeons",
        subcategory: "Ice Spray"
    })
    jumpSpray = false

	// Alerts
	@TextProperty({
        name: 'Alert Sound',
        description: "Sound ID to be played on each alert",
        category: 'Dungeons',
		subcategory: "Alerts"
    })
    alertSound = "note.pling";

	@SwitchProperty({
        name: "AutoPet Alert",
        description: "Displays a title when autopet triggers.",
        category: "Dungeons",
        subcategory: "Alerts"
    })
    autopetAlert = false

	@SwitchProperty({
        name: "P5 Rag Axe Alert",
        description: "Displays a title when you should rag axe in drag phase.",
        category: "Dungeons",
        subcategory: "Alerts"
    })
    ragAlert = false

	@SwitchProperty({
        name: "Blood Camp Alert",
        description: "Displays a title when watcher is done spawning the first four mobs. Only works if you're mage.",
        category: "Dungeons",
        subcategory: "Alerts"
    })
    campAlert = false

	@SwitchProperty({
        name: "Tact Alert",
        description: "Displays a title at 3s timer, to help insta-clears.",
        category: "Dungeons",
        subcategory: "Alerts"
    })
    tactAlert = false

    // Camp Help

    @SwitchProperty({
        name: "Blood Camp Display",
        description: "Highlights the locations blood mobs are going to spawn at.\nCredits: DocilElm & KingIsBad\n&cCan be inaccurate at times.\n&7Requires you to fix ct imports. [https://github.com/ChatTriggers/ChatTriggers/wiki/Fixing-broken-imports]",
        category: "Dungeons",
        subcategory: "Blood Camp"
    })
    bloodHelper = false

    @SwitchProperty({
        name: "Auto Swing",
        description: "&7Left clicks for you.\n&cRequires Blood Camp Display to be on.",
        category: "Dungeons",
        subcategory: "Blood Camp"
    })
    autoSwing = false

    @TextProperty({
        name: "Swing Time",
        description: "The time when you want autoswing to left click.\nNeeds to be between 0 and 2. &cAdjust based on your ping.",
        category: "Dungeons",
        subcategory: "Blood Camp"
    })
    autoSwingTime = "1";

    @SwitchProperty({
        name: "Blood Camp Helper",
        description: "Shows watcher move time and time to kill remaining blood mobs \nShows alert when watcher dialogue appears and if Diamante Giant is detected \nFixes SBE Blood Opened split when blood is entered before the door is opened\n&cAdds a tick accurate blood camp timer.",
        category: "Dungeons",
        subcategory: "Blood Camp"
    })
    bloodCampHelper = false

    @SwitchProperty({
        name: "Show Blood Camp Splits On Screen",
        description: "Shows watcher move timer and remaining mobs killed timer as you are blood camping",
        category: "Dungeons",
        subcategory: "Blood Camp"
    })
    campSplits = false

    @SwitchProperty({
        name: "Send Blood Camp Splits",
        description: "Sends camp splits in party chat. &cRequires Blood Camp Helper to be &aON&c.",
        category: "Dungeons",
        subcategory: "Blood Camp"
    })
    partySplits = false

    @SwitchProperty({
        name: "Send Blood Progress",
        description: "Counts blood mobs spawned in party chat. Cool for pb runs.",
        category: "Dungeons",
        subcategory: "Blood Camp"
    })
    partyProgress = false

    @SwitchProperty({
        name: "Hide Splits in Boss",
        description: "Hides the blood camp splits when you enter boss",
        category: "Dungeons",
        subcategory: "Blood Camp"
    })
    hideCampSplitsInBoss = false

    @ButtonProperty({
        name: "Move Blood Camp Splits",
        description: "Scroll to change scale, middle click to reset",
        category: "Dungeons",
        subcategory: "Blood Camp",
        placeholder: "Move"
    })
    MoveCampSplitsGui() {
        this.campSplitsGui.open()
    };

    // --- --- Chat Options --- --- //

    // Emotes
    @SwitchProperty({
        name: "Chat Emotes",
        description: "Replaces certain strings in your chat messages with emotes.",
        category: "Chat",
        subcategory: "Emotes"
    })
    chatEmotes = false

    // --- --- Party Finder --- --- //


    // --- Stats --- //

    // Stats in Party Chat
    @SwitchProperty({
        name: 'Party Chat',
        description: 'Sends stats message in party chat when a player joins.',
        category: 'Party Finder',
        subcategory: 'Stats',
    })
    SendStats = false

    // Player Join Sounds
    @SwitchProperty({
        name: 'Join Sound',
        description: 'Plays a sound when a player joins the party.',
        category: 'Party Finder',
        subcategory: 'Stats',
    })
    PFSound = false

    // Sound ID
    @TextProperty({
        name: 'Sound ID',
        description: 'Sound to be played when a player joins',
        category: 'Party Finder',
        subcategory: 'Stats'
    })
    PFSoundID = "note.pling";

    // Sound Volume
    @SliderProperty({
        name: 'Sound Volume',
        description: 'Volume of the sound played',
        category: 'Party Finder',
        subcategory: 'Stats',
        min: 1,
        max: 100,
        step: 1,
    })
    PFSoundVolume = 50;

    // --- Kick Toggle --- // 

    // Auto Kick
    @SwitchProperty({
        name: '&dAutoKick',
        description: 'Automatically kick players that do not meet requirements.',
        category: 'Party Finder',
        subcategory: 'Toggles',
    })
    AutoKick = false

    // Blacklist use
    @SwitchProperty({
        name: 'Blacklist',
        description: 'Automatically kick blacklisted players.',
        category: 'Party Finder',
        subcategory: 'Toggles',
    })
    BlacklistUse = false
    
    // Whitelist use
    @SwitchProperty({
        name: 'Whitelist',
        description: 'Do not automatically kick whitelisted players.',
        category: 'Party Finder',
        subcategory: 'Toggles',
    })
    WhitelistUse = false

    // --- Settings --- //

    // Cata Level
    @SliderProperty({
        name: 'Cata Level',
        description: 'Minimum Catacombs Level',
        category: 'Party Finder',
        subcategory: 'Settings',
        min: 1,
        max: 100,
        step: 1,
    })
    minCata = 50;

    // Class Level
    @SliderProperty({
        name: 'Class Level',
        description: 'Minimum Class Level',
        category: 'Party Finder',
        subcategory: 'Settings',
        min: 1,
        max: 50,
        step: 1,
    })
    minClass = 45;

    // MP
    @SliderProperty({
        name: 'Magical Power',
        description: 'Minimum Magical Power',
        category: 'Party Finder',
        subcategory: 'Settings',
        min: 100,
        max: 2000,
        step: 1,
    })
    minMP = 1450;

    // SB Level
    @SliderProperty({
        name: 'Skyblock Level',
        description: 'Minimum Skyblock Level',
        category: 'Party Finder',
        subcategory: 'Settings',
        min: 1,
        max: 500,
        step: 1,
    })
    minLvl = 300;

    // PB
    @SelectorProperty({
        name: 'Personal Best',
        description: 'Minimum Personal Best',
        category: 'Party Finder',
        subcategory: 'Settings',
        options: ['Sub 4:40', 'Sub 5:00', 'Sub 5:30', 'Sub 6:00', 'Custom'],
    })
    minPB = 0;

    // PB Custom
    @TextProperty({
        name: 'Custom PB Time',
        description: 'Custom personal best time in milliseconds.',
        category: 'Party Finder',
        subcategory: 'Settings',
    })
    customMinPB = "300000";
    
    // Secrets
    @TextProperty({ 
        name: 'Secret Count',
        description: 'Minimum Secret Count',
        category: 'Party Finder',
        subcategory: 'Settings',
    })
    minSecrets = "50000";

    // --- --- Cheats --- --- //

    // --- Auto 4 --- //

    @SwitchProperty({
        name: "Auto 4",
        description: "Auto 4th dev. ",
        category: "Cheats",
        subcategory: "Auto 4"
    })
    auto4 = false;

    // --- Auto Leap --- //

    @SwitchProperty({
        name: "Auto Leap",
        description: "Turns &aON &7or &cOFF &7the Auto-Leap Module.",
        category: "Cheats",
        subcategory: "Auto Leap"
    })
    autoleap = false;

    @TextProperty({
        name: "Target Player",
        description: "Person to leap to on command/trigger.",
        category: "Cheats",
        subcategory: "Auto Leap"
    })
    leapPlayer = "NikoXY";

    @SwitchProperty({
        name: "Leap to door opener",
        description: "Automatically leaps to whoever opens a wither door.",
        category: "Cheats",
        subcategory: "Auto Leap"
    })
    leapdoor = false;

    @SwitchProperty({
        name: "Leap after auto4",
        description: "Leaps to Target Player after i4.",
        category: "Cheats",
        subcategory: "Auto Leap"
    })
    i4AutoLeap = false;
}

export default new Settings();