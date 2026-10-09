const CONTROL_POS_LIMIT = 20;
const CONTROL_Z_DEPTH = 200;

function Control(_x, _y, _size, _targetGroups) {
	this.restPos = new p5.Vector(_x, _y);
	this.pos = new p5.Vector(_x, _y);
	this.size = _size;
	this.active = false;
	this.targetGroups = _targetGroups;
	this.outputs = {x: 0, y: 0};
	
	// Convenience for mapping mouse this control's space.
	this.mapMousePosToLocal = function() {
		return {
			x: mouseX - width / 2,
			y: mouseY - height / 2
		}
	}
	
	// Determines if the mouse is over this control.
	this.isHoverOver = function() {
		let mousePos = this.mapMousePosToLocal();
		let mouseDist = dist(mousePos.x, mousePos.y, this.pos.x, this.pos.y);
		return mouseDist < this.size * 0.5;
	}
	
	// Moves control to the mouse if it's active.
	this.slideControl = function() {
		if (this.active) {
			let mousePos = this.mapMousePosToLocal();
			
			let offsetX = constrain(mousePos.x - this.restPos.x, -CONTROL_POS_LIMIT, CONTROL_POS_LIMIT);
			let offsetY = constrain(mousePos.y - this.restPos.y, -CONTROL_POS_LIMIT, CONTROL_POS_LIMIT);
			
			this.pos.set(this.restPos.x + offsetX, this.restPos.y + offsetY);
		}
	}
	
	// Calculates lerp values and targets to use for later.
	this.storeOutputs = function() {
		// Get control's offsets.
		let offsetX = this.restPos.x - this.pos.x;
		let offsetY = this.restPos.y - this.pos.y;
		
		// Determines what lerp value to lerp for left/right target.
		if (offsetX > 0) {
			this.outputs.x = map(offsetX, 0, CONTROL_POS_LIMIT, 0.0, 1.0);
		} else {
			this.outputs.x = map(offsetX, 0, -CONTROL_POS_LIMIT, 0.0, 1.0);
		}
		
		// Determines which left/right target each group should use to lerp to.
		for (let targetGroup of this.targetGroups) {
			if (targetGroup.leftTarget != null && targetGroup.rightTarget != null) {
				if (offsetX > 0) {
					targetGroup.yawTarget = targetGroup.rightTarget;
				} else {
					targetGroup.yawTarget = targetGroup.leftTarget
				}
			}
		}
		
		// Determines what lerp value to lerp for up/down target.
		if (offsetY > 0) {
			this.outputs.y = map(offsetY, 0, CONTROL_POS_LIMIT, 0.0, 1.0);
		} else {
			this.outputs.y = map(offsetY, 0, -CONTROL_POS_LIMIT, 0.0, 1.0);
		}
		
		// Determines which up/down target each group should use to lerp to.
		for (let targetGroup of this.targetGroups) {
			if (targetGroup.upTarget != null && targetGroup.downTarget != null) {
				if (offsetY > 0) {
					targetGroup.pitchTarget = targetGroup.upTarget;
				} else {
					targetGroup.pitchTarget = targetGroup.downTarget
				}
			}
		}
	}
	
	this.display = function() {
		if (this.active) {
			stroke(0, 255, 0);
		} else {
			if (!mouseIsPressed && this.isHoverOver()) {
				stroke(255, 255, 0);
			} else {
				stroke(255, 0, 0);
			}
		}
		
		strokeWeight(this.size);
		point(this.pos.x, this.pos.y, CONTROL_Z_DEPTH);
	}
}