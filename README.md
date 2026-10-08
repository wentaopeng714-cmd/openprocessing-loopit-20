# Quiet / Play — Twenty ways to play

An English interactive art collection with twenty independent gesture models. No scores, deadlines, generic scatter controls, or source links in the artwork interface.

Sculpt expressions; build mountain ridges; feed autonomous koi; plant and water a garden; compose aurora ribbons; pour and stir tea; pet a cat or play with yarn; paint currents for jellyfish; weave lasting colored threads; rake sand around stones; offer a butterfly a perch; wipe fog from a window; scratch a record with angular inertia; shake falling leaves from a tree; turn lunar phases and place craters; slice fruit and squeeze juice; fold independent paper wings; create gravitational wells; pull a lamp cord and dim its shade; launch boats on propagating waves.

Open any HTML in `standalone-art/` directly, or run `python3 -m http.server 8000` from the extracted directory and open `index.html`. No external libraries or network are required by the art scenes.

- `assets/art/interactions.js`: separate input rules, persistence, simulation and drawing for each subject
- `assets/art/engine.js`: geometry, rendering and smooth interpolation
- `art/`: individual scene pages
- `standalone-art/`: twenty self-contained HTML files
- `art-manifest.json`: descriptions, instructions and interaction models
- `downloads/touch-art-20.zip`: complete current collection

Run `python3 build_art.py`, `python3 build_gallery.py`, and `python3 package_art.py` to regenerate pages and packages. Use `node tests/art-mechanics.cjs` in the repository for simulation checks. Previous editions remain in Git history and their release downloads.

Spring interpolation derives from Mouse Twitch by maks on OpenProcessing. New geometry and independent gesture models are authored for this collection. CC BY-NC-SA 3.0; see `ART-CREDITS.md`.
