class Apple {
    constructor(positionVector3, color, radius = 0.4, animSpeed = 6.0) {
		this.position = positionVector3
		this.object3d = new Object3D(positionVector3, 0.0, color)
		this.radius = radius
		this.anim = 0.0
        this.animSpeed = animSpeed
    }

    remove (position) {
        this.position = position
        this.anim = -Math.abs(this.anim)
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