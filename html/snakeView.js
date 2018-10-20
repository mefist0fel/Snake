// Snake class
class Snake {
    constructor(positionVector3, radius = 0.4, animSpeed = 3.0) {
		this.position = positionVector3
		this.object3d = new Object3D(positionVector3, 0.0, rgbToHex(255, 0, 0))
		this.radius = radius
		this.anim = 0.0
		this.animSpeed = animSpeed
    }

    removeApple(position) {
        this.position = position
        this.anim = -1.0
    }

	update (dt) {
        if (this.anim < 1.0) {
            let newValue = this.anim + this.animSpeed * dt
            if (newValue > 1.0) {
                newValue = 1.0
            } else {
                if (this.anim < 0 && newValue > 0) {
                    this.object3d.position = this.position
                }
            }
            this.anim = newValue
            this.object3d.setRadius(this.radius * Math.abs(this.anim))
        }
	}
}