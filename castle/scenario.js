/**
 * Castle — Medieval Fantasy Scenario for CodeHex
 *
 * A classic medieval strategy experience featuring knights, archers, mages,
 * and dragons. Includes morale, experience systems, day/night cycles, and
 * weather mechanics. Victory by domination (70% map control).
 *
 * Biomes:    plains, forest, mountain, water, lava
 * Resources: gold, stone, mana, food
 * Units:     knight, archer, mage, catapult, dragon (neutral), skeleton (neutral)
 * Buildings: castle, barracks, tower, tavern, mine, academy, wall, farm
 */

scenario("castle", s => {

  // ── META ──────────────────────────────────────────────────────────────────

  s.name("Castle: Age of Kingdoms");
  s.description("Medieval fantasy with knights, dragons, and siege warfare. Conquer 70% of the map to claim victory.");
  s.version("1.0.0");
  s.author("CodeHex Team");
  s.thumbnail("castle_thumbnail.png");

  // ── GLOBAL RULES ─────────────────────────────────────────────────────────

  s.rules({
    friendlyFire:       false,
    logisticsMode:      false,
    moraleSystem:       true,
    experienceSystem:   true,
    resourceCaps:       true,
    globalResourcePool: false,
    nightCycle:         true,
    weather:            true,
    siegeMode:          true,
  });

  // ── BIOMES ───────────────────────────────────────────────────────────────

  s.biome("plains", {
    color:        "#8db360",
    moveCost:     1,
    defenseBonus: 0,
    attackBonus:  0,
    harvestBonus: 10,
    spawnWeight:  0.3,
  });

  s.biome("forest", {
    color:         "#2d5a27",
    moveCost:      2,
    defenseBonus:  20,
    attackBonus:   0,
    visionPenalty: 1,
    spawnWeight:   0.5,
  });

  s.biome("mountain", {
    color:        "#8a8a8a",
    moveCost:     3,
    defenseBonus: 30,
    attackBonus:  10,
    visionBonus:  2,
    spawnWeight:  0.1,
  });

  s.biome("water", {
    color:      "#3a7bd5",
    impassable: true,
  });

  s.biome("lava", {
    color:        "#ff4500",
    moveCost:     2,
    damagePerTurn: 10,
    allowedUnits: ["dragon"],
    spawnWeight:  0.0,
  });

  // ── RESOURCES ────────────────────────────────────────────────────────────

  s.resource("gold", {
    color:         "#ffd700",
    rarity:        "common",
    maxDeposit:    200,
    regenRate:     0,
    harvestAmount: 15,
    decayRate:     0,
  });

  s.resource("stone", {
    color:         "#808080",
    rarity:        "uncommon",
    maxDeposit:    150,
    regenRate:     0,
    harvestAmount: 10,
    decayRate:     0,
  });

  s.resource("mana", {
    color:         "#9c27b0",
    rarity:        "rare",
    maxDeposit:    80,
    regenRate:     1,
    harvestAmount: 5,
    decayRate:     0,
  });

  s.resource("food", {
    color:         "#8bc34a",
    rarity:        "common",
    maxDeposit:    250,
    regenRate:     3,
    harvestAmount: 20,
    decayRate:     1,
  });

  s.resourceCap("gold",  1000);
  s.resourceCap("stone", 500);
  s.resourceCap("mana",  300);
  s.resourceCap("food",  800);

  // ── AURAS ────────────────────────────────────────────────────────────────

  s.aura("morale_boost", {
    effect:    { morale: 10 },
    stackable: false,
  });

  s.aura("exp_boost", {
    effect:    { expMultiplier: 1.5 },
    stackable: false,
  });

  // ── STATUS EFFECTS ───────────────────────────────────────────────────────

  s.statusEffect("stun", {
    duration:     2,
    blocksMove:   true,
    blocksAttack: true,
    color:        "#ffeb3b",
  });

  s.statusEffect("burn", {
    duration:      3,
    damagePerTurn: 8,
    damageType:    "fire",
    color:         "#ff5722",
  });

  s.statusEffect("poison", {
    duration:      5,
    damagePerTurn: 4,
    damageType:    "poison",
    color:         "#4caf50",
  });

  // ── ABILITIES ────────────────────────────────────────────────────────────

  s.ability("charge", {
    cooldown:    3,
    range:       2,
    damageMulti: 2.0,
    damageType:  "physical",
    effect:      "stun",
    effectDuration: 1,
    targetType:  "enemy",
  });

  s.ability("volley", {
    cooldown:     2,
    range:        4,
    damageMulti:  1.2,
    aoeRadius:    1,
    targetsCount: 3,
    damageType:   "physical",
    targetType:   "enemy",
  });

  s.ability("fireball", {
    cooldown:   4,
    range:      3,
    damage:     35,
    aoeRadius:  1,
    damageType: "fire",
    effect:     "burn",
    effectDuration: 3,
    cost:       { mana: 15 },
    targetType: "enemy",
  });

  s.ability("healAlly", {
    cooldown:   3,
    range:      2,
    healAmount: 30,
    cost:       { mana: 10 },
    targetType: "ally",
  });

  s.ability("fireBreath", {
    cooldown:   2,
    range:      2,
    damage:     50,
    aoeRadius:  2,
    damageType: "fire",
    effect:     "burn",
    effectDuration: 3,
    targetType: "enemy",
  });

  s.ability("bombardment", {
    cooldown:   5,
    range:      5,
    damage:     60,
    aoeRadius:  2,
    damageType: "physical",
    effect:     "stun",
    effectDuration: 2,
    targetType: "any",
  });

  // ── UNITS ────────────────────────────────────────────────────────────────

  s.unit("knight", {
    hp:             100,
    attack:         18,
    defense:        14,
    range:          1,
    speed:          2,
    visionRange:    3,
    cost:           { gold: 50, food: 20 },
    productionTime: 3,
    color:          "#c0c0c0",
    abilities:      ["charge"],
    carryCap:       0,
    levels: [
      { level: 2, expRequired: 80,  bonuses: { attack: 4, hp: 20, defense: 2 } },
      { level: 3, expRequired: 200, bonuses: { attack: 8, hp: 40, defense: 5 } },
    ],
    expPerKill: 30,
  });

  s.unit("archer", {
    hp:             55,
    attack:         14,
    defense:        5,
    range:          3,
    speed:          2,
    visionRange:    5,
    cost:           { gold: 35, food: 15 },
    productionTime: 2,
    color:          "#795548",
    abilities:      ["volley"],
    levels: [
      { level: 2, expRequired: 60,  bonuses: { attack: 3, range: 1 } },
      { level: 3, expRequired: 160, bonuses: { attack: 6, visionRange: 1 } },
    ],
    expPerKill: 25,
  });

  s.unit("mage", {
    hp:             40,
    attack:         10,
    defense:        3,
    range:          3,
    speed:          1,
    visionRange:    4,
    cost:           { gold: 80, mana: 30 },
    productionTime: 5,
    color:          "#7b1fa2",
    abilities:      ["fireball", "healAlly"],
    upkeep:         { mana: 2 },
    levels: [
      { level: 2, expRequired: 100, bonuses: { attack: 5, hp: 10 } },
      { level: 3, expRequired: 250, bonuses: { attack: 10, hp: 20, range: 1 } },
    ],
    expPerKill: 40,
  });

  s.unit("catapult", {
    hp:             70,
    attack:         25,
    defense:        4,
    range:          5,
    speed:          1,
    visionRange:    2,
    cost:           { gold: 100, stone: 60 },
    productionTime: 6,
    color:          "#5d4037",
    abilities:      ["bombardment"],
    aoeRadius:      2,
    expPerKill: 50,
  });

  s.unit("dragon", {
    hp:             250,
    attack:         45,
    defense:        20,
    range:          2,
    speed:          3,
    visionRange:    6,
    color:          "#d32f2f",
    abilities:      ["fireBreath"],
    neutral:        true,
    immunities:     ["fire"],
    expPerKill:     100,
  });

  s.unit("skeleton", {
    hp:             25,
    attack:         6,
    defense:        2,
    range:          1,
    speed:          2,
    visionRange:    2,
    color:          "#e0e0e0",
    neutral:        true,
    spawnGroup:     5,
    expPerKill:     10,
  });

  // ── BUILDINGS ────────────────────────────────────────────────────────────

  s.building("castle", {
    hp:         500,
    defense:    20,
    size:       1,
    cost:       { gold: 0 },
    produces:   ["knight", "archer"],
    visionRange: 6,
    maxLevel:   3,
    levels: [
      { level: 2, upgradeCost: { gold: 200, stone: 100 }, bonuses: { hp: 150, defense: 5 } },
      { level: 3, upgradeCost: { gold: 400, stone: 200 }, bonuses: { hp: 300, defense: 10, visionRange: 2 } },
    ],
    storage: { gold: 500, stone: 200, mana: 100, food: 300 },
  });

  s.building("barracks", {
    hp:                   200,
    defense:              10,
    cost:                 { gold: 80, stone: 40 },
    produces:             ["knight", "archer", "catapult"],
    visionRange:          3,
    maxLevel:             2,
    levels: [
      { level: 2, upgradeCost: { gold: 120, stone: 60 }, bonuses: { hp: 80 } },
    ],
    productionSpeedBonus: 1,
  });

  s.building("tower", {
    hp:         150,
    defense:    12,
    cost:       { gold: 60, stone: 50 },
    visionRange: 8,
    autoAttack: true,
    attack:     15,
    range:      4,
    maxLevel:   3,
    levels: [
      { level: 2, upgradeCost: { gold: 80, stone: 40 },  bonuses: { attack: 5, range: 1 } },
      { level: 3, upgradeCost: { gold: 150, stone: 80 }, bonuses: { attack: 10, range: 1, hp: 50 } },
    ],
  });

  s.building("tavern", {
    hp:         100,
    defense:    5,
    cost:       { gold: 60, food: 30 },
    visionRange: 3,
    aura:       "morale_boost",
    auraRadius: 4,
    passable:   false,
  });

  s.building("mine", {
    hp:             120,
    defense:        8,
    cost:           { gold: 40, stone: 20 },
    visionRange:    2,
    mustBePlacedOn: "mountain",
    passiveHarvest: { gold: 5 },
  });

  s.building("academy", {
    hp:         180,
    defense:    8,
    cost:       { gold: 120, stone: 60, mana: 20 },
    produces:   ["mage"],
    visionRange: 4,
    aura:       "exp_boost",
    auraRadius: 5,
  });

  s.building("wall", {
    hp:              250,
    defense:         25,
    cost:            { stone: 30 },
    passable:        false,
    ownTeamPassable: true,
    visionRange:     1,
  });

  s.building("farm", {
    hp:             80,
    defense:        3,
    cost:           { gold: 30 },
    visionRange:    2,
    mustBePlacedOn: "plains",
    passiveHarvest: { food: 8 },
  });

  // ── OVERLAYS ─────────────────────────────────────────────────────────────

  s.overlay("fire", {
    color:         "#ff5722",
    opacity:       0.6,
    damagePerTurn: 10,
    spreadChance:  0.2,
    duration:      6,
  });

  s.overlay("holy_ground", {
    color:    "#ffd54f",
    opacity:  0.4,
    duration: 15,
    effect:   { healPerTurn: 5, moraleBonus: 5 },
  });

  // ── MAP GENERATION ───────────────────────────────────────────────────────

  s.mapgen(g => {
    g.biome("plains",   0.40);
    g.biome("forest",   0.25);
    g.biome("mountain", 0.20);
    g.biome("water",    0.10);
    g.biome("lava",     0.05);

    g.scatter("gold",  { biome: "mountain", density: 0.08 });
    g.scatter("stone", { biome: "mountain", density: 0.06 });
    g.scatter("mana",  { biome: "forest",   density: 0.03 });
    g.scatter("food",  { biome: "plains",   density: 0.10 });

    g.clusters("forest",   { minSize: 4, maxSize: 10, count: 6 });
    g.clusters("mountain", { minSize: 3, maxSize: 7,  count: 4 });

    g.rivers({ count: 2, minLength: 6, maxLength: 15 });

    g.clearAroundStart(3);
  });

  // ── EVENTS ───────────────────────────────────────────────────────────────

  s.event("dragon_attack", {
    chance:     0.02,
    minStep:    20,
    maxPerGame: 5,
    message:    "A fearsome dragon descends from the mountains!",
    effect: e => {
      const cell = e.randomCell({ biome: "mountain" });
      e.spawnNeutral("dragon", cell);
    },
  });

  s.event("undead_uprising", {
    chance:     0.005,
    minStep:    50,
    maxPerGame: 3,
    message:    "The dead rise from their graves! Skeletons swarm the land!",
    effect: e => {
      e.spawnNeutralGroup("skeleton", 15);
    },
  });

  s.event("gold_rush", {
    chance:     0.03,
    minStep:    10,
    maxPerGame: 6,
    message:    "Rich gold veins discovered in the mountains!",
    effect: e => {
      const cells = e.randomCells(4, { biome: "mountain" });
      cells.forEach(c => e.addResource(c, "gold", 60));
    },
  });

  s.event("plague", {
    chance:     0.01,
    minStep:    30,
    maxPerGame: 2,
    message:    "A terrible plague sweeps across the land!",
    effect: e => {
      const units = e.allUnits();
      units.forEach(u => e.applyStatus(u, "poison"));
    },
  });

  s.event("magical_storm", {
    chance:     0.015,
    minStep:    25,
    maxPerGame: 4,
    message:    "A magical storm sets the forests ablaze!",
    effect: e => {
      const cells = e.randomCells(6, { biome: "forest" });
      cells.forEach(c => e.addOverlay(c, "fire", { duration: 8 }));
    },
  });

  s.event("holy_ground", {
    chance:     0.02,
    minStep:    15,
    maxPerGame: 5,
    message:    "Holy light illuminates a patch of ground!",
    effect: e => {
      const cells = e.randomCells(3, { biome: "plains" });
      cells.forEach(c => e.addOverlay(c, "holy_ground", { duration: 15 }));
    },
  });

  s.event("tournament", {
    chance:     0.01,
    minStep:    40,
    maxPerGame: 2,
    message:    "A grand tournament begins! Double score for 20 turns!",
    effect: e => {
      e.startGlobalEvent("score_multiplier", { multiplier: 2, duration: 20 });
    },
  });

  // ── VICTORY CONDITION ────────────────────────────────────────────────────

  s.victoryCondition("domination", { percent: 70 });

  // ── START CONDITIONS ─────────────────────────────────────────────────────

  s.startCondition(p => {
    p.give("gold", 100);
    p.give("stone", 50);
    p.give("food", 80);
    p.spawnUnit("knight", p.startPos);
    p.buildBuilding("castle", p.startPos);
    p.buildBuilding("barracks", p.nearPos(2));
  });

  // ── RESPAWN ──────────────────────────────────────────────────────────────

  s.respawn({
    allowed:    true,
    delay:      10,
    startFresh: true,
    keepScore:  true,
  });

  // ── OBSERVERS ────────────────────────────────────────────────────────────

  s.observers({
    allowed:  true,
    fogOfWar: false,
    maxCount: 10,
  });

  // ── SPRITES ──────────────────────────────────────────────────────────────

  s.sprites({
    units: {
      knight: {
        file: "knight.png", frameW: 64, frameH: 64, scale: 1.0,
        animations: {
          idle:   { row: 0, frames: 4, fps: 6, loop: true },
          move:   { row: 1, frames: 6, fps: 10 },
          attack: { row: 2, frames: 6, fps: 10 },
          die:    { row: 3, frames: 4, fps: 8, loop: false },
        },
      },
      archer: {
        file: "archer.png", frameW: 64, frameH: 64, scale: 1.0,
        animations: {
          idle:   { row: 0, frames: 4, fps: 6, loop: true },
          move:   { row: 1, frames: 6, fps: 10 },
          attack: { row: 2, frames: 4, fps: 8 },
          die:    { row: 3, frames: 4, fps: 8, loop: false },
        },
      },
      mage: {
        file: "mage.png", frameW: 64, frameH: 64, scale: 1.0,
        animations: {
          idle:   { row: 0, frames: 6, fps: 6, loop: true },
          move:   { row: 1, frames: 6, fps: 10 },
          attack: { row: 2, frames: 8, fps: 12 },
          die:    { row: 3, frames: 4, fps: 8, loop: false },
        },
      },
      catapult: {
        file: "catapult.png", frameW: 96, frameH: 96, scale: 1.0,
        animations: {
          idle:   { row: 0, frames: 2, fps: 3, loop: true },
          move:   { row: 1, frames: 4, fps: 6 },
          attack: { row: 2, frames: 8, fps: 10 },
          die:    { row: 3, frames: 4, fps: 6, loop: false },
        },
      },
      dragon: {
        file: "dragon.png", frameW: 128, frameH: 128, scale: 1.5,
        animations: {
          idle:   { row: 0, frames: 6, fps: 8, loop: true },
          move:   { row: 1, frames: 8, fps: 12 },
          attack: { row: 2, frames: 8, fps: 10 },
          die:    { row: 3, frames: 6, fps: 8, loop: false },
        },
      },
      skeleton: {
        file: "skeleton.png", frameW: 32, frameH: 32, scale: 0.8,
        animations: {
          idle:   { row: 0, frames: 4, fps: 6, loop: true },
          move:   { row: 1, frames: 4, fps: 8 },
          attack: { row: 2, frames: 3, fps: 8 },
          die:    { row: 3, frames: 4, fps: 8, loop: false },
        },
      },
    },
    buildings: {
      castle: {
        file:    "castle.png",
        scale:   1.5,
        damaged: "castle_damaged.png",
        ruined:  "castle_ruined.png",
      },
      barracks: {
        file:    "barracks.png",
        scale:   1.2,
        damaged: "barracks_damaged.png",
      },
      tower: {
        file:    "tower.png",
        scale:   1.0,
        damaged: "tower_damaged.png",
        ruined:  "tower_ruined.png",
      },
      tavern: {
        file:  "tavern.png",
        scale: 1.0,
      },
      mine: {
        file:  "mine.png",
        scale: 1.0,
        frameW: 64, frameH: 64,
        animations: { idle: { row: 0, frames: 4, fps: 4 } },
      },
      academy: {
        file:  "academy.png",
        scale: 1.2,
      },
      wall: {
        file:    "wall.png",
        scale:   1.0,
        damaged: "wall_damaged.png",
        ruined:  "wall_ruined.png",
      },
      farm: {
        file:  "farm.png",
        scale: 1.0,
      },
    },
    biomes: {
      plains:   { file: "plains.png" },
      forest:   { file: "forest.png" },
      mountain: { file: "mountain.png" },
      water: {
        file: "water.png",
        frameW: 64, frameH: 64,
        animations: { idle: { row: 0, frames: 8, fps: 6 } },
      },
      lava: {
        file: "lava.png",
        frameW: 64, frameH: 64,
        animations: { idle: { row: 0, frames: 6, fps: 8 } },
      },
    },
    resources: {
      gold:  { icon: "gold_icon.png",  sprite: "gold_deposit.png" },
      stone: { icon: "stone_icon.png", sprite: "stone_deposit.png" },
      mana:  { icon: "mana_icon.png",  sprite: "mana_crystal.png" },
      food:  { icon: "food_icon.png",  sprite: "food_patch.png" },
    },
    effects: {
      fireball: {
        file: "fireball_fx.png", frameW: 64, frameH: 64,
        frames: 8, fps: 15, loop: false,
      },
      heal: {
        file: "heal_fx.png", frameW: 48, frameH: 48,
        frames: 6, fps: 10, loop: false,
      },
      charge: {
        file: "charge_fx.png", frameW: 64, frameH: 32,
        frames: 4, fps: 12, loop: false,
      },
      fire_overlay: {
        file: "fire_overlay_fx.png", frameW: 64, frameH: 64,
        frames: 8, fps: 10, loop: true,
      },
    },
  });

  // ── AUDIO ────────────────────────────────────────────────────────────────

  s.audio({
    music: [
      "medieval_ambient.ogg",
      "battle_drums.ogg",
      "kingdom_theme.ogg",
    ],
    sounds: {
      attack:    "sword_clash.ogg",
      build:     "hammer_stone.ogg",
      death:     "death_cry.ogg",
      levelup:   "fanfare.ogg",
      event:     "horn_blow.ogg",
      produce:   "forge_anvil.ogg",
      select:    "armor_clink.ogg",
      fireball:  "fire_whoosh.ogg",
      heal:      "magic_chime.ogg",
      charge:    "horse_gallop.ogg",
      volley:    "arrow_rain.ogg",
      dragon:    "dragon_roar.ogg",
    },
  });

  // ── UI THEME ─────────────────────────────────────────────────────────────

  s.uiTheme({
    font:           "MedievalSharp",
    primaryColor:   "#3e2723",
    secondaryColor: "#4e342e",
    accentColor:    "#ffab00",
    fogColor:       "#1a1a1a",
    fogOpacity:     0.75,
    fogEdge:        "soft",
    minimapBg:      "#2c1810",
  });

});
