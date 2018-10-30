// 3d Dot class
class Object3D {
    constructor(positionVector3, radius = 0.5, color = '#FFEEEE') {
		this.position = positionVector3
		this.screenPosition = CreateVector3()
		this.color = color
		this.radiusPositionVector = CreateVector3(radius)
		this.screenRadius = 10.0
		this.enabled = true
		Camera.instance.objects.push(this)
	}

	setRadius(radius) {
		this.radiusPositionVector = CreateVector3(radius)
	}
	
	prepareScene (camera) {
		if (!this.enabled)
			return
		this.screenPosition = camera.worldToScreenVector3(this.position)
		let screenRadiusPosition = camera.worldToScreenVector3WithOffcet(this.position, this.radiusPositionVector)
		let screenRadiusVector = SubstractVector3(this.screenPosition, screenRadiusPosition)
		this.screenRadius = Vector3Length(screenRadiusVector)
	}

	draw (canvas) {
		if (!this.enabled)
			return
		canvas.fillStyle = this.color
		canvas.beginPath()
		canvas.arc(this.screenPosition[0], this.screenPosition[1], this.screenRadius, 0, 2.0 * Math.PI);
		canvas.closePath()
		canvas.fill()
	}
}
// 3d Triangle class
class Object3DTriangle {
    constructor(a, b, c, color = '#FFEEEE', filled = true, ignoreBackface = true) {
		this.points = [a, b, c]
		this.screenPoints = [a, b, c]
		this.position = FindMiddlePoint(this.points)
		this.screenPosition = CreateVector3()
		this.color = color
		this.ignoreBackface = ignoreBackface
		this.filled = filled
		this.enabled = true
		Camera.instance.objects.push(this)
	}
	
	prepareScene (camera) {
		if (!this.enabled)
			return
		this.screenPosition = camera.worldToScreenVector3(this.position)
		for(let i = 0; i < this.screenPoints.length; i++) {
			this.screenPoints[i] = camera.worldToScreenVector3(this.points[i])
		}
	}

	draw (canvas) {
		if (!this.enabled)
			return
		if (this.ignoreBackface) {
			var dot = PointToLine(this.screenPoints[0], this.screenPoints[1], this.screenPoints[2])
			if (dot > 0)
				return
		}
		canvas.fillStyle = this.color
		canvas.strokeStyle = this.color
		canvas.beginPath()
		let last = this.screenPoints[this.screenPoints.length - 1]
		canvas.moveTo(last[0], last[1])
		for(let i = 0; i < this.screenPoints.length; i++) {
			canvas.lineTo(this.screenPoints[i][0], this.screenPoints[i][1]);
		}
		canvas.closePath()
		if (this.filled)
			canvas.fill()
		canvas.stroke()
	}
}

function object3DDepthComparator (objectA, objectB) {
	if (objectA.screenPosition[2] < objectB.screenPosition[2])
		return -1
	if (objectA.screenPosition[2] > objectB.screenPosition[2])
		return 1
	return 0
}