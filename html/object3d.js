
class Object3D {
    constructor(positionVector3, color = '#FFEEEE') {
		this.position = positionVector3
		this.screenPosition = CreateVector3()
		this.color = color
		this.radius = 0.5
		this.radiusPositionVector = CreateVector3(this.radius)
		this.screenRadius = 10.0
	}
	
	prepareScene (camera) {
		this.screenPosition = camera.worldToScreenVector3(this.position)
		let screenRadiusPosition = camera.worldToScreenVector3WithOffcet(this.position, this.radiusPositionVector)
		let screenRadiusVector = SubstractVector3(this.screenPosition, screenRadiusPosition)
		this.screenRadius = Vector3Length(screenRadiusVector)
	}

	draw (canvas) {
		canvas.fillStyle = this.color;
		canvas.beginPath();
		canvas.arc(this.screenPosition[0], this.screenPosition[1], this.screenRadius, 0, 2.0 * Math.PI);
		canvas.closePath();
		canvas.fill();
	}
}

function object3DDepthComparator (objectA, objectB) {
	if (objectA.screenPosition[2] < objectB.screenPosition[2])
		return -1
	if (objectA.screenPosition[2] > objectB.screenPosition[2])
		return 1
	return 0
}