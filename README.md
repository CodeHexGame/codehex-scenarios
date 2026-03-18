# CodeHex Scenarios

Official scenario repository for the [CodeHex](https://github.com/CodeHexGame/codehex-server) strategy game.

A **scenario** is a single `scenario.js` file that declares all game content — biomes, resources, units, buildings, abilities, events, map generation, sprites, and audio — using a declarative DSL. No server logic, no imports, just data.

## Quick Start

### 1. Copy the template

```bash
cp -r template/ my_scenario/
```

### 2. Edit `my_scenario/scenario.js`

```js
scenario("my_scenario", s => {
  s.name("My Scenario");
  s.description("A short description");
  s.version("1.0.0");
  s.author("Your Name");

  s.biome("plains", { color: "#8db360", moveCost: 1 });
  // ... define resources, units, buildings, etc.
});
```

### 3. Copy to server

```bash
cp -r my_scenario/ path/to/codehex-server/scenarios/my_scenario/
```

### 4. Set in server config

In `codehex-server/config.json`:

```json
{
  "scenario": "my_scenario"
}
```

### 5. Start the server

```bash
cd codehex-server
npm start
```

## Repository Structure

```
codehex-scenarios/
├── README.md               ← You are here
├── template/
│   └── scenario.js         ← Fully commented template (start here)
├── castle/
│   ├── scenario.js         ← Medieval fantasy scenario
│   ├── sprites/            ← PNG sprite sheets
│   └── audio/              ← OGG music & sound effects
├── cyberpunk/
│   ├── scenario.js         ← Post-apocalyptic cyberpunk scenario
│   ├── sprites/
│   └── audio/
└── docs/
    ├── index.html          ← Documentation site (open in browser)
    └── pages/              ← Detailed guides per topic
```

## Official Scenarios

### Castle (Medieval Fantasy)

A classic medieval strategy experience with knights, archers, mages, and dragons. Features morale, experience systems, day/night cycles, and weather. Victory by domination (70% map control).

**Biomes:** plains, forest, mountain, water, lava
**Units:** knight, archer, mage, catapult, dragon (neutral), skeleton (neutral)
**Buildings:** castle, barracks, tower, tavern, mine, academy, wall, farm

### Cyberpunk (Post-Apocalyptic)

A harsh sci-fi scenario with drones, combat robots, hackers, and rogue AIs. Features logistics mode (units carry resources), siege mechanics, and radiation hazards. Victory by score (1000 points).

**Biomes:** wasteland, ruins, toxic_zone, data_stream, bunker
**Units:** drone, combat_robot, hacker, colossus, rogue_ai (neutral), mutant (neutral)
**Buildings:** command_center, factory, generator, server_tower, shield_dome, radar, recycler

## How the DSL Works

The server injects a global `scenario()` function into an isolated vm2 sandbox. Your scenario file calls it with a name and a builder function:

```js
scenario("my_scenario", s => {
  s.name("My Scenario");
  // all declarations go here
});
```

No `require`, `fs`, or `process` — only `s.*` builder functions are available.

## Documentation

Open `docs/index.html` in your browser for the full documentation site, including:

- **Quick Start** — get running in 5 minutes
- **DSL Reference** — every function, every parameter
- **Topic Guides** — biomes, units, buildings, abilities, events, map generation
- **Asset Guides** — how to add sprites and audio
- **Examples** — annotated walkthroughs of castle and cyberpunk

## Adding Assets

### Sprites

Place PNG sprite sheets in your scenario's `sprites/` folder. The game uses sprite sheets where rows are animations and columns are frames. If no sprites are provided, the game renders colored hexagons as fallback.

### Audio

Place OGG files in your scenario's `audio/` folder. Music files play in sequence; sound effects are triggered by game events.

## License

See [LICENSE](LICENSE) for details.
