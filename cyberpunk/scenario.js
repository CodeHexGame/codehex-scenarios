/**
 * Cyberpunk — Post-Apocalyptic Scenario for CodeHex
 *
 * A harsh sci-fi scenario with drones, combat robots, hackers, and rogue AIs.
 * Features logistics mode (units carry resources to base), siege mechanics,
 * radiation hazards, and EMP warfare. Victory by score (1000 points).
 *
 * Biomes:    wasteland, ruins, toxic_zone, data_stream, bunker
 * Resources: metal, energy, rare_earth, data
 * Units:     drone, combat_robot, hacker, colossus, rogue_ai (neutral), mutant (neutral)
 * Buildings: command_center, factory, generator, server_tower, shield_dome, radar, recycler
 */

scenario("cyberpunk", s => {

  // ── META ──────────────────────────────────────────────────────────────────

  s.name("Cyberpunk: Scorched Network");
  s.description("Post-apocalyptic warfare with robots, hackers, and rogue AI. First to 1000 points wins.");
  s.version("1.0.0");
  s.author("CodeHex Team");
  s.thumbnail("cyberpunk_thumbnail.png");

  // ── GLOBAL RULES ─────────────────────────────────────────────────────────

  s.rules({
    friendlyFire:       false,
    logisticsMode:      true,
    moraleSystem:       false,
    experienceSystem:   true,
    resourceCaps:       true,
    globalResourcePool: false,
    nightCycle:         false,
    weather:            false,
    siegeMode:          true,
  });

  // ── BIOMES ───────────────────────────────────────────────────────────────

  s.biome("wasteland", {
    color:        "#a0826d",
    moveCost:     1,
    defenseBonus: 0,
    attackBonus:  0,
    spawnWeight:  0.2,
  });

  s.biome("ruins", {
    color:        "#6d6d6d",
    moveCost:     2,
    defenseBonus: 15,
    attackBonus:  5,
    visionPenalty: 1,
    spawnWeight:  0.4,
  });

  s.biome("toxic_zone", {
    color:         "#7cb342",
    moveCost:      2,
    damagePerTurn: 5,
    defenseBonus:  0,
    spawnWeight:   0.6,
  });

  s.biome("data_stream", {
    color:        "#00bcd4",
    moveCost:     1,
    defenseBonus: 0,
    attackBonus:  0,
    harvestBonus: 25,
    visionBonus:  1,
    spawnWeight:  0.0,
  });

  s.biome("bunker", {
    color:        "#455a64",
    moveCost:     1,
    defenseBonus: 40,
    attackBonus:  0,
    visionPenalty: 2,
    spawnWeight:  0.0,
  });

  // ── RESOURCES ────────────────────────────────────────────────────────────

  s.resource("metal", {
    color:         "#b0bec5",
    rarity:        "common",
    maxDeposit:    200,
    regenRate:     0,
    harvestAmount: 12,
    decayRate:     0,
  });

  s.resource("energy", {
    color:         "#ffeb3b",
    rarity:        "common",
    maxDeposit:    150,
    regenRate:     2,
    harvestAmount: 10,
    decayRate:     1,
  });

  s.resource("rare_earth", {
    color:         "#e040fb",
    rarity:        "rare",
    maxDeposit:    60,
    regenRate:     0,
    harvestAmount: 3,
    decayRate:     0,
  });

  s.resource("data", {
    color:         "#00e5ff",
    rarity:        "uncommon",
    maxDeposit:    100,
    regenRate:     1,
    harvestAmount: 8,
    decayRate:     0,
  });

  s.resourceCap("metal",      800);
  s.resourceCap("energy",     500);
  s.resourceCap("rare_earth", 200);
  s.resourceCap("data",       400);

  // ── AURAS ────────────────────────────────────────────────────────────────

  s.aura("shield_aura", {
    effect:    { defense: 10 },
    stackable: false,
  });

  s.aura("network_boost", {
    effect:    { expMultiplier: 1.3, visionRange: 1 },
    stackable: false,
  });

  // ── STATUS EFFECTS ───────────────────────────────────────────────────────

  s.statusEffect("disabled", {
    duration:     3,
    blocksMove:   true,
    blocksAttack: true,
    color:        "#9e9e9e",
  });

  s.statusEffect("overloaded", {
    duration:      4,
    damagePerTurn: 6,
    damageType:    "energy",
    color:         "#ff9800",
  });

  s.statusEffect("irradiated", {
    duration:      6,
    damagePerTurn: 3,
    damageType:    "radiation",
    color:         "#76ff03",
  });

  // ── ABILITIES ────────────────────────────────────────────────────────────

  s.ability("emp", {
    cooldown:       4,
    range:          3,
    damage:         10,
    aoeRadius:      2,
    damageType:     "energy",
    effect:         "disabled",
    effectDuration: 3,
    targetType:     "any",
  });

  s.ability("overclock", {
    cooldown:   5,
    range:      0,
    damageMulti: 2.5,
    cost:       { energy: 20 },
    effect:     "overloaded",
    effectDuration: 2,
    targetType: "enemy",
  });

  s.ability("dataSteal", {
    cooldown:   3,
    range:      4,
    damage:     0,
    cost:       { energy: 10 },
    targetType: "building",
    effect:     "disabled",
    effectDuration: 5,
  });

  s.ability("plasmaBeam", {
    cooldown:    3,
    range:       4,
    damage:      45,
    damageType:  "energy",
    targetsCount: 1,
    targetType:  "enemy",
    cost:        { energy: 15 },
  });

  s.ability("selfDestruct", {
    cooldown:   0,
    range:      0,
    damage:     80,
    aoeRadius:  2,
    damageType: "physical",
    targetType: "any",
  });

  // ── UNITS ────────────────────────────────────────────────────────────────

  s.unit("drone", {
    hp:             30,
    attack:         6,
    defense:        2,
    range:          1,
    speed:          4,
    visionRange:    7,
    cost:           { metal: 20, energy: 10 },
    productionTime: 1,
    color:          "#4fc3f7",
    abilities:      [],
    carryCap:       20,
    levels: [
      { level: 2, expRequired: 40, bonuses: { speed: 1, visionRange: 1 } },
      { level: 3, expRequired: 100, bonuses: { speed: 1, visionRange: 2, hp: 10 } },
    ],
    expPerKill: 10,
  });

  s.unit("combat_robot", {
    hp:             90,
    attack:         16,
    defense:        12,
    range:          2,
    speed:          2,
    visionRange:    4,
    cost:           { metal: 60, energy: 30 },
    productionTime: 3,
    color:          "#f44336",
    abilities:      ["overclock"],
    carryCap:       10,
    levels: [
      { level: 2, expRequired: 80,  bonuses: { attack: 4, defense: 3, hp: 15 } },
      { level: 3, expRequired: 200, bonuses: { attack: 8, defense: 6, hp: 30, range: 1 } },
    ],
    expPerKill: 35,
  });

  s.unit("hacker", {
    hp:             35,
    attack:         5,
    defense:        3,
    range:          4,
    speed:          2,
    visionRange:    5,
    cost:           { metal: 40, data: 25 },
    productionTime: 4,
    color:          "#00e676",
    abilities:      ["emp", "dataSteal"],
    upkeep:         { energy: 1 },
    levels: [
      { level: 2, expRequired: 70,  bonuses: { range: 1, hp: 10 } },
      { level: 3, expRequired: 180, bonuses: { range: 1, visionRange: 2 } },
    ],
    expPerKill: 30,
  });

  s.unit("colossus", {
    hp:             200,
    attack:         40,
    defense:        18,
    range:          2,
    speed:          1,
    visionRange:    3,
    cost:           { metal: 150, energy: 80, rare_earth: 20 },
    productionTime: 8,
    color:          "#ff6f00",
    abilities:      ["plasmaBeam"],
    aoeRadius:      1,
    upkeep:         { energy: 3 },
    levels: [
      { level: 2, expRequired: 150, bonuses: { attack: 10, hp: 40 } },
      { level: 3, expRequired: 350, bonuses: { attack: 20, hp: 80, defense: 5 } },
    ],
    expPerKill: 80,
  });

  s.unit("rogue_ai", {
    hp:          120,
    attack:      22,
    defense:     10,
    range:       3,
    speed:       3,
    visionRange: 6,
    color:       "#d500f9",
    abilities:   ["emp"],
    neutral:     true,
    immunities:  ["energy"],
    expPerKill:  60,
  });

  s.unit("mutant", {
    hp:          45,
    attack:      10,
    defense:     4,
    range:       1,
    speed:       2,
    visionRange: 3,
    color:       "#aeea00",
    neutral:     true,
    spawnGroup:  4,
    immunities:  ["radiation"],
    expPerKill:  15,
  });

  // ── BUILDINGS ────────────────────────────────────────────────────────────

  s.building("command_center", {
    hp:         400,
    defense:    18,
    size:       1,
    cost:       { metal: 0 },
    produces:   ["drone", "combat_robot", "hacker", "colossus"],
    visionRange: 6,
    maxLevel:   3,
    levels: [
      { level: 2, upgradeCost: { metal: 200, energy: 100 }, bonuses: { hp: 100, defense: 5 } },
      { level: 3, upgradeCost: { metal: 400, energy: 200, rare_earth: 30 }, bonuses: { hp: 200, defense: 10, visionRange: 2 } },
    ],
    storage: { metal: 400, energy: 200, rare_earth: 50, data: 200 },
  });

  s.building("factory", {
    hp:                   250,
    defense:              12,
    cost:                 { metal: 100, energy: 50 },
    produces:             ["combat_robot", "colossus"],
    visionRange:          3,
    maxLevel:             3,
    levels: [
      { level: 2, upgradeCost: { metal: 80, energy: 40 },  bonuses: { hp: 60 } },
      { level: 3, upgradeCost: { metal: 160, energy: 80 }, bonuses: { hp: 120, productionSpeedBonus: 1 } },
    ],
    productionSpeedBonus: 1,
  });

  s.building("generator", {
    hp:             150,
    defense:        8,
    cost:           { metal: 60 },
    visionRange:    2,
    passiveHarvest: { energy: 6 },
    maxLevel:       2,
    levels: [
      { level: 2, upgradeCost: { metal: 80, rare_earth: 10 }, bonuses: { passiveHarvest: { energy: 4 } } },
    ],
  });

  s.building("server_tower", {
    hp:         200,
    defense:    10,
    cost:       { metal: 80, data: 30 },
    visionRange: 5,
    autoAttack: true,
    attack:     12,
    range:      4,
    aura:       "network_boost",
    auraRadius: 4,
  });

  s.building("shield_dome", {
    hp:         180,
    defense:    20,
    cost:       { metal: 100, energy: 60 },
    visionRange: 3,
    aura:       "shield_aura",
    auraRadius: 3,
    ownTeamPassable: true,
  });

  s.building("radar", {
    hp:          80,
    defense:     4,
    cost:        { metal: 50, energy: 30 },
    visionRange: 12,
  });

  s.building("recycler", {
    hp:             120,
    defense:        6,
    cost:           { metal: 40, energy: 20 },
    visionRange:    2,
    mustBePlacedOn: "ruins",
    passiveHarvest: { metal: 4 },
  });

  // ── OVERLAYS ─────────────────────────────────────────────────────────────

  s.overlay("radiation", {
    color:         "#76ff03",
    opacity:       0.5,
    damagePerTurn: 4,
    spreadChance:  0.08,
    duration:      12,
  });

  s.overlay("emp_field", {
    color:    "#00bcd4",
    opacity:  0.4,
    duration: 5,
    effect:   { blocksAttack: true },
  });

  // ── MAP GENERATION ───────────────────────────────────────────────────────

  s.mapgen(g => {
    g.biome("wasteland",   0.35);
    g.biome("ruins",       0.30);
    g.biome("toxic_zone",  0.15);
    g.biome("data_stream", 0.10);
    g.biome("bunker",      0.10);

    g.scatter("metal",      { biome: "ruins",       density: 0.08 });
    g.scatter("energy",     { biome: "wasteland",   density: 0.06 });
    g.scatter("rare_earth", { biome: "toxic_zone",  density: 0.04 });
    g.scatter("data",       { biome: "data_stream", density: 0.10 });

    g.clusters("ruins",      { minSize: 5, maxSize: 12, count: 7 });
    g.clusters("toxic_zone", { minSize: 3, maxSize: 6,  count: 4 });
    g.clusters("bunker",     { minSize: 1, maxSize: 3,  count: 5 });

    g.clearAroundStart(3);

    g.placeNeutralBuilding("recycler", { count: 3, biome: "ruins" });
  });

  // ── EVENTS ───────────────────────────────────────────────────────────────

  s.event("radioactive_fallout", {
    chance:     0.02,
    minStep:    10,
    maxPerGame: 6,
    message:    "Radioactive fallout detected! Radiation zones are expanding!",
    effect: e => {
      const cells = e.randomCells(5);
      cells.forEach(c => e.addOverlay(c, "radiation", { duration: 12 }));
    },
  });

  s.event("network_virus", {
    chance:     0.015,
    minStep:    20,
    maxPerGame: 4,
    message:    "A network virus is spreading! Some buildings go offline!",
    effect: e => {
      const units = e.allUnits();
      const buildings = units.filter(() => Math.random() < 0.3);
      buildings.forEach(u => e.applyStatus(u, "disabled"));
    },
  });

  s.event("emp_pulse", {
    chance:     0.01,
    minStep:    30,
    maxPerGame: 3,
    message:    "Massive EMP pulse detected! All units are temporarily disabled!",
    effect: e => {
      const units = e.allUnits();
      units.forEach(u => e.applyStatus(u, "disabled"));
    },
  });

  s.event("data_cache", {
    chance:     0.03,
    minStep:    8,
    maxPerGame: 8,
    message:    "Encrypted data cache discovered!",
    effect: e => {
      const cells = e.randomCells(3, { biome: "data_stream" });
      cells.forEach(c => e.addResource(c, "data", 40));
    },
  });

  s.event("rogue_uprising", {
    chance:     0.008,
    minStep:    40,
    maxPerGame: 3,
    message:    "Rogue AI units are emerging from the network! All players are targets!",
    effect: e => {
      e.spawnNeutralGroup("rogue_ai", 3);
    },
  });

  s.event("power_surge", {
    chance:     0.02,
    minStep:    15,
    maxPerGame: 4,
    message:    "Power surge detected! All generators produce double energy for 10 turns!",
    effect: e => {
      e.startGlobalEvent("generator_boost", { multiplier: 2, duration: 10 });
    },
  });

  s.event("meteor_strike", {
    chance:     0.01,
    minStep:    25,
    maxPerGame: 5,
    message:    "Meteor incoming! Impact imminent!",
    effect: e => {
      const cell = e.randomCell();
      e.addOverlay(cell, "radiation", { duration: 20 });
      e.broadcast("Meteor struck the surface! Radiation spreading from impact zone.");
    },
  });

  // ── VICTORY CONDITION ────────────────────────────────────────────────────

  s.victoryCondition("score", { target: 1000 });

  // ── START CONDITIONS ─────────────────────────────────────────────────────

  s.startCondition(p => {
    p.give("metal", 200);
    p.give("energy", 100);
    p.spawnUnit("drone", p.nearPos(1));
    p.spawnUnit("combat_robot", p.nearPos(1));
    p.buildBuilding("command_center", p.startPos);
  });

  // ── RESPAWN ──────────────────────────────────────────────────────────────

  s.respawn({
    allowed:    true,
    delay:      8,
    startFresh: true,
    keepScore:  true,
  });

  // ── OBSERVERS ────────────────────────────────────────────────────────────

  s.observers({
    allowed:  true,
    fogOfWar: true,
    maxCount: 15,
  });

  // ── SPRITES ──────────────────────────────────────────────────────────────

  s.sprites({
    units: {
      drone: {
        file: "drone.png", frameW: 32, frameH: 32, scale: 0.8,
        animations: {
          idle:   { row: 0, frames: 4, fps: 8, loop: true },
          move:   { row: 1, frames: 6, fps: 12 },
          attack: { row: 2, frames: 4, fps: 10 },
          die:    { row: 3, frames: 4, fps: 8, loop: false },
        },
      },
      combat_robot: {
        file: "combat_robot.png", frameW: 64, frameH: 64, scale: 1.0,
        animations: {
          idle:   { row: 0, frames: 4, fps: 6, loop: true },
          move:   { row: 1, frames: 6, fps: 10 },
          attack: { row: 2, frames: 6, fps: 10 },
          die:    { row: 3, frames: 6, fps: 8, loop: false },
        },
      },
      hacker: {
        file: "hacker.png", frameW: 48, frameH: 48, scale: 1.0,
        animations: {
          idle:   { row: 0, frames: 6, fps: 6, loop: true },
          move:   { row: 1, frames: 6, fps: 10 },
          attack: { row: 2, frames: 8, fps: 12 },
          die:    { row: 3, frames: 4, fps: 8, loop: false },
        },
      },
      colossus: {
        file: "colossus.png", frameW: 128, frameH: 128, scale: 1.5,
        animations: {
          idle:   { row: 0, frames: 4, fps: 4, loop: true },
          move:   { row: 1, frames: 6, fps: 6 },
          attack: { row: 2, frames: 8, fps: 10 },
          die:    { row: 3, frames: 8, fps: 8, loop: false },
        },
      },
      rogue_ai: {
        file: "rogue_ai.png", frameW: 64, frameH: 64, scale: 1.2,
        animations: {
          idle:   { row: 0, frames: 6, fps: 8, loop: true },
          move:   { row: 1, frames: 6, fps: 10 },
          attack: { row: 2, frames: 6, fps: 12 },
          die:    { row: 3, frames: 6, fps: 8, loop: false },
        },
      },
      mutant: {
        file: "mutant.png", frameW: 48, frameH: 48, scale: 1.0,
        animations: {
          idle:   { row: 0, frames: 4, fps: 6, loop: true },
          move:   { row: 1, frames: 4, fps: 8 },
          attack: { row: 2, frames: 4, fps: 8 },
          die:    { row: 3, frames: 4, fps: 8, loop: false },
        },
      },
    },
    buildings: {
      command_center: {
        file:    "command_center.png",
        scale:   1.5,
        damaged: "command_center_damaged.png",
        ruined:  "command_center_ruined.png",
      },
      factory: {
        file:    "factory.png",
        scale:   1.2,
        damaged: "factory_damaged.png",
        frameW:  96, frameH: 96,
        animations: { idle: { row: 0, frames: 4, fps: 4 } },
      },
      generator: {
        file:  "generator.png",
        scale: 1.0,
        frameW: 64, frameH: 64,
        animations: { idle: { row: 0, frames: 6, fps: 8 } },
      },
      server_tower: {
        file:    "server_tower.png",
        scale:   1.0,
        damaged: "server_tower_damaged.png",
        frameW:  64, frameH: 64,
        animations: { idle: { row: 0, frames: 8, fps: 6 } },
      },
      shield_dome: {
        file:  "shield_dome.png",
        scale: 1.3,
        frameW: 96, frameH: 96,
        animations: { idle: { row: 0, frames: 6, fps: 4 } },
      },
      radar: {
        file:  "radar.png",
        scale: 1.0,
        frameW: 64, frameH: 64,
        animations: { idle: { row: 0, frames: 8, fps: 6 } },
      },
      recycler: {
        file:  "recycler.png",
        scale: 1.0,
      },
    },
    biomes: {
      wasteland: { file: "wasteland.png" },
      ruins:     { file: "ruins.png" },
      toxic_zone: {
        file: "toxic_zone.png",
        frameW: 64, frameH: 64,
        animations: { idle: { row: 0, frames: 4, fps: 4 } },
      },
      data_stream: {
        file: "data_stream.png",
        frameW: 64, frameH: 64,
        animations: { idle: { row: 0, frames: 8, fps: 10 } },
      },
      bunker: { file: "bunker.png" },
    },
    resources: {
      metal:      { icon: "metal_icon.png",      sprite: "metal_deposit.png" },
      energy:     { icon: "energy_icon.png",      sprite: "energy_node.png" },
      rare_earth: { icon: "rare_earth_icon.png",  sprite: "rare_earth_deposit.png" },
      data:       { icon: "data_icon.png",        sprite: "data_cache.png" },
    },
    effects: {
      emp: {
        file: "emp_fx.png", frameW: 64, frameH: 64,
        frames: 8, fps: 12, loop: false,
      },
      plasma: {
        file: "plasma_fx.png", frameW: 48, frameH: 48,
        frames: 6, fps: 15, loop: false,
      },
      explosion: {
        file: "explosion_fx.png", frameW: 96, frameH: 96,
        frames: 10, fps: 15, loop: false,
      },
      radiation_overlay: {
        file: "radiation_fx.png", frameW: 64, frameH: 64,
        frames: 6, fps: 6, loop: true,
      },
    },
  });

  // ── AUDIO ────────────────────────────────────────────────────────────────

  s.audio({
    music: [
      "cyber_ambient.ogg",
      "neon_wasteland.ogg",
      "digital_warfare.ogg",
    ],
    sounds: {
      attack:       "laser_shot.ogg",
      build:        "weld_spark.ogg",
      death:        "robot_explode.ogg",
      levelup:      "system_upgrade.ogg",
      event:        "alarm_siren.ogg",
      produce:      "assembly_line.ogg",
      select:       "interface_click.ogg",
      emp:          "emp_pulse.ogg",
      plasma:       "plasma_fire.ogg",
      hack:         "data_breach.ogg",
      selfDestruct: "detonation.ogg",
    },
  });

  // ── UI THEME ─────────────────────────────────────────────────────────────

  s.uiTheme({
    font:           "Share Tech Mono",
    primaryColor:   "#0d1117",
    secondaryColor: "#161b22",
    accentColor:    "#00ffaa",
    fogColor:       "#0a0e12",
    fogOpacity:     0.80,
    fogEdge:        "hard",
    minimapBg:      "#080c10",
  });

});
