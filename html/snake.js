class Snake {
    constructor(navigationMesh) {
        this.navigationMesh = navigationMesh
        this.position = navigationMesh.heroPosition
        this.heroView = new Object3D(this.position, 0.45, rgbToHex(40, 140, 40))
        let targetPosition = AddVector3(this.position, MultiplyVector3(navigationMesh.heroVector, 0.525))
        this.targetView = new Object3D(targetPosition, 0.1, rgbToHex(30, 130, 30))
        this.rotationAngle = 0.0
        this.lenght = 3.5
        this.tailPoints = []
        this.tailView = []
        this.prevTailPosition = this.position
    }

    rotate (angle) {
        this.rotationAngle = angle
    }

	update (dt) {
		let moveSpeed = 4.0 * dt
        let rotationSpeed = this.rotationAngle * 80.0 * dt
		navigationMesh.moveHero(moveSpeed)
        this.navigationMesh.rotateHeroDirection(rotationSpeed)
        this.position = navigationMesh.heroPosition
        this.heroView.position = this.navigationMesh.heroPosition
        let headDirection = MultiplyVector3(this.navigationMesh.heroVector, 0.525);
        this.targetView.position = AddVector3(this.navigationMesh.heroPosition, headDirection)
        let distanceToLast = DistanceVector3(this.prevTailPosition, this.position)
        if (distanceToLast > 1.0) {
            distanceToLast -= 1.0
            let direction = SubstractVector3(this.position, this.prevTailPosition)
            let normalizedDirection = NormalizeVector3(direction)
            this.prevTailPosition = AddVector3(this.prevTailPosition, normalizedDirection)
            this.tailPoints.unshift(this.prevTailPosition)
            this.tailPoints.pop()
        }
        // add tail segments if need
        for (let i = this.tailView.length; i < this.lenght; i++) {
            this.tailView.push(new Object3D(CreateVector3(), 0.0, rgbToHex(40, Math.max(30, parseInt(142 - i * 3)), 40)))
        }
        // add tail points if need
        for (let i = this.tailPoints.length; i < this.tailView.length + 1; i++) {
            this.tailPoints.unshift(this.position)
        }
        for(let i = 0; i < this.tailView.length; i++) {
            this.tailView[i].position = LerpVector3(this.tailPoints[i + 1], this.tailPoints[i], distanceToLast) 
            let newRadius = Math.min(0.5, (this.lenght - i) * 0.2)
            this.tailView[i].setRadius(newRadius)
        }
	}
}