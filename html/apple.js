// 3d Dot class
class Apple {
    constructor(positionVector3, object3d, radius = 0.5) {
		this.position = positionVector3
		this.object3d = object3d
		this.radius = radius
		this.scale = 0.0
    }
    
    putRandom(position) {
        this.position = position
    }

	update (dt) {
        if (this.scale < 1.0) {
            this.scale += 2.0 * dt
            if (this.scale > 1.0) {
                this.scale = 1.0
            }
            this.object3d.radius = this.radius * this.scale
        }
	}
}