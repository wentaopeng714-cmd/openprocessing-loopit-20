# Twenty OpenProcessing source remixes — latest collection

The requested collection is [remix20/](remix20/): https://wentaopeng714-cmd.github.io/openprocessing-loopit-20/remix20/

Twenty adaptations of actual OpenProcessing source files, with independently retained visual algorithms, English interfaces and different touch controls. Each work has an offline single HTML file and a separate ZIP containing unchanged originals, source URLs and hashes, visual-code changes, adapted code and credits. No source-code panel appears in the artwork.

- [Originals, authors, licences and retained algorithms](remix20/SOURCES.md)
- [Runtime and interaction checks](remix20/qa-runtime.json)
- [Original facial mesh/deformation checks](remix20/qa-face.json)
- [Release downloads](https://github.com/wentaopeng714-cmd/openprocessing-loopit-20/releases/tag/v6.0.0)

The 19 Canvas works were checked with actual p5.js, a simulated DOM and native Canvas; pointer events, buttons, inputs and portrait/landscape/desktop resize passed. Facial Rig loaded all 58 original OBJ meshes and passed deformation, reset and jaw-dragging checks. **Live browser, WebGL and real phone verification remain pending because the host Mac was locked.** Thumbnails are source renders; the facial thumbnail is a software projection.

Chromatic Breath (13) retains the original CC BY-NC-SA noncommercial licence. All other source metadata identifies CC BY-SA. Original author and third-party asset notices are retained.

Previous six-work collections remain at [upload-art/](upload-art/) and [upload-art-2/](upload-art-2/). The earlier `art20/` batch used original implementations and did not satisfy the request to adapt OpenProcessing source; it is superseded by `remix20/`.

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
