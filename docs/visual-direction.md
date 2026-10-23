# Storybook visual pass

The user supplied a painted Number Hills reference. This pass adapts its lighting, valley, cottage, grass, cliff texture, flowers, vines, collectible stars, cute hero and expressive enemies to the existing game. It retains three subject worlds, secret routes, moving platforms, lava, music, the hand-held tie weapon and the blue institute/finish flag.

## Runtime files

- `dist/storybook.js`: visual helpers and generated-art loading; no collision logic.
- `dist/assets/storybook/valley.jpg`: distant illustrated valley, moved slowly relative to the camera.
- `dist/assets/storybook/cottage.png`: transparent cottage; Thai plaque text is drawn by Canvas.
- `dist/assets/storybook/teacher.png`: transparent teacher sprite; walk sway, jump tilt and tie attack are drawn at runtime.
- `dist/assets/storybook/tree.png`: transparent tree sprite.

Character motion uses a single painted sprite with runtime sway/tilt, rather than a frame-by-frame walk sheet. The ground, stars, flowers, vines, fences, lanterns and slime shading are rendered with Canvas and follow the current world coordinates. The view width on mobile follows the actual canvas rectangle so the starting character is not cropped off-screen.

## Generation provenance

Created with the built-in ImageGen tool, not the API/CLI fallback. The user's reference guided the valley; subsequent assets were prompted to match the established storybook look. Full-resolution masters remain local and are ignored by Git. Runtime assets are reduced copies preserving alpha for sprites.

Final prompt set:

1. **Valley:** Wide 16:9 polished soft painterly children's storybook fantasy valley. Luminous blue sky, enormous rounded ivory clouds, overlapping blue mountains, bright green meadows, small distant cottages, a stone arch bridge over a turquoise river, waterfall and distant academy/castle. Warm organic texture and dimensional highlights. Background panorama only: no foreground platforms, ground ledges, characters, enemies, collectibles, UI, signs, text or sun face.
2. **Cottage:** One full uncropped cozy cottage isolated on transparent background, straight-on front with slight depth. Cream plaster and warm oak half-timber walls, curved orange terracotta roof with individual tiles, brick chimney with vines, arched central wooden door, arched blue upstairs window, brass lanterns, blank wide wooden plaque above the door, flowers and pots. Soft painted texture, warm upper-left sunlight. No ground slab, people, scenery or lettering.
3. **Teacher:** One full-body chibi male teacher adventurer, brown swept hair, kind brown eyes, rosy cheeks, teal suit with lapels, white shirt, teal necktie with diagonal gold stripes, dark trousers, brown shoes and tan backpack. Neutral upright pose facing slightly right, hands exposed at waist height for the runtime weapon overlay. Big head and tiny body, detailed folds, glossy eyes, soft hair locks and dimensional shading. Transparent background, no environment or lettering.
4. **Tree:** One full rounded deciduous tree on transparent background, warm curved oak trunk, visible branches, dense mint/olive/teal leaf clusters, golden green upper-left highlights, shaded teal underside, a few vines and tiny daisies near roots. Soft painted fantasy-game texture. Straight roots baseline, no ground slab, cottage, characters, sky, UI or lettering.

## Checks

`npm test` covers gameplay, transitions, moving platforms and attached stars, secret routes, lava, the painted render path and unloaded-image fallbacks. Browser checks cover actual asset rendering, movement, jump, attack, collectibles, desktop/mobile layout and console errors. The Canvas mocks do not validate pixel appearance or real audio output.
