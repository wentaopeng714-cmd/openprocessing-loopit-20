# coding: utf-8
from pathlib import Path
import json
p=Path('art-manifest.json');M=json.loads(p.read_text())
rows=[
('Golden Visage','Portraits','Sculpt a living expression. A smile, raised brows, a wandering gaze.','Drag across the mouth to shape a smile. Drag over the eyes to change gaze and expression.','Expression sculpting'),
('Quiet Ridges','Landscapes','Pull mountains out of paper. Move the sun through a landscape you shape.','Drag up or down to sculpt lasting ridges. Choose Move sun to relocate the sun.','Persistent terrain brush'),
('Koi Letters','Creatures','Draw with food. Three fish turn, follow the trail, and eat what you leave.','Tap to drop food. Drag to leave a trail. Wait for the fish to find it.','Autonomous feeding and steering'),
('Seed & Bloom','Botanical','Plant small possibilities. Water them, and watch a garden take its own shape.','Choose Plant and tap for seeds. Choose Water and hold over them to grow flowers.','Planting and localized growth'),
('Light Loom','Light studies','Compose an aurora in layered ribbons. Stretch time with two fingertips.','Drag to compose a ribbon. Use two fingers to stretch the moving light.','Gesture-drawn light composition'),
('Afternoon Tea','Everyday','Pour, warm, and stir. Watch the cup fill and the steam respond.','Hold above the cup to pour. Trace circles inside it to stir the tea.','Pouring, filling and thermal steam'),
('The Blue Cat','Creatures','Earn a sleepy purr, or roll a ball of yarn just beyond a curious paw.','Stroke the head in Pet mode. Choose Yarn and drag the ball for the paw to follow.','Petting response and yarn play'),
('Drifting Guests','Creatures','Paint invisible currents. Jellyfish drift through the water you set in motion.','Drag to paint a current. Tap for bioluminescence. Currents remain until you calm them.','Flow-field painting and buoyancy'),
('Thread by Thread','Everyday','A loom remembers your hands. Lay colored threads and cross them into cloth.','Draw across the loom to weave a thread. Change thread color, or undo one strand.','Persistent weaving with over-under crossings'),
('Sand Ritual','Landscapes','Eight fine grooves follow your rake. Add stones and find a path around them.','Drag in Rake mode to leave grooves. Choose Stone and tap to place a rock.','Multi-tine rake and rock placement'),
('A Place to Land','Creatures','Offer a perch. A butterfly flutters toward it, then slowly opens its wings.','Tap to grow a perch. Hold still to let the butterfly land. Drag to lead it elsewhere.','Flight, following and perching'),
('Window Weather','Everyday','Clear the mist with your hand. Let the glass gently cloud over again.','Wipe the window with a drag. Cleared paths remain, then mist slowly returns.','Fog erasure and condensation'),
('Velvet Groove','Everyday','Scratch a record, release its momentum, and move the needle to another groove.','Turn the record in a circle. Release to spin. Drag the tonearm to move the needle.','Angular scratching and inertial playback'),
('Borrowed Autumn','Botanical','A fast swipe becomes wind. Leaves fall, gather, and return with spring.','Swipe quickly to shake leaves loose. Tap to regrow them. Try Autumn and Spring.','Wind impulses, falling leaves and regrowth'),
('Phases of Quiet','Landscapes','Turn a moon through its phases. Leave small craters, and disturb its reflection.','Swipe across the moon to change its phase. Tap for a crater; touch the water for a ripple.','Spherical phase shading and crater placement'),
('Citrus Still Life','Everyday','Slice along your own angle. Separate the halves and squeeze a little sunlight.','Swipe across an orange to slice it. Switch to Squeeze and hold to release juice.','Stroke intersection, cutting and juice physics'),
('A Fold, A Wish','Everyday','Paper bends along its hinges. Fold both wings into a shape that stays.','Drag either wing inward across its hinge. Two fingers can fold both wings together.','Independent paper hinges and retained folds'),
('Pocket Universe','Light studies','Place a black hole. Deepen it, move it, and watch stars find new orbits.','Tap to create a gravity well. Hold to deepen it. Drag the well to reshape star orbits.','Persistent gravitational wells and orbital dynamics'),
('Leave a Light On','Everyday','Pull the cord and release. Slide over the shade to set the light you need.','Pull the small cord downward and release to switch the lamp. Drag the shade to dim it.','Cord spring, switch and analog dimming'),
('Paper Tides','Landscapes','Launch a paper boat. Steer it through waves made by your own hands.','Tap to launch a boat. Drag it to steer; moving through water sends out waves.','Boat steering and propagating wave fields')]
for m,row in zip(M,rows):
 m['name'],m['category'],m['description'],m['hint'],m['mechanic']=row
 m['english']='INTERACTIVE STUDY / '+m['kind'].upper();m.pop('change',None)
p.write_text(json.dumps(M,ensure_ascii=False,indent=2))
