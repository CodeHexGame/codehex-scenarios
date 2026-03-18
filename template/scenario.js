/**
 * CodeHex Scenario Template
 *
 * This is a fully commented template that demonstrates every DSL function
 * available for scenario authors. All fields are filled with example values
 * so this template runs as-is.
 *
 * Copy this file to your own scenario folder and modify it:
 *   cp -r template/ my_scenario/
 *
 * DSL reference: see docs/pages/dsl-reference.html
 */

scenario("template", s => {

  // ══════════════════════════════════════════════════════════════════════════
  // META
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.name(string)
   *
   * Display name shown in the game lobby and server logs.
   * Can contain spaces and special characters.
   */
  s.name("Template Scenario");

  /**
   * s.description(string)
   *
   * Short description shown in the scenario selection screen.
   * Keep it under 200 characters for best display.
   */
  s.description("A starter template demonstrating all DSL features.");

  /**
   * s.version(string)
   *
   * Semantic version string. The server logs this on load.
   * Use "major.minor.patch" format.
   */
  s.version("1.0.0");

  /**
   * s.author(string)
   *
   * Author name displayed in the lobby.
   */
  s.author("CodeHex Team");

  /**
   * s.thumbnail(filename)
   *
   * PNG file from sprites/ folder used as the scenario thumbnail
   * in the lobby. Recommended size: 256x256.
   * If omitted, no thumbnail is shown.
   */
  s.thumbnail("thumbnail.png");

  // ══════════════════════════════════════════════════════════════════════════
  // GLOBAL RULES
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.rules(options)
   *
   * Toggles global game mechanics on or off.
   * All options default to false if not specified.
   *
   * @param {object} options
   * @param {bool} options.friendlyFire       - Units can damage allied units (default: false)
   * @param {bool} options.logisticsMode      - Units carry resources to storage buildings (default: false)
   * @param {bool} options.moraleSystem       - Morale affects attack power (default: false)
   * @param {bool} options.experienceSystem   - Units gain XP and level up (default: false)
   * @param {bool} options.resourceCaps       - Players have max resource limits (default: false)
   * @param {bool} options.globalResourcePool - Team shares a single resource pool (default: false)
   * @param {bool} options.nightCycle         - Day/night cycle; night reduces visionRange (default: false)
   * @param {bool} options.weather            - Weather events affect movement (default: false)
   * @param {bool} options.siegeMode          - Buildings can be besieged (default: false)
   */
  s.rules({
    friendlyFire:       false,
    logisticsMode:      false,
    moraleSystem:       true,
    experienceSystem:   true,
    resourceCaps:       true,
    globalResourcePool: false,
    nightCycle:         false,
    weather:            false,
    siegeMode:          false,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // BIOMES
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.biome(name, options)
   *
   * Defines a terrain type that tiles can have.
   * Biomes affect movement cost, combat bonuses, and resource placement.
   *
   * @param {string} name                    - Unique identifier used in mapgen, allowedUnits, mustBePlacedOn
   * @param {object} options
   * @param {string} options.color           - Hex color for fallback rendering when no sprite (required)
   * @param {number} options.moveCost        - Movement points to enter this tile (default: 1)
   * @param {number} options.defenseBonus    - % defense bonus for units on this tile (default: 0)
   * @param {number} options.attackBonus     - % attack bonus when attacking FROM this tile (default: 0)
   * @param {number} options.harvestBonus    - % bonus to resource harvesting on this tile (default: 0)
   * @param {number} options.visionBonus     - Extra vision range on this tile (default: 0)
   * @param {number} options.visionPenalty   - Reduced vision range on this tile (default: 0)
   * @param {number} options.damagePerTurn   - HP damage to any unit on this tile each turn (default: 0)
   * @param {bool}   options.impassable      - Tile cannot be entered at all (default: false)
   * @param {string[]} options.allowedUnits  - Only these unit types can enter (default: all)
   * @param {number} options.spawnWeight     - Weight for neutral unit spawning, 0.0–1.0 (default: 0)
   *
   * Tips:
   * - moveCost 1 = normal, 2 = slow, 3 = very slow
   * - defenseBonus 10–30 is typical for defensive terrain
   * - Use impassable for water/walls that block all movement
   * - allowedUnits lets you create terrain only certain units can cross
   *
   * Example:
   *   s.biome("swamp", { color: "#4a6741", moveCost: 3, defenseBonus: 10 });
   */
  s.biome("plains", {
    color:        "#8db360",
    moveCost:     1,
    defenseBonus: 0,
    attackBonus:  0,
    harvestBonus: 0,
    spawnWeight:  0.3,
  });

  s.biome("forest", {
    color:        "#2d5a27",
    moveCost:     2,
    defenseBonus: 20,
    attackBonus:  0,
    visionPenalty: 1,
    spawnWeight:  0.5,
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

  // ══════════════════════════════════════════════════════════════════════════
  // RESOURCES
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.resource(name, options)
   *
   * Defines a resource type that can be harvested, spent, and stored.
   * Resources appear as deposits on the map and in player inventories.
   *
   * @param {string} name                    - Unique identifier used in unit.cost, building.cost, etc.
   * @param {object} options
   * @param {string} options.color           - Hex color for UI display (required)
   * @param {string} options.rarity          - "common" | "uncommon" | "rare" — affects deposit frequency
   * @param {number} options.maxDeposit      - Max amount in a single map deposit (default: 100)
   * @param {number} options.regenRate       - Amount regenerated per turn in a deposit (default: 0, no regen)
   * @param {number} options.harvestAmount   - Amount gathered per harvest action (default: 10)
   * @param {number} options.decayRate       - Amount lost from player storage per turn (default: 0)
   *
   * Example:
   *   s.resource("crystal", { color: "#e040fb", rarity: "rare", maxDeposit: 30 });
   */
  s.resource("gold", {
    color:         "#ffd700",
    rarity:        "common",
    maxDeposit:    200,
    regenRate:     0,
    harvestAmount: 15,
    decayRate:     0,
  });

  s.resource("wood", {
    color:         "#8b4513",
    rarity:        "common",
    maxDeposit:    150,
    regenRate:     2,
    harvestAmount: 10,
    decayRate:     0,
  });

  s.resource("stone", {
    color:         "#808080",
    rarity:        "uncommon",
    maxDeposit:    100,
    regenRate:     0,
    harvestAmount: 8,
    decayRate:     0,
  });

  /**
   * s.resourceCap(name, amount)
   *
   * Sets the maximum amount of a resource a player can hold.
   * Only applies when rules.resourceCaps is true.
   *
   * @param {string} name   - Resource name (must match a defined resource)
   * @param {number} amount - Maximum amount
   */
  s.resourceCap("gold", 500);
  s.resourceCap("wood", 300);
  s.resourceCap("stone", 200);

  // ══════════════════════════════════════════════════════════════════════════
  // ABILITIES
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.ability(name, options)
   *
   * Defines a special ability that units can use.
   * Abilities are referenced by name in unit.abilities arrays.
   *
   * @param {string} name                     - Unique identifier referenced in unit.abilities
   * @param {object} options
   * @param {number} options.cooldown         - Turns between uses (default: 1)
   * @param {number} options.range            - Max distance to target in tiles (default: 1)
   * @param {number} options.damage           - Flat damage dealt (default: 0)
   * @param {number} options.damageMulti      - Multiplier to unit's base attack (default: 1)
   * @param {number} options.aoeRadius        - Area-of-effect radius in tiles (default: 0, single target)
   * @param {object} options.cost             - Resource cost to use { resourceName: amount } (default: {})
   * @param {string} options.damageType       - Damage type: "physical" | "fire" | "poison" | etc. (default: "physical")
   * @param {string} options.effect           - Status effect to apply on hit (default: none)
   * @param {number} options.effectDuration   - Duration of applied status effect in turns (default: 0)
   * @param {number} options.targetsCount     - Number of targets hit (default: 1)
   * @param {string} options.targetType       - Valid targets: "enemy" | "ally" | "building" | "any" (default: "enemy")
   * @param {number} options.healAmount       - HP healed on target (default: 0)
   *
   * Example:
   *   s.ability("charge", { cooldown: 3, damageMulti: 2.0, range: 2 });
   */
  s.ability("slash", {
    cooldown:    1,
    range:       1,
    damageMulti: 1.5,
    damageType:  "physical",
    targetType:  "enemy",
  });

  s.ability("heal", {
    cooldown:   3,
    range:      2,
    healAmount: 20,
    targetType: "ally",
  });

  s.ability("fireball", {
    cooldown:   4,
    range:      3,
    damage:     30,
    aoeRadius:  1,
    damageType: "fire",
    cost:       { gold: 10 },
    targetType: "enemy",
  });

  // ══════════════════════════════════════════════════════════════════════════
  // AURAS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.aura(name, options)
   *
   * Defines a passive effect that radiates from buildings or units.
   * Referenced by building.aura.
   *
   * @param {string} name                - Unique identifier
   * @param {object} options
   * @param {object} options.effect      - Key-value pairs of stat modifications
   *                                       e.g. { morale: 5, expMultiplier: 1.5, attack: 3 }
   * @param {bool}   options.stackable   - Whether multiple auras of same type stack (default: false)
   *
   * Example:
   *   s.aura("war_drums", { effect: { morale: 10, attack: 2 }, stackable: false });
   */
  s.aura("inspiration", {
    effect:    { morale: 5, attack: 2 },
    stackable: false,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // STATUS EFFECTS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.statusEffect(name, options)
   *
   * Defines a temporary condition applied to units.
   * Referenced by ability.effect and event effects.
   *
   * @param {string} name                      - Unique identifier
   * @param {object} options
   * @param {number} options.duration          - Turns the effect lasts (-1 = permanent) (default: 3)
   * @param {bool}   options.blocksMove        - Unit cannot move (default: false)
   * @param {bool}   options.blocksAttack      - Unit cannot attack (default: false)
   * @param {number} options.damagePerTurn     - HP damage each turn (default: 0)
   * @param {string} options.damageType        - Type of damage dealt (default: "physical")
   * @param {string} options.color             - Hex color for effect icon in client UI (required)
   *
   * Example:
   *   s.statusEffect("frozen", { duration: 2, blocksMove: true, color: "#00bcd4" });
   */
  s.statusEffect("burning", {
    duration:      3,
    damagePerTurn: 5,
    damageType:    "fire",
    color:         "#ff5722",
  });

  s.statusEffect("stunned", {
    duration:     1,
    blocksMove:   true,
    blocksAttack: true,
    color:        "#ffeb3b",
  });

  // ══════════════════════════════════════════════════════════════════════════
  // UNITS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.unit(name, options)
   *
   * Defines a unit type that can be produced by buildings or spawned by events.
   *
   * @param {string} name                      - Unique identifier
   * @param {object} options
   * @param {number} options.hp                - Maximum hit points (required)
   * @param {number} options.attack            - Base attack damage (required)
   * @param {number} options.defense           - Base defense value (required)
   * @param {number} options.range             - Attack range in tiles (default: 1 = melee)
   * @param {number} options.speed             - Tiles moved per turn (default: 1)
   * @param {number} options.visionRange       - Vision radius in tiles (default: 3)
   * @param {object} options.cost              - Resources to produce { resourceName: amount } (required for player units)
   * @param {number} options.productionTime    - Turns to produce (default: 1)
   * @param {string} options.color             - Hex color for fallback rendering (required)
   * @param {string[]} options.abilities       - List of ability IDs this unit can use (default: [])
   * @param {number} options.carryCap          - Inventory capacity for logistics mode (default: 0)
   * @param {object} options.upkeep            - Resources consumed per turn { resource: amount } (default: {})
   * @param {bool}   options.neutral           - Not owned by any player (default: false)
   * @param {number} options.spawnGroup        - Spawns in groups of N (default: 1)
   * @param {number} options.aoeRadius         - Area-of-effect attack radius (default: 0)
   * @param {string[]} options.immunities      - Damage types this unit is immune to (default: [])
   * @param {array}  options.levels            - Level progression for experienceSystem:
   *                                             [{ level: 2, expRequired: 100, bonuses: { attack: 5, hp: 10 } }]
   * @param {number} options.expPerKill        - XP awarded for killing this unit (default: 0)
   *
   * Tips:
   * - Melee units: range 1, speed 2-3
   * - Ranged units: range 2-4, speed 1-2
   * - Tank units: high hp/defense, low speed
   * - Neutral units: set neutral: true, no cost needed
   *
   * Example:
   *   s.unit("scout", {
   *     hp: 30, attack: 5, defense: 2, range: 1, speed: 4,
   *     visionRange: 5, cost: { gold: 20 }, color: "#4caf50",
   *   });
   */
  s.unit("warrior", {
    hp:             60,
    attack:         12,
    defense:        8,
    range:          1,
    speed:          2,
    visionRange:    3,
    cost:           { gold: 30 },
    productionTime: 2,
    color:          "#f44336",
    abilities:      ["slash"],
    carryCap:       0,
    levels: [
      { level: 2, expRequired: 50,  bonuses: { attack: 3, hp: 10 } },
      { level: 3, expRequired: 150, bonuses: { attack: 5, hp: 20, defense: 2 } },
    ],
    expPerKill: 25,
  });

  s.unit("healer", {
    hp:             35,
    attack:         4,
    defense:        3,
    range:          1,
    speed:          2,
    visionRange:    3,
    cost:           { gold: 40, wood: 20 },
    productionTime: 3,
    color:          "#4caf50",
    abilities:      ["heal"],
    expPerKill:     20,
  });

  s.unit("fire_mage", {
    hp:             30,
    attack:         8,
    defense:        2,
    range:          3,
    speed:          1,
    visionRange:    4,
    cost:           { gold: 60, stone: 20 },
    productionTime: 4,
    color:          "#ff9800",
    abilities:      ["fireball"],
    expPerKill:     35,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // BUILDINGS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.building(name, options)
   *
   * Defines a building type that can be constructed by players or placed at start.
   *
   * @param {string} name                              - Unique identifier
   * @param {object} options
   * @param {number} options.hp                        - Maximum hit points (required)
   * @param {number} options.defense                   - Base defense value (required)
   * @param {number} options.size                      - Tiles occupied, 1 = single hex (default: 1)
   * @param {object} options.cost                      - Build cost { resource: amount } (required)
   * @param {string[]} options.produces                - Unit types this building can produce (default: [])
   * @param {number} options.visionRange               - Vision radius (default: 3)
   * @param {string} options.aura                      - Aura ID applied in radius (default: none)
   * @param {number} options.auraRadius                - Radius of the aura effect (default: 0)
   * @param {object} options.auraEffect                - Inline aura effect (alternative to named aura)
   * @param {object} options.storage                   - Resource storage caps { resource: maxAmount } (default: {})
   * @param {number} options.maxLevel                  - Maximum upgrade level (default: 1)
   * @param {array}  options.levels                    - Level progression:
   *                                                     [{ level: 2, upgradeCost: { gold: 50 }, bonuses: { hp: 50 } }]
   * @param {object} options.passiveHarvest            - Resources gained per turn { resource: amount } (default: {})
   * @param {string} options.mustBePlacedOn            - Required biome for placement (default: any)
   * @param {bool}   options.passable                  - Units can move through (default: false)
   * @param {bool}   options.ownTeamPassable           - Allied units can move through (default: false)
   * @param {bool}   options.autoAttack                - Attacks enemies in range automatically (default: false)
   * @param {number} options.attack                    - Damage for autoAttack (default: 0)
   * @param {number} options.range                     - Range for autoAttack (default: 0)
   * @param {number} options.productionSpeedBonus      - Turns subtracted from unit production time (default: 0)
   *
   * Example:
   *   s.building("fort", {
   *     hp: 200, defense: 15, cost: { gold: 100, stone: 50 },
   *     produces: ["warrior"], autoAttack: true, attack: 10, range: 2,
   *   });
   */
  s.building("base", {
    hp:         300,
    defense:    15,
    size:       1,
    cost:       { gold: 0 },
    produces:   ["warrior", "healer", "fire_mage"],
    visionRange: 5,
    maxLevel:   3,
    levels: [
      { level: 2, upgradeCost: { gold: 100, stone: 50 }, bonuses: { hp: 100 } },
      { level: 3, upgradeCost: { gold: 200, stone: 100 }, bonuses: { hp: 200, defense: 5 } },
    ],
  });

  s.building("watchtower", {
    hp:          80,
    defense:     5,
    cost:        { gold: 40, wood: 30 },
    visionRange: 7,
    autoAttack:  true,
    attack:      8,
    range:       3,
  });

  s.building("shrine", {
    hp:         60,
    defense:    3,
    cost:       { gold: 50, stone: 30 },
    aura:       "inspiration",
    auraRadius: 3,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // OVERLAYS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.overlay(name, options)
   *
   * Defines a visual and gameplay effect placed on map tiles.
   * Overlays can spread, deal damage, and apply buffs/debuffs.
   *
   * @param {string} name                      - Unique identifier
   * @param {object} options
   * @param {string} options.color             - Hex color for rendering (required)
   * @param {number} options.opacity           - Render opacity 0.0–1.0 (default: 0.5)
   * @param {number} options.damagePerTurn     - HP damage to units on this tile (default: 0)
   * @param {number} options.spreadChance      - Chance to spread to adjacent tiles 0.0–1.0 (default: 0)
   * @param {number} options.duration          - Turns before disappearing, -1 = infinite (default: -1)
   * @param {object} options.effect            - Stat effects on units standing here
   *                                             e.g. { healPerTurn: 5, moraleBonus: 3 }
   *
   * Example:
   *   s.overlay("poison_cloud", {
   *     color: "#9c27b0", opacity: 0.4, damagePerTurn: 3, spreadChance: 0.1, duration: 8,
   *   });
   */
  s.overlay("fire", {
    color:        "#ff5722",
    opacity:      0.6,
    damagePerTurn: 8,
    spreadChance: 0.15,
    duration:     5,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // MAP GENERATION
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.mapgen(callback)
   *
   * Configures procedural map generation. The callback receives a generator
   * object with methods to control biome distribution, resource placement,
   * rivers, and starting areas.
   *
   * Available methods:
   *
   *   g.biome(name, weight)
   *     Set the weight of a biome in random generation.
   *     All weights should sum to 1.0.
   *     @param {string} name   - Biome name (must be defined via s.biome)
   *     @param {number} weight - Probability weight (0.0–1.0)
   *
   *   g.scatter(resource, options)
   *     Place resource deposits randomly across the map.
   *     @param {string} resource     - Resource name
   *     @param {object} options
   *     @param {string|null} options.biome   - Limit to this biome (null = any)
   *     @param {number} options.density      - 0.0–1.0, how densely to scatter
   *
   *   g.clusters(biome, options)
   *     Create clusters (groups) of a biome type.
   *     @param {string} biome           - Biome to cluster
   *     @param {object} options
   *     @param {number} options.minSize - Min tiles per cluster
   *     @param {number} options.maxSize - Max tiles per cluster
   *     @param {number} options.count   - Number of clusters
   *
   *   g.rivers(options)
   *     Generate rivers across the map.
   *     @param {object} options
   *     @param {number} options.count     - Number of rivers
   *     @param {number} options.minLength - Min river length in tiles
   *     @param {number} options.maxLength - Max river length in tiles
   *
   *   g.clearAroundStart(radius)
   *     Clear resources and obstacles near each player's start position.
   *     Ensures fair starts. Recommended radius: 2–4.
   *     @param {number} radius - Tiles to clear around start
   *
   *   g.placeNeutralBuilding(type, options)
   *     Place neutral buildings on the map.
   *     @param {string} type           - Building name
   *     @param {object} options
   *     @param {number} options.count  - How many to place
   *     @param {string} options.biome  - Limit to this biome (optional)
   *
   * Example:
   *   s.mapgen(g => {
   *     g.biome("plains", 0.5);
   *     g.biome("forest", 0.3);
   *     g.biome("mountain", 0.2);
   *     g.scatter("gold", { density: 0.05 });
   *     g.clearAroundStart(3);
   *   });
   */
  s.mapgen(g => {
    g.biome("plains",   0.50);
    g.biome("forest",   0.30);
    g.biome("mountain", 0.10);
    g.biome("water",    0.10);

    g.scatter("gold",  { biome: null,       density: 0.05 });
    g.scatter("wood",  { biome: "forest",   density: 0.10 });
    g.scatter("stone", { biome: "mountain", density: 0.08 });

    g.clusters("forest", { minSize: 3, maxSize: 8, count: 5 });
    g.clusters("mountain", { minSize: 2, maxSize: 4, count: 3 });

    g.rivers({ count: 1, minLength: 5, maxLength: 12 });

    g.clearAroundStart(3);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // EVENTS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.event(name, options)
   *
   * Defines a random event that can trigger during gameplay.
   * Events add unpredictability and force players to adapt.
   *
   * @param {string} name                - Unique identifier
   * @param {object} options
   * @param {number} options.chance      - Probability of firing each turn, 0.0–1.0 (required)
   * @param {number} options.minStep     - Earliest turn this event can fire (default: 0)
   * @param {number} options.maxPerGame  - Max times this event fires per game (default: unlimited)
   * @param {string} options.message     - Text broadcast to all players when fired
   * @param {function} options.effect    - Callback receiving an event helper object:
   *
   *   e.spawnNeutral(type, cell)           - Spawn a neutral unit at a cell
   *   e.spawnNeutralGroup(type, count, cell?) - Spawn a group (cell optional = random)
   *   e.randomCell({ biome? })             - Get a random cell, optionally in a specific biome
   *   e.randomCells(count, { biome? })     - Get multiple random cells
   *   e.addResource(cell, type, amount)    - Add resource deposit to a cell
   *   e.addOverlay(cell, overlayName, { duration? }) - Apply overlay to a cell
   *   e.allUnits()                         - Get all units on the map
   *   e.allCells({ biome? })               - Get all cells, optionally filtered by biome
   *   e.applyStatus(unit, effectName)      - Apply status effect to a unit
   *   e.startGlobalEvent(name, opts)       - Start a named global event
   *   e.broadcast(message)                 - Send a message to all players
   *   e.giveAllPlayers(resource, amount)   - Give resources to every player
   *
   * Example:
   *   s.event("gold_rush", {
   *     chance: 0.03, minStep: 10, maxPerGame: 3,
   *     message: "Gold deposits discovered!",
   *     effect: e => {
   *       const cells = e.randomCells(5, { biome: "mountain" });
   *       cells.forEach(c => e.addResource(c, "gold", 50));
   *     },
   *   });
   */
  s.event("wildfire", {
    chance:     0.02,
    minStep:    15,
    maxPerGame: 4,
    message:    "A wildfire breaks out in the forest!",
    effect: e => {
      const cells = e.randomCells(3, { biome: "forest" });
      cells.forEach(c => e.addOverlay(c, "fire", { duration: 5 }));
    },
  });

  s.event("gold_vein", {
    chance:     0.04,
    minStep:    5,
    maxPerGame: 6,
    message:    "A rich gold vein has been discovered!",
    effect: e => {
      const cell = e.randomCell({ biome: "mountain" });
      e.addResource(cell, "gold", 80);
    },
  });

  // ══════════════════════════════════════════════════════════════════════════
  // VICTORY CONDITION
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.victoryCondition(type, options?)
   *
   * Sets how the game is won.
   *
   * Types:
   *   "ffa"         - Last player standing (free-for-all). No options.
   *   "score"       - First player to reach target score wins.
   *                   Options: { target: number }
   *   "domination"  - Control a percentage of the map.
   *                   Options: { percent: number }
   *   "endless"     - No victory condition; game runs until players quit.
   *
   * Example:
   *   s.victoryCondition("domination", { percent: 75 });
   */
  s.victoryCondition("ffa");

  // ══════════════════════════════════════════════════════════════════════════
  // START CONDITIONS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.startCondition(callback)
   *
   * Defines what each player starts with. The callback receives a player
   * helper with methods to give resources, spawn units, and build buildings.
   *
   * Available methods:
   *   p.give(resource, amount)                         - Give starting resources
   *   p.spawnUnit(type, position, { scriptName? })     - Spawn a unit at position
   *   p.buildBuilding(type, position)                  - Place a building at position
   *   p.nearPos(distance)                              - Random cell near start position
   *
   * p.startPos is the player's starting cell.
   *
   * Example:
   *   s.startCondition(p => {
   *     p.give("gold", 100);
   *     p.spawnUnit("warrior", p.startPos);
   *     p.buildBuilding("base", p.startPos);
   *   });
   */
  s.startCondition(p => {
    p.give("gold", 100);
    p.give("wood", 50);
    p.give("stone", 30);
    p.spawnUnit("warrior", p.startPos);
    p.buildBuilding("base", p.startPos);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // RESPAWN
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.respawn(options)
   *
   * Controls what happens when a player loses all units and buildings.
   *
   * @param {object} options
   * @param {bool}   options.allowed     - Players can respawn (default: false)
   * @param {number} options.delay       - Turns before respawn (default: 0)
   * @param {bool}   options.startFresh  - Reset to startCondition (default: false)
   * @param {bool}   options.keepScore   - Keep accumulated score (default: true)
   *
   * Example:
   *   s.respawn({ allowed: true, delay: 5, startFresh: true, keepScore: true });
   */
  s.respawn({
    allowed:    true,
    delay:      5,
    startFresh: true,
    keepScore:  true,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // OBSERVERS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.observers(options)
   *
   * Controls spectator mode settings.
   *
   * @param {object} options
   * @param {bool}   options.allowed   - Observers can join (default: true)
   * @param {bool}   options.fogOfWar  - Observers see fog of war (default: false)
   * @param {number} options.maxCount  - Maximum observers allowed (default: 10)
   *
   * Example:
   *   s.observers({ allowed: true, fogOfWar: false, maxCount: 20 });
   */
  s.observers({
    allowed:  true,
    fogOfWar: false,
    maxCount: 10,
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SPRITES
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.sprites(config)
   *
   * Declares all sprite sheets and animations for visual rendering.
   * Files are loaded from the scenario's sprites/ folder.
   * If sprites are not provided, the game uses colored hexagons as fallback.
   *
   * Structure:
   *   units:     { unitName:     { file, frameW, frameH, scale?, animations } }
   *   buildings: { buildingName: { file, scale?, damaged?, ruined?, frameW?, frameH?, animations? } }
   *   biomes:    { biomeName:    { file, frameW?, frameH?, animations? } }
   *   resources: { resourceName: { icon, sprite } }
   *   effects:   { effectName:   { file, frameW, frameH, frames, fps, loop } }
   *
   * Animation format:
   *   { row: number, frames: number, fps: number, loop?: bool }
   *   - row: 0-indexed row in the sprite sheet
   *   - frames: number of frames (columns) in that row
   *   - fps: playback speed
   *   - loop: whether to loop (default: true, except "die")
   *
   * Example:
   *   s.sprites({
   *     units: {
   *       warrior: {
   *         file: "warrior.png", frameW: 32, frameH: 32,
   *         animations: {
   *           idle:   { row: 0, frames: 4, fps: 6, loop: true },
   *           move:   { row: 1, frames: 6, fps: 10 },
   *           attack: { row: 2, frames: 4, fps: 8 },
   *           die:    { row: 3, frames: 4, fps: 8, loop: false },
   *         },
   *       },
   *     },
   *   });
   */
  s.sprites({
    units: {
      warrior: {
        file: "warrior.png", frameW: 32, frameH: 32,
        animations: {
          idle:   { row: 0, frames: 4, fps: 6, loop: true },
          move:   { row: 1, frames: 6, fps: 10 },
          attack: { row: 2, frames: 4, fps: 8 },
          die:    { row: 3, frames: 4, fps: 8, loop: false },
        },
      },
      healer: {
        file: "healer.png", frameW: 32, frameH: 32,
        animations: {
          idle:   { row: 0, frames: 4, fps: 6, loop: true },
          move:   { row: 1, frames: 6, fps: 10 },
          attack: { row: 2, frames: 4, fps: 8 },
          die:    { row: 3, frames: 4, fps: 8, loop: false },
        },
      },
      fire_mage: {
        file: "fire_mage.png", frameW: 32, frameH: 32,
        animations: {
          idle:   { row: 0, frames: 4, fps: 6, loop: true },
          move:   { row: 1, frames: 6, fps: 10 },
          attack: { row: 2, frames: 6, fps: 10 },
          die:    { row: 3, frames: 4, fps: 8, loop: false },
        },
      },
    },
    buildings: {
      base: {
        file:    "base.png",
        scale:   1.0,
        damaged: "base_damaged.png",
        ruined:  "base_ruined.png",
      },
      watchtower: {
        file:    "watchtower.png",
        scale:   1.0,
        damaged: "watchtower_damaged.png",
      },
      shrine: {
        file:  "shrine.png",
        scale: 1.0,
      },
    },
    biomes: {
      plains:   { file: "plains.png" },
      forest:   { file: "forest.png" },
      mountain: { file: "mountain.png" },
      water:    { file: "water.png" },
    },
    resources: {
      gold:  { icon: "gold_icon.png",  sprite: "gold_deposit.png" },
      wood:  { icon: "wood_icon.png",  sprite: "wood_deposit.png" },
      stone: { icon: "stone_icon.png", sprite: "stone_deposit.png" },
    },
    effects: {
      fire: {
        file: "fire_effect.png", frameW: 32, frameH: 32,
        frames: 6, fps: 10, loop: true,
      },
    },
  });

  // ══════════════════════════════════════════════════════════════════════════
  // AUDIO
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.audio(config)
   *
   * Declares music and sound effect files.
   * Files are loaded from the scenario's audio/ folder.
   * Format: OGG (best browser compatibility).
   *
   * @param {object}   config
   * @param {string[]} config.music   - OGG files played as background music (cycled in order)
   * @param {object}   config.sounds  - Named sound effects triggered by game events
   *
   * Standard sound names:
   *   attack, build, death, levelup, event, produce, select
   * You can add any custom names; the server will play them via event scripts.
   *
   * Example:
   *   s.audio({
   *     music: ["ambient.ogg", "battle.ogg"],
   *     sounds: { attack: "sword.ogg", death: "death.ogg" },
   *   });
   */
  s.audio({
    music: ["theme.ogg"],
    sounds: {
      attack:  "attack.ogg",
      build:   "build.ogg",
      death:   "death.ogg",
      levelup: "levelup.ogg",
      event:   "event.ogg",
      produce: "produce.ogg",
      select:  "select.ogg",
    },
  });

  // ══════════════════════════════════════════════════════════════════════════
  // UI THEME
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * s.uiTheme(options)
   *
   * Customizes the client UI appearance for this scenario.
   * Colors are applied as CSS custom properties.
   *
   * @param {object} options
   * @param {string} options.font           - Google Font name or file from fonts/ (default: "monospace")
   * @param {string} options.primaryColor   - Main UI color, hex (default: "#1a1a2e")
   * @param {string} options.secondaryColor - Secondary UI color, hex (default: "#16213e")
   * @param {string} options.accentColor    - Accent/highlight color, hex (default: "#e94560")
   * @param {string} options.fogColor       - Fog-of-war color, hex (default: "#000000")
   * @param {number} options.fogOpacity     - Fog-of-war opacity 0.0–1.0 (default: 0.7)
   * @param {string} options.fogEdge        - Fog edge style: "soft" | "hard" (default: "soft")
   * @param {string} options.minimapBg      - Minimap background color, hex (default: "#0a0a0a")
   *
   * Example:
   *   s.uiTheme({
   *     font: "Press Start 2P",
   *     primaryColor: "#2d1b69",
   *     accentColor: "#ff6b6b",
   *   });
   */
  s.uiTheme({
    font:           "monospace",
    primaryColor:   "#1a1a2e",
    secondaryColor: "#16213e",
    accentColor:    "#e94560",
    fogColor:       "#000000",
    fogOpacity:     0.7,
    fogEdge:        "soft",
    minimapBg:      "#0a0a0a",
  });

});
