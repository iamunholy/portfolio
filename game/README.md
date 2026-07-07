# Game directory

This folder contains a minimal Phaser 3 demo to serve as the basis for a web-based 2D Pokémon-style game.

How to run

1. Start the local dev server from the repository root:

```bash
npm run dev
```

2. Open the demo in your browser:

http://localhost:4173/game/index.html

Next steps to integrate Pokémon Essentials assets

- Pokémon Essentials is an RPG Maker XP resource pack (maps, sprites, tilesets and event scripts). RPG Maker project files are not directly usable in a browser.
- Preferred workflow: export or convert the Essentials art (character spritesheets, tilesets) and maps to web-friendly formats (PNG spritesheets, Tiled JSON or simple tilemaps). Then replace the placeholder tiles and player in `game/main.js` with Phaser tilemap + sprites.
- If you can upload the Essentials files (or the exported graphics/tilesets), I will help convert and integrate them into this web demo.

If you want, I can now:

- Convert the placeholder demo into a tilemap-driven Phaser scene and add a simple NPC and dialog system.
- Or wait for you to upload the Essentials assets so I can begin converting them in-place.
