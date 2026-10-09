# Twenty Ways to Touch — latest collection

The latest 20 independent artworks are in [art20/](art20/). Preview and downloads: https://wentaopeng714-cmd.github.io/openprocessing-loopit-20/art20/

Each work has its own Canvas simulation, primary gesture, content and interface. English UI; touch and mouse; no external runtime assets. Download one HTML or one ZIP per upload. The complete ZIP contains all 20 individual ZIP packages.

- `python3 build_art20.py` rebuilds pages, standalone HTML files, individual ZIPs and the complete download.
- `art20/src/` contains the 20 independent scenes.
- `art20/runtime.js` provides input and drawing utilities.
- `art20/check-scenes.cjs` exercises geometry, tools and pointer sequences at 390×844 and 1440×900.
- `art20/check-pixels.cjs` compares seeded Canvas renders with and without each primary gesture.
- `art20/render-previews.cjs` renders actual scene code for catalogue thumbnails; these are artwork renders, not browser screenshots.
- Each ZIP includes its licence. Nineteen scenes are original MIT implementations; Glass Orchard adapts the credited Delaunay library and is CC BY-SA 3.0.

Previous collections remain available at [upload-art/](upload-art/) and [upload-art-2/](upload-art-2/).

---

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
