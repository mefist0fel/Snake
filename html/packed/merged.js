// Geometry functions
const MAX_NUMBER = Number.MAX_VALUE
const MIN_NUMBER = Number.MIN_VALUE
const PI = Math.PI
const Cos = Math.cos
const Sin = Math.sin

function inRect(x, y, rsx, rsy, rex, rey) { // Rect start x/y and Rect end x/y
	return (x >= rsx) && (x <= rex) && (y >= rsy) && (y <= rey)
}

// vector 2 functions
function CreateVector2(x = 0.0, y = 0.0) {
	return [x, y,]
}

function AddVector2(a, b) {
	return [a[0] + b[0], a[1] + b[1]]
}

function SubstractVector2(a, b) {
	return [a[0] - b[0], a[1] - b[1]]
}

function MultiplyVector2(v, multiplier) {
	return [v[0] * multiplier, v[1] * multiplier]
}

function LerpVector2(a, b, t) {
	return AddVector2(
		MultiplyVector2(a, 1.0 - t),
		MultiplyVector2(b, t)
	)
}

function Vector2Length(v) {
	return Math.sqrt(v[0] * v[0] + v[1] * v[1])
}

function NormalizeVector2(v) {
	var dist = 1.0 / Vector2Length(v);
	if (dist == Infinity) {
		dist = MAX_NUMBER;
	}
	if (dist == -Infinity) {
		dist = MIN_NUMBER;
	}
	return MultiplyVector2(v, dist);
}

function DotProductVector2(a, b) {
	return a[0] * b[0] + a[1] * b[1];
}

function DistanceToLineDistance(lineStart, lineEnd, point) {
	let lineDirection = SubstractVector2(lineEnd, lineStart)
	let perpendicular = [lineDirection[1], -lineDirection[0]]
	let pointDirection = SubstractVector2(lineStart, point)
	return Math.abs(DotProductVector2(NormalizeVector2(perpendicular), pointDirection))
}

function PointToLine(lineStart, lineEnd, point) {
	let lineDirection = SubstractVector2(lineEnd, lineStart)
	let perpendicular = [lineDirection[1], -lineDirection[0]]
	let pointDirection = SubstractVector2(lineStart, point)
	return DotProductVector2(NormalizeVector2(perpendicular), pointDirection)
}

// vector 3 functions
function CreateVector3(x = 0.0, y = 0.0, z = 0.0) {
	return [x, y, z]
}

function AddVector3(a, b) {
	return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

function SubstractVector3(a, b) {
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

function MultiplyVector3(v, multiplier) {
	return [v[0] * multiplier, v[1] * multiplier, v[2] * multiplier]
}

function DotProductVector3(a, b) {
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function AngleBetweenVector3(a, b) {
	return Math.acos(DotProductVector3(NormalizeVector3(a), NormalizeVector3(b))) / PI * 180.0
}

function AxeBetweenVector3(a, b) {
	return NormalizeVector3(CrossProductVector3(NormalizeVector3(a), NormalizeVector3(b)))
}

function IsEqualVector3(a, b) {
	let sigma = 0.001
	return DistanceVector3(a, b) < sigma
}

function CrossProductVector3(a, b) {
	return CreateVector3(
		a[1] * b[2] - a[2] * b[1],
		a[2] * b[0] - a[0] * b[2],
		a[0] * b[1] - a[1] * b[0]
	)
}

function Vector3Length(v) {
	return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
}

function DistanceVector3(a, b) {
	return Vector3Length(SubstractVector3(a, b))
}

function NormalizeVector3(v) {
	let dist = 1.0 / Vector3Length(v)
	if (dist == NaN) {
		dist = MAX_NUMBER
	}
	if (dist == Infinity) {
		dist = MAX_NUMBER
	}
	if (dist == -Infinity) {
		dist = MIN_NUMBER
	}
	return MultiplyVector3(v, dist)
}

function LerpVector3(a, b, t) {
	return AddVector3(
		MultiplyVector3(a, 1.0 - t),
		MultiplyVector3(b, t)
	)
}

function FindMiddlePoint (points) {
	let sum = CreateVector3()
	for(let i = 0; i < points.length; i++) {
		sum = AddVector3(sum, points[i])
	}
	return MultiplyVector3(sum, 1.0 / parseFloat(points.length))
}

// Matrix 3 * 3 functions
function CreateUnitMatrix3() {
	return [     //  ids
		1, 0, 0, // 0 1 2
		0, 1, 0, // 3 4 5
		0, 0, 1  // 6 7 8
	]
}

function CreateMatrix3RotatedX(angle = 0.0) {
	// angles in radians
	var a = angle / 180.0 * PI
	var ca = Cos(a)
	var sa = Sin(a)
	return [
		1,  0,  0,
		0, ca,-sa,
		0, sa, ca
	]
}

function CreateMatrix3RotatedY(angle = 0.0) {
	// angles in radians
	var a = angle / 180.0 * PI
	var ca = Cos(a)
	var sa = Sin(a)
	return [
		 ca,  0, sa,
		  0,  1,  0,
		-sa,  0, ca
	]
}

function CreateMatrix3RotatedZ(angle = 0.0) {
	// angles in radians
	var a = angle / 180.0 * PI
	var ca = Cos(a)
	var sa = Sin(a)
	return [
		 ca,-sa, 0,
		 sa, ca, 0,
		  0,  0, 1
	]
}

function CreateEulerMatrix3(xAngle = 0.0, yAngle = 0.0, zAngle = 0.0) {
	// angles in radians
	var a = xAngle / 180.0 * PI
	var b = yAngle / 180.0 * PI
	var y = zAngle / 180.0 * PI
	var ca = Cos(a)
	var cb = Cos(b)
	var cy = Cos(y)
	var sa = Sin(a)
	var sb = Sin(b)
	var sy = Sin(y)
	return [
		ca * cy - sa * sb * cy,  -ca * sy - sa * cb * cy,  sa * sb,
		sa * cy + ca * cb * sy,  -sa * sy + ca * cb * cy, -ca * sb,
		               sb * sy,                  sb * cy,       cb
	]
}

function CreateRotationMatrix3(axeVector, angle) { // axe vector must be unit
	let u = axeVector[0]
	let v = axeVector[1]
	let w = axeVector[2]
	let radian = angle / 180.0 * PI
	let c = Cos(radian)
	let s = Sin(radian)
	let q = (1.0 - c)
	return [
		u * u + (1.0 - u * u) * c, 	u * v * q - w * s, 			u * w * q + v * s,
		u * v * q + w * s,			v * v + (1.0 - v * v) * c,	v * w * q - u * s,
		u * w * q - v * s,			v * w * q + u * s,			w * w + (1.0 - w * w) * c
	]
}

function MultiplyMatrix3(ma, mb) {
	return [
		ma[0] * mb[0] + ma[1] * mb[3] + ma[2] * mb[6],  ma[0] * mb[1] + ma[1] * mb[4] + ma[2] * mb[7],  ma[0] * mb[2] + ma[1] * mb[5] + ma[2] * mb[8],
		ma[3] * mb[0] + ma[4] * mb[3] + ma[5] * mb[6],  ma[3] * mb[1] + ma[4] * mb[4] + ma[5] * mb[7],  ma[3] * mb[2] + ma[4] * mb[5] + ma[5] * mb[8],
		ma[6] * mb[0] + ma[7] * mb[3] + ma[8] * mb[6],  ma[6] * mb[1] + ma[7] * mb[4] + ma[8] * mb[7],  ma[6] * mb[2] + ma[7] * mb[5] + ma[8] * mb[8]
	]
}

function MultiplyVector3ToMatrix3(v, m) {
	return [
		v[0] * m[0] + v[1] * m[1] + v[2] * m[2],
		v[0] * m[3] + v[1] * m[4] + v[2] * m[5],
		v[0] * m[6] + v[1] * m[7] + v[2] * m[8]
	]
}

function findMiddlePoint (points) {
	let sum = CreateVector3()
	for(let i = 0; i < points.length; i++) {
		sum = AddVector3(sum, points[i])
	}
	return MultiplyVector3(sum, 1.0 / parseFloat(points.length))
}

function CreateMatrix3FromQuaternion(quaternion)
{
	let x = quaternion[0]
	let y = quaternion[1]
	let z = quaternion[2]
	let w = quaternion[3]

	let x2 = x + x
	let y2 = y + y
	let z2 = z + z;
	let xx = x * x2
	let xy = x * y2
	let xz = x * z2
	let yy = y * y2
	let yz = y * z2
	let zz = z * z2
	let wx = w * x2
	let wy = w * y2
	let wz = w * z2

	return [
		1.0 - (yy + zz),	xy + wz,			xz - wy,
		xy - wz,			1.0 - (xx + zz), 	yz + wx,
		xz + wy,			yz - wx, 			1.0 - (xx + yy)
	]
}

// Quaternion
function CreateQuaternion() {
	return [
	//	x  y  z  w //  ids
		0, 0, 0, 1 // 0 1 2 3
	]
}
function CreateQuaternionFromMatrix3(m) {
	// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/
	let w = Math.sqrt(1.0 + m[0] + m[4] + m[8]) / 2.0;
	let w4 = w * 4.0
	return [
		(m[7] - m[5]) / w4,
		(m[2] - m[6]) / w4,
		(m[3] - m[1]) / w4,
		w
	]
	// x = (m1.m21 - m1.m12) / w4 ;
	// y = (m1.m02 - m1.m20) / w4 ;
	// z = (m1.m10 - m1.m01) / w4 ;
	// 0 1 2   00 01 02
	// 3 4 5   10 11 12
	// 6 7 8   20 21 22
}

// Matrix 4 * 4 functions
function CreateUnitMatrix4() {
	return [         //  ids
		1, 0, 0, 0,  //  0  1  2  3
		0, 1, 0, 0,  //  4  5  6  7
		0, 0, 1, 0,  //  8  9 10 11
		0, 0, 0, 1   // 12 13 14 15
	]
}
function CreateMatrix4FromMatrix3(m) { // matrix3 and position
	return [         //  ids
		m[0], m[1], m[2],    0,  //  0  1  2  3
		m[3], m[4], m[5],    0,  //  4  5  6  7
		m[6], m[7], m[8],    0,  //  8  9 10 11
		   0,    0,    0,    1   // 12 13 14 15
	]
}

function CreateMatrix4(positionVector3, scale = 1.0) {
	var x = positionVector3[0]
	var y = positionVector3[1]
	var z = positionVector3[2]
	var s = scale
	return [
		s, 0, 0, 0,
		0, s, 0, 0,
		0, 0, s, 0,
		x, y, z, 1
	]
}

function MultiplyVector3ToMatrix4(v, m) {
	var vec4 = [v[0], v[1], v[2], 1.0]
	var res = MultiplyVector4ToMatrix4(vec4, m)
	return [
		res[0] / res[3],
		res[1] / res[3],
		res[2] / res[3]
	]
}

function MultiplyVector4ToMatrix4(v, m) {
	return [
		v[0] * m[ 0] + v[1] * m[ 4] + v[2] * m[ 8] + v[3] * m[12],
		v[0] * m[ 1] + v[1] * m[ 5] + v[2] * m[ 9] + v[3] * m[13],
		v[0] * m[ 2] + v[1] * m[ 6] + v[2] * m[10] + v[3] * m[14],
		v[0] * m[ 3] + v[1] * m[ 7] + v[2] * m[11] + v[3] * m[15]
	]
}

function CreateProjectionMatrix4(topY = 100.0, rightX = 100.0, nearZ = 1.0, farZ = 100.0) {
	// http://www.songho.ca/opengl/gl_projectionmatrix.html
	var n = nearZ
	var f = farZ
	var t = topY
	var r = rightX
	var g = (f + n) / (f - n)
	var h = (-2.0 * f * n) / (f - n)
	return [
		n/r,   0,   0,   0,
		  0, n/t,   0,   0,
		  0,   0,   g,  -1,
		  0,   0,   h,   0
	]
}

function MultiplyMatrix4(ma, mb) {
	return [
		ma[ 0] * mb[ 0] + ma[ 1] * mb[ 4] + ma[ 2] * mb[ 8]  + ma[ 3] * mb[12],
		ma[ 0] * mb[ 1] + ma[ 1] * mb[ 5] + ma[ 2] * mb[ 9]  + ma[ 3] * mb[13],
		ma[ 0] * mb[ 2] + ma[ 1] * mb[ 6] + ma[ 2] * mb[10]  + ma[ 3] * mb[14],
		ma[ 0] * mb[ 3] + ma[ 1] * mb[ 7] + ma[ 2] * mb[11]  + ma[ 3] * mb[15],

		ma[ 4] * mb[ 0] + ma[ 5] * mb[ 4] + ma[ 6] * mb[ 8]  + ma[ 7] * mb[12],
		ma[ 4] * mb[ 1] + ma[ 5] * mb[ 5] + ma[ 6] * mb[ 9]  + ma[ 7] * mb[13],
		ma[ 4] * mb[ 2] + ma[ 5] * mb[ 6] + ma[ 6] * mb[10]  + ma[ 7] * mb[14],
		ma[ 4] * mb[ 3] + ma[ 5] * mb[ 7] + ma[ 6] * mb[11]  + ma[ 7] * mb[15],

		ma[ 8] * mb[ 0] + ma[ 9] * mb[ 4] + ma[10] * mb[ 8]  + ma[11] * mb[12],
		ma[ 8] * mb[ 1] + ma[ 9] * mb[ 5] + ma[10] * mb[ 9]  + ma[11] * mb[13],
		ma[ 8] * mb[ 2] + ma[ 9] * mb[ 6] + ma[10] * mb[10]  + ma[11] * mb[14],
		ma[ 8] * mb[ 3] + ma[ 9] * mb[ 7] + ma[10] * mb[11]  + ma[11] * mb[15],

		ma[12] * mb[ 0] + ma[13] * mb[ 4] + ma[14] * mb[ 8]  + ma[15] * mb[12],
		ma[12] * mb[ 1] + ma[13] * mb[ 5] + ma[14] * mb[ 9]  + ma[15] * mb[13],
		ma[12] * mb[ 2] + ma[13] * mb[ 6] + ma[14] * mb[10]  + ma[15] * mb[14],
		ma[12] * mb[ 3] + ma[13] * mb[ 7] + ma[14] * mb[11]  + ma[15] * mb[15]
	]
}// Base keys, mouse, touches input
function Input() {
	//  KEY KODES
	//	BACKSPACE: 8,
	//	TAB:       9,	RETURN:   13,
	//	ESC:      27,	SPACE:    32,
	//	PAGEUP:   33,	PAGEDOWN: 34,
	//	END:      35,	HOME:     36,
	//	LEFT:     37,	UP:       38,
	//	RIGHT:    39,	DOWN:     40,
	//	INSERT:   45,	DELETE:   46,
	//	ZERO:     48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57,
	//	A:        65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
	//	TILDA:    192

	var input = {
		keyPressed: clearKeys(),
		keyDown: clearKeys(),
		mouseLeft: false,
		mouseLeftDown: false,
		mousePosition: [0, 0],
		touches: [],
		touchesDown: [],
		isTouchInRect: function (rectSX, rectSY, rectEX, rectEY) {
			if (this.mouseLeft && inRect(this.mousePosition[0], this.mousePosition[1], rectSX, rectSY, rectEX, rectEY))
				return true
			for(let i = 0; i < this.touches.length; i++) {
				if (inRect(this.touches[i][0], this.touches[i][1], rectSX, rectSY, rectEX, rectEY))
					return true
			}
			return false
		},
		isTouchDownInRect: function (rectSX, rectSY, rectEX, rectEY) {
			if (this.mouseLeftDown && inRect(this.mousePosition[0], this.mousePosition[1], rectSX, rectSY, rectEX, rectEY))
				return true
			for(let i = 0; i < this.touches.length; i++) {
				if (inRect(this.touchesDown[i][0], this.touchesDown[i][1], rectSX, rectSY, rectEX, rectEY))
					return true
			}
			return false
		},
		updateInput: function () {
			this.mouseLeftDown = false
			this.keyDown = clearKeys()
		}
	}

	function clearKeys(count = 200) {
		let keys = []
		for(var i = 0; i < 200; i++) {
			keys[i] = false
		}
		return keys
	}

	function onKeyDown(event) {
		input.keyDown[event.keyCode] = true
		input.keyPressed[event.keyCode] = true
	}
	function onKeyUp(event) {
		input.keyPressed[event.keyCode] = false
	}

	// function onClick(event) {}

	function mouseDown(event) {
		input.mouseLeft = true
		input.mouseLeftDown = true
		input.mousePosition[0] = event.clientX
		input.mousePosition[1] = event.clientY
	}

	function mouseUp(event) {
		input.mouseLeft = false
		input.mousePosition[0] = event.clientX
		input.mousePosition[1] = event.clientY
	}

	function mouseMove(event) {
		input.mousePosition[0] = event.clientX
		input.mousePosition[1] = event.clientY
	}

	function onTouchStart(event) {
		input.touches = createTouchList(event)
		onTouch(event)
	}

	function onTouch(event) {
		input.touches = createTouchList(event)
		event.preventDefault()
	}

	function createTouchList(event) {
		let touches = []
		for(let i = 0; i < event.touches.length; i++) {
			touches.push([event.touches[i].clientX, event.touches[i].clientY])
		}
		return touches
	}

	function addListener(type, callback) {
		document.addEventListener(type, callback, {passive: false})
	}

	// addListener('click',		onClick)
	addListener('mousedown',	mouseDown)
	addListener('mouseup',		mouseUp)
	addListener('mousemove',	mouseMove)
	addListener('keydown',		onKeyDown)
	addListener('keyup',		onKeyUp)
	addListener('touchstart',	onTouchStart)
	addListener('touchmove',	onTouch)
	addListener("touchend",		onTouch);
	addListener("touchcancel",	onTouch);

	return input;
}// 3d camera controller
class Camera {
    constructor(canvas, width = 100.0, height = 100.0) {
        this.objects = []
        this.setSize(width, height)
        this.worldMatrix = CreateUnitMatrix3()
        this.projectionMatrix = CreateProjectionMatrix4(1.0, 1.0, 1.0, 2.0)
        this.cameraPosition = CreateVector3(0.0, 0.0, 20.0)
        this.position = CreateVector3()
        this.canvas = canvas

        Camera.instance = this
    }

    setSize(width, height) {
        this.screenWidht = width;
        this.screenHeight = height;
        this.centerOffcet = CreateVector3(width * 0.5, height * 0.5)
        this.screenScale = Math.min(width, height)
    }

    render () {
		for (let i = 0; i < this.objects.length; i++) {
			this.objects[i].prepareScene(this)
		}
		this.objects.sort(object3DDepthComparator)
		for (let i = 0; i < this.objects.length; i++) {
			this.objects[i].draw(this.canvas)
		}
    }

    worldToScreenVector3 (point) {
        let worldPoint = point
        worldPoint = AddVector3(worldPoint, MultiplyVector3(this.position, -1.0))
        worldPoint = MultiplyVector3ToMatrix3(worldPoint, this.worldMatrix)
        worldPoint = AddVector3(worldPoint, this.cameraPosition)
        worldPoint = MultiplyVector3ToMatrix4(worldPoint, this.projectionMatrix)
        worldPoint = MultiplyVector3(worldPoint, this.screenScale)
        return AddVector3(worldPoint, this.centerOffcet)
    }

    worldToScreenVector3WithOffcet (point, offcet) {
        let worldPoint = point
        worldPoint = AddVector3(worldPoint, MultiplyVector3(this.position, -1.0))
        worldPoint = MultiplyVector3ToMatrix3(worldPoint, this.worldMatrix)
        worldPoint = AddVector3(worldPoint, this.cameraPosition)
        worldPoint = AddVector3(worldPoint, offcet)
        worldPoint = MultiplyVector3ToMatrix4(worldPoint, this.projectionMatrix)
        worldPoint = MultiplyVector3(worldPoint, this.screenScale)
        return AddVector3(worldPoint, this.centerOffcet)
    }
}// 3d Dot class
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
}// Level generation class
class Level {
    constructor(id = 0) {
        this.setLevel(id)
    }

    setLevel(id) {
        this.id = id
        Camera.instance.objects = []
        this.navigationObjects = null
        this.livesCount = 3
        this.applesCount = 0
        this.applesNeed = (6 + id * 3)
        this.needRocks = parseInt(id / 4.0 + 2.0)
        this.navigationNodes = []
        let navigationTriangles = null
        if (id == 0 || id % 3 == parseInt(id / 3) % 3)
            this.needRocks = 0
        switch(id % 3) {
            case 0:
                createSphere()
                navigationTriangles = CreateNavigationSphere()
                break
            case 1:
                createCube(8.0)
                navigationTriangles = CreateNavigationCube(9.0)
                break
            case 2:
                createCilynder()
                navigationTriangles = createNavigationCilynder()
                break
        }
        for(let i = 0; i < navigationTriangles.length; i++) {
            let points = navigationTriangles[i]
            this.navigationNodes.push(
                new NavigationNode(
                    points[0],
                    points[1],
                    points[2]
                )
            )
        }

        this.navigationMesh = new NavigationMesh(this.navigationNodes)
        this.snake = new Snake(this.navigationMesh)
        this.snake.setEnabled(false)
        this.apples = [
            new Apple(CreateVector3(), rgbToHex(51,255,51)),
            new Apple(CreateVector3(), rgbToHex(51,255,51)),
            new Apple(CreateVector3(), rgbToHex(51,255,51))
        ]
        this.rocks = []
        for(let i = 0; i < this.needRocks; i++) {
            this.rocks.push(new Apple(CreateVector3(), rgbToHex(0, 0, 200)))
        }
    }

    update(dt) {
		for(let i = 0; i < this.apples.length; i++) {
			this.apples[i].update(dt)
        }
		for(let i = 0; i < this.rocks.length; i++) {
			this.rocks[i].update(dt)
        }
		for(let i = 0; i < this.apples.length; i++) {
			if (DistanceVector3(this.navigationMesh.heroPosition, this.apples[i].position) < 1.0) {
				this.apples[i].remove(this.navigationMesh.getRandomPosition())
        		this.snake.lenght += 0.5
				this.applesCount += 1
			}
		}
		for(let i = 0; i < this.rocks.length; i++) {
			if (DistanceVector3(this.navigationMesh.heroPosition, this.rocks[i].position) < 1.0) {
				this.rocks[i].remove(this.navigationMesh.getRandomPosition())
        		this.snake.lenght -= 0.2
				this.livesCount -= 1
			}
		}
		for(let i = 6; i < this.snake.tailPoints.length - 1; i++) {
			if (DistanceVector3(this.navigationMesh.heroPosition, this.snake.tailPoints[i]) < 1.0) {
				this.livesCount = 0
			}
		}
    }

    start() {
        this.snake.setEnabled(true)
        for(let i = 0; i < this.apples.length; i++) {
            this.apples[i].remove(this.navigationMesh.getRandomPosition())
        }
        for(let i = 0; i < this.rocks.length; i++) {
            this.rocks[i].remove(this.navigationMesh.getRandomPosition())
        }
    }

    hideLevelDetails() {
        this.snake.setEnabled(false)
        for(let i = 0; i < this.apples.length; i++) {
            this.apples[i].remove(CreateVector3())
        }
        for(let i = 0; i < this.rocks.length; i++) {
            this.rocks[i].remove(CreateVector3())
        }
    }
	
	showDebugInfo(needShow) {
		if (this.navigationObjects == null) {
			this.navigationObjects = this.createNavigationInfo()
		}
		for(let i = 0; i < this.navigationObjects.length; i++) {
			this.navigationObjects[i].enabled = needShow;
		}
	}
	
	createNavigationInfo() {
		let navigationObjects = []
        for(let i = 0; i < this.navigationNodes.length; i++) {
            let navigationTriangle = 
                new Object3DTriangle(
                    this.navigationNodes[i].pointA,
                    this.navigationNodes[i].pointB,
                    this.navigationNodes[i].pointC,
                    "rgb(255,255,255)", false, false
                )
                navigationObjects.push(navigationTriangle)
        }
        navigationObjects.push(new Object3D(CreateVector3(8.0, 0.0, 0.0), 0.5, rgbToHex(255, 0, 0)))
        navigationObjects.push(new Object3D(CreateVector3(0.0, 8.0, 0.0), 0.5, rgbToHex(0, 255, 0)))
        navigationObjects.push(new Object3D(CreateVector3(0.0, 0.0, 8.0), 0.5, rgbToHex(0, 0, 255)))
        return navigationObjects
	}
}

function createCube(size = 10.0, segments = 11) {
    let objects = []
    let segmentSize = 2.0 / (segments)
    let halfSize = size * 0.5
    let createPoint = function(x, y, segmentSize, size, sideMatrix) {
        let point = CreateVector3(x * segmentSize - 1.0, y * segmentSize - 1.0, 1.0)
        return MultiplyVector3ToMatrix3(MultiplyVector3(point, size), sideMatrix)
    }
    let sidesRotationMatrix = [
        CreateMatrix3RotatedX(0.0),
        CreateMatrix3RotatedX(90.0),
        CreateMatrix3RotatedX(180.0),
        CreateMatrix3RotatedX(270.0),
        CreateMatrix3RotatedY(90.0),
        CreateMatrix3RotatedY(270.0)
    ]
    let fakeLight = [
        0.5,
        0.6,
        0.7,
        0.8,
        0.9,
        1.0
    ]
    for(let sideId = 0; sideId < sidesRotationMatrix.length; sideId ++) {
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                let af = createPoint(     i,     j, segmentSize, halfSize, sidesRotationMatrix[sideId])
                let bf = createPoint( i + 1,     j, segmentSize, halfSize, sidesRotationMatrix[sideId])
                let cf = createPoint( i + 1, j + 1, segmentSize, halfSize, sidesRotationMatrix[sideId])
                let df = createPoint(     i, j + 1, segmentSize, halfSize, sidesRotationMatrix[sideId])
                let lightColor = parseInt((fakeLight[sideId]) * 255.0)
                let darkColor = parseInt((fakeLight[sideId]) * 195.0)
                let color = rgbToHex(lightColor, lightColor, lightColor)
                if ((i + j) % 2 == 1)
                    color = rgbToHex(darkColor, darkColor, darkColor)
                objects.push(new Object3DTriangle(af, bf, cf, color))
                objects.push(new Object3DTriangle(af, cf, df, color))
            }
        }
    }
    return objects
}

function CreateNavigationCube(size = 10.0, navigationRadius = 0.5, edgePolyCount = 3) {
    let s = size * 0.5
    let points = [
        CreateVector3( s, s, s), // 0
        CreateVector3( s,-s, s), // 1
        CreateVector3(-s, s, s), // 2
        CreateVector3(-s,-s, s), // 3
        CreateVector3( s, s,-s), // 4
        CreateVector3( s,-s,-s), // 5
        CreateVector3(-s, s,-s), // 6
        CreateVector3(-s,-s,-s)  // 7
    ]
    return pointsByIds(points, [
        // up
        [0, 2, 1],
        [1, 2, 3],
        // down
        [4, 5, 6],
        [5, 7, 6],
        // left
        [0, 6, 2],
        [0, 4, 6],
        // right
        [1, 3, 7],
        [1, 7, 5],
        // forw
        [0, 1, 5],
        [0, 5, 4],
        // backw
        [2, 6, 7],
        [2, 7, 3]
    ])
}

function pointsByIds(points, faceIds) {
    let mesh = []
    for(let i = 0; i < faceIds.length; i++) {
        mesh.push([
            points[faceIds[i][0]],
            points[faceIds[i][1]],
            points[faceIds[i][2]]
        ])
    }
    return mesh
}

function createSphere(radius = 5.0, segments = 9) {
    let objects = []
    let size = 1.0 / (segments)
    let createNormalizedPoint = function(x, y, size, radius, sideMatrix) {
        let point = CreateVector3(x * size - 0.5, y * size - 0.5, 0.5)
        return MultiplyVector3ToMatrix3(
            MultiplyVector3(
                NormalizeVector3(point),
                radius),
            sideMatrix)
    }
    let sidesRotationMatrix = [
        CreateMatrix3RotatedX(0.0),
        CreateMatrix3RotatedX(90.0),
        CreateMatrix3RotatedX(180.0),
        CreateMatrix3RotatedX(270.0),
        CreateMatrix3RotatedY(90.0),
        CreateMatrix3RotatedY(270.0),
    ]
    for(let sideId = 0; sideId < sidesRotationMatrix.length; sideId ++) {
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                
                // forw
                let af = createNormalizedPoint(     i,     j, size, radius, sidesRotationMatrix[sideId])
                let bf = createNormalizedPoint( i + 1,     j, size, radius, sidesRotationMatrix[sideId])
                let cf = createNormalizedPoint( i + 1, j + 1, size, radius, sidesRotationMatrix[sideId])
                let df = createNormalizedPoint(     i, j + 1, size, radius, sidesRotationMatrix[sideId])
                let normal = createNormalizedPoint(i + 0.5, j + 0.5, size, 1.0, sidesRotationMatrix[sideId])
                let fakeLight = normal[0] * 0.5 + 0.5
                let lightColor = parseInt((fakeLight * 0.6 + 0.4) * 255.0)
                let darkColor = parseInt((fakeLight * 0.6 + 0.4) * 195.0)
                let color = rgbToHex(lightColor, lightColor, lightColor)
                if ((i + j) % 2 == 1)
                    color = rgbToHex(darkColor, darkColor, darkColor)
                objects.push(new Object3DTriangle(af, bf, cf, color))
                objects.push(new Object3DTriangle(af, cf, df, color))
            }
        }
    }
    return objects
}

function CreateNavigationSphere(radius = 5.0, navigationRadius = 0.5, segments = 9) {
    let navigationTriangles = []
    let size = 1.0 / (segments)
    let fullRadius = radius + navigationRadius
    let createNormalizedPoint = function(x, y, size, radius, sideMatrix) {
        let point = CreateVector3(x * size - 0.5, y * size - 0.5, 0.5)
        return MultiplyVector3ToMatrix3(
            MultiplyVector3(
                NormalizeVector3(point),
                radius),
            sideMatrix)
    }
    let sidesRotationMatrix = [
        CreateMatrix3RotatedX(0.0),
        CreateMatrix3RotatedX(90.0),
        CreateMatrix3RotatedX(180.0),
        CreateMatrix3RotatedX(270.0),
        CreateMatrix3RotatedY(90.0),
        CreateMatrix3RotatedY(270.0),
    ]
    for(let sideId = 0; sideId < sidesRotationMatrix.length; sideId ++) {
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                let af = createNormalizedPoint(     i,     j, size, fullRadius, sidesRotationMatrix[sideId])
                let bf = createNormalizedPoint( i + 1,     j, size, fullRadius, sidesRotationMatrix[sideId])
                let cf = createNormalizedPoint( i + 1, j + 1, size, fullRadius, sidesRotationMatrix[sideId])
                let df = createNormalizedPoint(     i, j + 1, size, fullRadius, sidesRotationMatrix[sideId])
                navigationTriangles.push([af, bf, cf])
                navigationTriangles.push([af, cf, df])
            }
        }
    }
    return navigationTriangles
}

function createCilynder(sides = 32, radius = 4.0, height = 7.0, heightSegments = 8, radiusSegment = 6) {
    let objects = []
	let radiusVectors = []
	for (let i = 0; i <= sides; i++) {
		let angle = 360.0 / sides * i
		var sideVector = MultiplyVector3ToMatrix3(CreateVector3(radius, 0, 0), CreateMatrix3RotatedY(angle))
		radiusVectors.push(sideVector)
	}
	let centerUpPoint = CreateVector3(0, height * 0.5, 0)
    let centerDownPoint = CreateVector3(0, -height * 0.5, 0)
    let heightSize = 1.0 / heightSegments
    let radSize = 1.0 / radiusSegment
	for (let i = 0; i < sides; i++) {
		let color = '#FFFFFF'
		if (i % 2 == 1)
			color = '#666666'
		let upStart = AddVector3(centerUpPoint, radiusVectors[i])
		let upEnd = AddVector3(centerUpPoint, radiusVectors[i + 1])
		let downStart = AddVector3(centerDownPoint, radiusVectors[i])
		let downEnd = AddVector3(centerDownPoint, radiusVectors[i + 1])
		// objects.push(new Object3DTriangle(centerUpPoint, upStart, upEnd, color))
        // objects.push(new Object3DTriangle(centerDownPoint, downEnd, downStart, color))
        for(let j = 0; j < radiusSegment; j++) {
            let colorShift = (radiusSegment - j) * radSize * 30
            color = rgbToHex(195 + colorShift, 195 + colorShift, 195 + colorShift)
            if ((i + j) % 2 == 1)
                color = rgbToHex(255 - colorShift, 255 - colorShift, 255 - colorShift)
            upperStart = LerpVector3(centerUpPoint, upStart, j * radSize)
            upperEnd = LerpVector3(centerUpPoint, upEnd, j * radSize)
            downerStart = LerpVector3(centerUpPoint, upStart, (j + 1) * radSize)
            downerEnd = LerpVector3(centerUpPoint, upEnd, (j + 1) * radSize)
            objects.push(new Object3DTriangle(upperStart, downerEnd, upperEnd, color))
            objects.push(new Object3DTriangle(upperStart, downerStart, downerEnd, color))
        }
        for(let j = 0; j < radiusSegment; j++) {
            let colorShift = (radiusSegment - j) * radSize * 30
            color = rgbToHex(195 + colorShift, 195 + colorShift, 195 + colorShift)
            if ((i + j) % 2 == 1)
                color = rgbToHex(255 - colorShift, 255 - colorShift, 255 - colorShift)
            upperStart = LerpVector3(centerDownPoint, downStart, (j + 1) * radSize)
            upperEnd = LerpVector3(centerDownPoint, downEnd, (j + 1) * radSize)
            downerStart = LerpVector3(centerDownPoint, downStart, j * radSize)
            downerEnd = LerpVector3(centerDownPoint, downEnd, j * radSize)
            objects.push(new Object3DTriangle(upperStart, downerEnd, upperEnd, color))
            objects.push(new Object3DTriangle(upperStart, downerStart, downerEnd, color))
        }
        for(let j = 0; j < heightSegments; j++) {
            let fakeLight = upStart[0] / radius * 0.5 + 0.5
            let lightColor = parseInt((fakeLight * 0.6 + 0.4) * 255.0)
            let darkColor = parseInt((fakeLight * 0.6 + 0.4) * 195.0)
            color = rgbToHex(lightColor, lightColor, lightColor)
            if ((i + j) % 2 == 1)
                color = rgbToHex(darkColor, darkColor, darkColor)
            upperStart = LerpVector3(upStart, downStart, j * heightSize)
            upperEnd = LerpVector3(upEnd, downEnd, j * heightSize)
            downerStart = LerpVector3(upStart, downStart, (j + 1) * heightSize)
            downerEnd = LerpVector3(upEnd, downEnd, (j + 1) * heightSize)
            objects.push(new Object3DTriangle(upperStart, downerEnd, upperEnd, color))
            objects.push(new Object3DTriangle(upperStart, downerStart, downerEnd, color))
        }
    }
    return objects
}

function createNavigationCilynder(sides = 16, radius = 4.0, height = 7.0, navigationRadius = 0.5) {
    let navigationTriangles = []
	let radiusVectors = []
	for (let i = 0; i <= sides; i++) {
		let angle = 360.0 / sides * i
		var sideVector = MultiplyVector3ToMatrix3(CreateVector3(radius + navigationRadius, 0, 0), CreateMatrix3RotatedY(angle))
		radiusVectors.push(sideVector)
	}
	let centerUpPoint = CreateVector3(0, height * 0.5 + navigationRadius, 0)
    let centerDownPoint = CreateVector3(0, -height * 0.5 - navigationRadius, 0)
	for (let i = 0; i < sides; i++) {
		let upStart = AddVector3(centerUpPoint, radiusVectors[i])
		let upEnd = AddVector3(centerUpPoint, radiusVectors[i + 1])
		let downStart = AddVector3(centerDownPoint, radiusVectors[i])
		let downEnd = AddVector3(centerDownPoint, radiusVectors[i + 1])
		navigationTriangles.push([centerUpPoint, upStart, upEnd])
        navigationTriangles.push([centerDownPoint, downEnd, downStart])
        navigationTriangles.push([upStart, downEnd, upEnd])
        navigationTriangles.push([upStart, downStart, downEnd])
    }
    return navigationTriangles
}

function createRotationBody(points, sides = 16) { // points - Vector3 list
    let navigationTriangles = []
	let radiusVectors = []
	for (let i = 0; i <= sides; i++) {
		let angle = 360.0 / sides * i
		var sideVector = MultiplyVector3ToMatrix3(CreateVector3(radius + navigationRadius, 0, 0), CreateMatrix3RotatedY(angle))
		radiusVectors.push(sideVector)
	}
	let centerUpPoint = CreateVector3(0, height * 0.5 + navigationRadius, 0)
    let centerDownPoint = CreateVector3(0, -height * 0.5 - navigationRadius, 0)
	for (let i = 0; i < sides; i++) {
		let upStart = AddVector3(centerUpPoint, radiusVectors[i])
		let upEnd = AddVector3(centerUpPoint, radiusVectors[i + 1])
		let downStart = AddVector3(centerDownPoint, radiusVectors[i])
		let downEnd = AddVector3(centerDownPoint, radiusVectors[i + 1])
		navigationTriangles.push([centerUpPoint, upStart, upEnd])
        navigationTriangles.push([centerDownPoint, downEnd, downStart])
        navigationTriangles.push([upStart, downEnd, upEnd])
        navigationTriangles.push([upStart, downStart, downEnd])
    }
    return navigationTriangles
}

function rgbToHex(r, g, b, a = 255) {
    function componentToHex(c) {
        var hex = c.toString(16)
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a);
}// Navigation mesh class - to move point throw navigation
class NavigationMesh {
    constructor(navigationNodes = [], startNodeId = 0) {
        this.nodes = navigationNodes
        this.currentNode = this.nodes[startNodeId]
        this.heroPosition = this.currentNode.center
        this.heroVector = this.currentNode.unitTangent
        this.heroNormal = this.currentNode.unitNormal
        // find neigbhors
        for (let i = 0; i < navigationNodes.length; i++) {
            navigationNodes[i].name = i
        }
        for (let i = 0; i < navigationNodes.length; i++) {
            for (let j = 0; j < navigationNodes.length; j++) {
                if (i == j)
                    continue
                navigationNodes[i].TryAddNeigbhorNode(navigationNodes[j])
            }
        }
    }

    push (navigationTriangle) {
        this.triangles.push(navigationTriangle)
    }

    getRandomPosition () {
        let randomNode = this.nodes[getRandomInt(0, this.nodes.length)]
        return randomNode.center

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
    }

    moveHero(distance = 1.0) {
        let position = AddVector3(this.heroPosition, MultiplyVector3(this.heroVector, distance))
        if (this.currentNode.IsOutABEdge(position)) {
            if (this.currentNode.edgeNeigbhorAB != null) {
                this.moveTo(this.currentNode.edgeNeigbhorAB, this.currentNode.pointA, this.currentNode.pointB)
            }
            return
        }
        if (this.currentNode.IsOutBCEdge(position)) {
            if (this.currentNode.edgeNeigbhorBC != null) {
                this.moveTo(this.currentNode.edgeNeigbhorBC, this.currentNode.pointB, this.currentNode.pointC)
            }
            return
        }
        if (this.currentNode.IsOutCAEdge(position)) {
            if (this.currentNode.edgeNeigbhorCA != null) {
                this.moveTo(this.currentNode.edgeNeigbhorCA, this.currentNode.pointC, this.currentNode.pointA)
            }
            return
        }
        this.heroPosition = position
    }

    moveTo(node, edgePointA, edgePointB) {
        let newHeroPosition = this.FindPositionOnDifferentNode(this.currentNode, node, this.heroPosition, edgePointA, edgePointB)
        let newHeroDirectionInWorldSpace = this.FindPositionOnDifferentNode(this.currentNode, node, AddVector3(this.heroPosition, this.heroVector), edgePointA, edgePointB)
        let newHeroVector = SubstractVector3(newHeroDirectionInWorldSpace, newHeroPosition)
        this.currentNode = node
        this.heroPosition = newHeroPosition
        this.heroVector = newHeroVector
        this.heroNormal = this.currentNode.unitNormal
    }

    FindPositionOnDifferentNode(currentNode, newNode, position, edgePointA, edgePointB) {
        let vectorToEdge = SubstractVector3(position, edgePointA)
        let unitEdgeVector = NormalizeVector3(SubstractVector3(edgePointB, edgePointA))
        let distanceFromEdgeStart = DotProductVector3(unitEdgeVector, vectorToEdge)
        let currentNodeUnitEdgeNormal = CrossProductVector3(currentNode.unitNormal, unitEdgeVector)
        let cnextNodeUnitEdgeNormal = CrossProductVector3(newNode.unitNormal, unitEdgeVector)
        let distanceFromEdge = DotProductVector3(currentNodeUnitEdgeNormal, vectorToEdge)
        return AddVector3(AddVector3(edgePointA, MultiplyVector3(unitEdgeVector, distanceFromEdgeStart)), MultiplyVector3(cnextNodeUnitEdgeNormal, distanceFromEdge))
    }

    rotateHeroDirection(angle = 0.0) {
        this.heroVector = NormalizeVector3(MultiplyVector3ToMatrix3(this.heroVector, CreateRotationMatrix3(this.currentNode.unitNormal, angle)))
    }
}// nav node - for nav class
class NavigationNode {
    // https://mathinsight.org/distance_point_plane
    // plane formula
    // Ax + By + Cz + D = 0
    constructor (vectorA, vectorB, vectorC) {
        this.pointA = vectorA
        this.pointB = vectorB
        this.pointC = vectorC
        this.points = [vectorA, vectorB, vectorC]
        let center = FindMiddlePoint([vectorA, vectorB, vectorC])
        this.center = center
        let bc = SubstractVector3(vectorB, center)
        let cc = SubstractVector3(vectorC, center)
        let normal = CrossProductVector3(bc, cc)
        this.normal = normal
        this.unitNormal = NormalizeVector3(normal)
        this.unitTangent = NormalizeVector3(SubstractVector3(vectorB, center))
        this.unitBinormal = NormalizeVector3(CrossProductVector3(this.unitNormal, this.unitTangent))

        let vectorAB = SubstractVector3(vectorB, vectorA)
        let vectorBC = SubstractVector3(vectorC, vectorB)
        let vectorCA = SubstractVector3(vectorA, vectorC)
        this.edgePointAB = this.pointA
        this.edgeUnitAB = NormalizeVector3(vectorAB)
        this.edgeNormalAB = NormalizeVector3(CrossProductVector3(this.unitNormal, vectorAB))
        this.edgePointBC = this.pointB
        this.edgeUnitBC = NormalizeVector3(vectorBC)
        this.edgeNormalBC = NormalizeVector3(CrossProductVector3(this.unitNormal, vectorBC))
        this.edgePointCA = this.pointC
        this.edgeUnitCA = NormalizeVector3(vectorCA)
        this.edgeNormalCA = NormalizeVector3(CrossProductVector3(this.unitNormal, vectorCA))

        this.edgeNeigbhorAB = null
        this.edgeNeigbhorBC = null
        this.edgeNeigbhorCA = null
    }

    TryAddNeigbhorNode(otherNode) {
        for (let i = 0; i < otherNode.points.length; i++) {
            let otherPointA = otherNode.points[i]
            let otherPointB = otherNode.points[(i + 1) % otherNode.points.length]
            
            if (this.isCommonEdge(this.pointA, this.pointB, otherPointA, otherPointB)) {
                this.edgeNeigbhorAB = otherNode
                return
            }
            if (this.isCommonEdge(this.pointB, this.pointC, otherPointA, otherPointB)) {
                this.edgeNeigbhorBC = otherNode
                return
            }
            if (this.isCommonEdge(this.pointC, this.pointA, otherPointA, otherPointB)) {
                this.edgeNeigbhorCA = otherNode
                return
            }
        }
    }
    
    isCommonEdge(aStart, aEnd, bStart, bEnd) {
        return (
            (IsEqualVector3(aStart, bStart) && IsEqualVector3(aEnd, bEnd)) ||
            (IsEqualVector3(aStart, bEnd) && IsEqualVector3(aEnd, bStart))
        )
    }

    IsOutABEdge(point) {
        return (this.GetDistanceToEdge(point, this.edgePointAB, this.edgeNormalAB) < 0)
    }

    IsOutBCEdge(point) {
        return (this.GetDistanceToEdge(point, this.edgePointBC, this.edgeNormalBC) < 0)
    }

    IsOutCAEdge(point) {
        return (this.GetDistanceToEdge(point, this.edgePointCA, this.edgeNormalCA) < 0)
    }

    GetDistanceToEdge(point, edgePoint, edgeUnitNormal) {
        let offset = SubstractVector3(point, edgePoint)
        return DotProductVector3(edgeUnitNormal, offset)
    }

    GetDistanceToPlane(point) {
        let offset = SubstractVector3(point, this.center)
        return DotProductVector3(this.unitNormal, offset)
    }

    GetProjectionPoint(point) {
        let distance = this.GetDistanceToPlane(point)
        return AddVector3(point, MultiplyVector3(this.unitNormal, -distance))
    }
}// Apple logical controller
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
}// snake logic class
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
        this.enabled = true
    }

    rotate (angle) {
        this.rotationAngle = angle
    }

    setEnabled (enabled) {
        this.enabled = enabled
        this.heroView.enabled = enabled
        this.targetView.enabled = enabled
        for(let i = 0; i < this.tailView.length; i++) {
            this.tailView[i].enabled = enabled
        }
    }

	update (dt) {
		let moveSpeed = 7.0 * dt
        let rotationSpeed = this.rotationAngle * 140.0 * dt
		this.navigationMesh.moveHero(moveSpeed)
        this.navigationMesh.rotateHeroDirection(rotationSpeed)
        this.position = this.navigationMesh.heroPosition
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
            let newRadius = Math.min(0.5, (this.lenght - i) * 0.25)
            this.tailView[i].setRadius(newRadius)
        }
	}
}
const minDt = 1/30
let fps,
    time = timestamp()

let width = document.documentElement.clientWidth
let height = document.documentElement.clientHeight
let minSize = Math.min(width, height)
const selectLevelState = 0
const pauseState = 1
const gameState = 3
const startGameState = 4
const winState = 5
const loseState = 6
let state = selectLevelState

// init
let input = Input()
let canvasElement = document.getElementById('snake')
let canvas = canvasElement.getContext('2d')
let camera = new Camera(canvas)
SetCanvasSize(width, height)
let changeLevelAnim = 0
let changeLevelDirection = 1.0
let levelId = 0

let currentMatrix = CreateUnitMatrix3()
let rotationAxe = NormalizeVector3(CreateVector3(1.0, 1.0, 1.0))

let level = new Level()

let needShowDebugInfo = false
let needShowFPSInfo = false

function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime()
}

function render() {
    // clear
    canvas.fillStyle = '#000011'
    canvas.fillRect ( 0, 0, width, height)
    switch(state) {
        default:
        case selectLevelState:
            renderSelectLevelState()
            break
        case pauseState:
            renderPauseState()
            break
        case startGameState:
            renderStartGameState()
            break
        case gameState:
            renderGameState()
            break
        case winState:
            renderWinState()
            break
        case loseState:
            renderLoseState()
            break
    }
    // debug
    if (needShowFPSInfo) {
        canvas.textAlign = "end";
        canvas.fillText("FPS: " + Math.round(fps), width - 30, 50)
    }
}

function renderSelectLevelState() {
    camera.render()
    // info
    canvas.fillStyle = '#FFFFFF'
    canvas.textAlign = "center"; // "start", "end", "center", "left", "right"
    canvas.fillText("Level: " + (levelId + 1) , width * 0.5, height * 0.25 - minSize * 0.17)
    canvas.fillText("need apples: " + level.applesNeed , width * 0.5, height * 0.25 - minSize * 0.1)
    canvas.fillText("rocks on level: " + level.needRocks , width * 0.5, height * 0.25 - minSize * 0.03)
    drawEntranceIcon(width * 0.5, height - minSize * 0.1, minSize * 0.1)
    drawArrowLeft(minSize * 0.1, height - minSize * 0.1, minSize * 0.1)
    drawArrowRight(width - minSize * 0.1, height - minSize * 0.1, minSize * 0.1)
}

function drawEntranceIcon(x, y, size) {
    canvas.fillStyle = '#FFFFFF33'
    canvas.strokeStyle = '#FFFFFF11'
    
    canvas.beginPath()
    canvas.arc(x + size * 0.2, y, size * 0.6, Math.PI * 0.75, Math.PI * 1.25, true)
    canvas.arc(x + size * 0.2, y, size * 0.4, Math.PI * 1.25, Math.PI * 0.75)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
    canvas.beginPath()
    canvas.moveTo(x, y)
    canvas.lineTo(x - size * 0.4, y + size * 0.4)
    canvas.lineTo(x - size * 0.4, y + size * 0.12)
    canvas.lineTo(x - size * 0.76, y + size * 0.12)
    canvas.lineTo(x - size * 0.76, y - size * 0.12)
    canvas.lineTo(x - size * 0.4, y - size * 0.12)
    canvas.lineTo(x - size * 0.4, y - size * 0.4)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
}

function drawExitIcon(x, y, size) {
    canvas.fillStyle = '#FFFFFF33'
    canvas.strokeStyle = '#FFFFFF11'

    canvas.beginPath()
    canvas.arc(x + size * 0.2, y, size * 0.5, Math.PI * 0.838, Math.PI * 1.162, true)
    canvas.arc(x + size * 0.2, y, size * 0.3, Math.PI * 1.3, Math.PI * 0.7)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
    canvas.beginPath()
    canvas.moveTo(x + size * 0.04 - size * 0.8, y)
    canvas.lineTo(x + size * 0.04 - size * 0.4, y + size * 0.4)
    canvas.lineTo(x + size * 0.04 - size * 0.4, y + size * 0.12)
    canvas.lineTo(x + size * 0.04 - size * 0.04, y + size * 0.12)
    canvas.lineTo(x + size * 0.04 - size * 0.04, y - size * 0.12)
    canvas.lineTo(x + size * 0.04 - size * 0.4, y - size * 0.12)
    canvas.lineTo(x + size * 0.04 - size * 0.4, y - size * 0.4)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
}

function drawRestartIcon(x, y, size) {
    canvas.fillStyle = '#FFFFFF33'
    canvas.strokeStyle = '#FFFFFF11'
    
    canvas.beginPath()
    canvas.arc(x, y, size * 0.6, Math.PI * 0.5, Math.PI * 0.2)
    canvas.arc(x, y, size * 0.4, Math.PI * 0.2, Math.PI * 0.5, true)
    canvas.lineTo(x, y + size * 0.3)
    canvas.lineTo(x + size * 0.3, y + size * 0.5)
    canvas.lineTo(x, y + size * 0.7)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
}

function drawArrowRight(x, y, size) {
    canvas.fillStyle = '#FFFFFF33'
    canvas.strokeStyle = '#FFFFFF11'
    canvas.beginPath()
    canvas.moveTo(x + size * 0.5, y)
    canvas.lineTo(x, y + size * 0.5)
    canvas.lineTo(x - size * 0.5, y + size * 0.5)
    canvas.lineTo(x, y)
    canvas.lineTo(x - size * 0.5, y - size * 0.5)
    canvas.lineTo(x, y - size * 0.5)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
}

function drawArrowLeft(x, y, size) {
    canvas.fillStyle = '#FFFFFF33'
    canvas.strokeStyle = '#FFFFFF11'
    canvas.beginPath()
    canvas.moveTo(x - size * 0.5, y)
    canvas.lineTo(x, y + size * 0.5)
    canvas.lineTo(x + size * 0.5, y + size * 0.5)
    canvas.lineTo(x, y)
    canvas.lineTo(x + size * 0.5, y - size * 0.5)
    canvas.lineTo(x, y - size * 0.5)
    canvas.closePath()
    canvas.fill()
    canvas.stroke()
}

function drawMenuIcon(x, y, size) {
    canvas.fillStyle = '#FFFFFF33'
    canvas.strokeStyle = '#FFFFFF11'
    canvas.rect(x - size * 0.5, y + size * 0.3, size, size * 0.2)
    canvas.rect(x - size * 0.5, y - size * 0.1, size, size * 0.2)
    canvas.rect(x - size * 0.5, y - size * 0.5, size, size * 0.2)
    canvas.fill()
    canvas.stroke()
}

function renderWinState() {
    camera.render()
    // info
    canvas.fillStyle = '#FFFFFF'
    canvas.textAlign = "center"; // "start", "end", "center", "left", "right"
    canvas.fillText("YOU WIN!", width * 0.5, height * 0.1)
    //canvas.fillText("space to next level", width * 0.5, height * 0.85)
    //canvas.fillText("esc to level selection", width * 0.5, height * 0.95)
    drawExitIcon(minSize * 0.13, height - minSize * 0.1, minSize * 0.12)
    drawArrowRight(width - minSize * 0.1, height - minSize * 0.1, minSize * 0.1)
}

function renderLoseState() {
    camera.render()
    // info
    canvas.fillStyle = '#FFFFFF'
    canvas.textAlign = "center"; // "start", "end", "center", "left", "right"
    canvas.fillText("YOU LOSE!", width * 0.5, height * 0.1)
    drawExitIcon(minSize * 0.13, height - minSize * 0.1, minSize * 0.12)
    drawRestartIcon(width - minSize * 0.1, height - minSize * 0.1, minSize * 0.1)
}

function renderPauseState() {
    camera.render()
    // info
    canvas.fillStyle = '#FFFFFF'  // white
    canvas.textAlign = "center"; // "start", "end", "center", "left", "right"
    canvas.fillText("PAUSE ", width * 0.5, height * 0.5 - minSize * 0.4)
    canvas.fillText("Q to quit ", width * 0.5, height * 0.5 + minSize * 0.4)
    canvas.fillText("Esc to continue ", width * 0.5, height * 0.5 + minSize * 0.45)
}

function renderStartGameState() {
    camera.render()
    let alpha = parseInt((Math.max(0.0, 1.0 - Math.abs(changeLevelAnim * 3.0 - 1.5))) * 255.0)
    canvas.fillStyle = rgbToHex(0, 0, 0, alpha)
    canvas.fillRect ( 0, 0, width, height)
}

function renderGameState() {
    camera.render()
    // info
    canvas.fillStyle = '#FFFFFF'  // white
    canvas.textAlign = "start"; // "end", "center", "left", "right"
    canvas.textBaseline = "middle"; // textBaseline = "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom";
    canvas.fillText(level.applesCount + "/" + level.applesNeed, minSize * 0.15, minSize * 0.1)
    drawApple(minSize * 0.1, minSize * 0.1, minSize * 0.046)
    for(let i = 0; i < level.livesCount; i++) {
        drawLiveHeart(width * 0.5 + (i - 1) * minSize * 0.05, height - minSize * 0.1, minSize * 0.05)
    }
    drawMenuIcon(width - minSize * 0.1, minSize * 0.1, minSize * 0.08)
    drawArrowLeft(minSize * 0.1, height - minSize * 0.1, minSize * 0.1)
    drawArrowRight(width - minSize * 0.1, height - minSize * 0.1, minSize * 0.1)
}

function drawLiveHeart(x, y, size = 10.0) {
    canvas.fillStyle = '#FF0000'
    canvas.beginPath()
    canvas.moveTo(x, y + size * 0.5);
    canvas.arc(x - size * 0.175, y, size * 0.25, Math.PI * 0.75, Math.PI * 1.75);
    canvas.arc(x + size * 0.175, y, size * 0.25, Math.PI * 1.25, Math.PI * 2.25);
    canvas.closePath()
    canvas.fill()
}

function drawApple(x, y, size = 10.0) {
    canvas.fillStyle = '#33FF33'
    canvas.beginPath()
    canvas.arc(x, y, size * 0.5, 0.0, Math.PI * 2.0);
    canvas.closePath()
    canvas.fill()
}

function update(dt) {
    switch(state) {
        default:
        case selectLevelState:
            updateSelectLevelState(dt)
            break
        case startGameState:
            updateStartGameState(dt)
            break
        case pauseState:
            updatePauseState(dt)
            break
        case winState:
            updateWinState(dt)
            break
        case loseState:
            updateLoseState(dt)
            break
        case gameState:
            updateGameState(dt)
            break
    }
    if (input.keyDown[115]) { // F4
        needShowFPSInfo = !needShowFPSInfo
        console.log(Camera.instance.objects.length)
    }
}

function updateSelectLevelState(dt) {
    if (changeLevelAnim > 0) {
        const changeSpeed = 3.0
        changeLevelAnim -= changeSpeed * dt
        if (changeLevelAnim < 0)
            changeLevelAnim = 0
        let anim = (changeLevelAnim - 0.5) * 2.0
        if (anim > 0) {
            camera.cameraPosition = CreateVector3((1 - anim * anim) * 30.0 * changeLevelDirection, 0.0, 20.0)
        } else {
            if (level.id != levelId) {
                level.setLevel(levelId)
            }
            camera.cameraPosition = CreateVector3((-1 + anim * anim) * 30.0 * changeLevelDirection, 0.0, 20.0)
        }
        return
    }
    if (input.keyDown[32]) { // space
        setState(startGameState)
    }
    if (input.keyPressed[65] || input.keyPressed[37]) { // LEFT | A
        if (levelId > 0) {
            changeLevelAnim = 1.0
            changeLevelDirection = -1.0
            levelId -= 1
        }
    }
    if (input.keyPressed[68] || input.keyPressed[39]) { // RIGHT | D
        changeLevelAnim = 1.0
        changeLevelDirection = 1.0
        levelId += 1
    }
    if (input.isTouchInRect(0, height * 0.5, width * 0.3, height)) {
        if (levelId > 0) {
            changeLevelAnim = 1.0
            changeLevelDirection = -1.0
            levelId -= 1
        }
    }
    if (input.isTouchInRect(width * 0.7, height * 0.5, width, height)) {
        changeLevelAnim = 1.0
        changeLevelDirection = 1.0
        levelId += 1
    }
    if (input.isTouchDownInRect(width * 0.4, height * 0.5, width * 0.6, height)) {
        setState(startGameState)
    }
    level.update(dt)
    currentMatrix = MultiplyMatrix3(currentMatrix, CreateRotationMatrix3(rotationAxe, 20.0 * dt))
    rotationAxe = NormalizeVector3(
        CreateVector3(
            rotationAxe[0] * 100.0 + (Math.random() * 2.0 - 1),
            rotationAxe[1] * 100.0 + (Math.random() * 2.0 - 1),
            rotationAxe[2] * 100.0 + (Math.random() * 2.0 - 1)))
    camera.worldMatrix = currentMatrix
    camera.position = MultiplyVector3(camera.position, 1.0 - 1.0 * dt)

    if (input.keyDown[113]) { // F2
        needShowDebugInfo = !needShowDebugInfo
        level.showDebugInfo(needShowDebugInfo)
    }
}

function updateWinState(dt) {
    if (changeLevelAnim > 0) {
        const changeSpeed = 3.0
        changeLevelAnim -= changeSpeed * dt
        if (changeLevelAnim < 0) {
            changeLevelAnim = 0
        }
        let anim = (changeLevelAnim - 0.5) * 2.0
        if (anim > 0) {
            camera.cameraPosition = CreateVector3((1 - anim * anim) * 30.0 * changeLevelDirection, 0.0, 15.0)
        } else {
            if (level.id != levelId) {
                level.setLevel(levelId)
            }
            camera.cameraPosition = CreateVector3((-1 + anim * anim) * 30.0 * changeLevelDirection, 0.0, 15.0)
        }
        return
    }
    if (level.id == levelId) {
        setState(startGameState)
        return
    }
    if (input.keyDown[27]) { // esc
        levelId -= 1
        setState(selectLevelState)
    }
    if (input.keyDown[32]) { // space
        changeLevelAnim = 1.0
        changeLevelDirection = 1.0
    }
    if (input.keyDown[65] || input.keyDown[37]) { // LEFT | A
        levelId -= 1
        setState(selectLevelState)
    }
    if (input.keyDown[68] || input.keyDown[39]) { // RIGHT | D
        changeLevelAnim = 1.0
        changeLevelDirection = 1.0
    }
    if (input.isTouchDownInRect(0, height * 0.5, width * 0.3, height)) { // bottom left screen space touch
        levelId -= 1
        setState(selectLevelState)
    }
    if (input.isTouchDownInRect(width * 0.7, 0, width, height)) { // top right screen space touch
        changeLevelAnim = 1.0
        changeLevelDirection = 1.0
    }
    level.update(dt)
}

function updateStartGameState(dt) {
    if (changeLevelAnim > 0) {
        const changeSpeed = 1.0
        let next = changeLevelAnim - changeSpeed * dt
        if (next <= 0.5 && changeLevelAnim > 0.5) {
            level.setLevel(levelId)
        }
        changeLevelAnim = next
        if (changeLevelAnim < 0)
            changeLevelAnim = 0
        if (changeLevelAnim < 0.5) {
            level.update(dt)
            camera.position = level.snake.position
            let angles = getCameraRotation(level.snake.position)
            camera.worldMatrix = MultiplyMatrix3(CreateRotationMatrix3(CreateVector3(1.0), angles[0]), CreateRotationMatrix3(CreateVector3(0.0, 1.0), angles[1]))
        }
    } else {
        setState(gameState)
    }
}

function updateLoseState(dt) {
    if (input.keyDown[27]) { // esc
        setState(selectLevelState)
    }
    if (input.keyDown[32]) { // space
        setState(startGameState)
    }
    if (input.keyDown[65] || input.keyDown[37]) { // LEFT | A
        setState(selectLevelState)
    }
    if (input.keyDown[68] || input.keyDown[39]) { // RIGHT | D
        setState(startGameState)
    }
    if (input.isTouchDownInRect(0, height * 0.5, width * 0.3, height)) { // bottom left screen space touch
        setState(selectLevelState)
    }
    if (input.isTouchDownInRect(width * 0.7, 0, width, height)) { // top left screen space touch
        setState(selectLevelState)
    }
    level.update(dt)
}

function updatePauseState(dt) {
    if (input.keyDown[27]) { // esc
        setState(gameState)
    }
    if (input.isTouchDownInRect(width * 0.7, 0, width, height * 0.3)) { // top right screen space touch
        setState(gameState)
    }
    if (input.keyDown[81]) { // Q
        setState(selectLevelState)
    }
}

function updateGameState(dt) {
    // control
    // UP = 38
    // DOWN = 40
    // LEFT = 37
    // RIGHT = 39
    // W = 87
    // S = 83
    // A = 65
    // D = 68
    // space = 32
    if (input.keyDown[27]) { // esc
        setState(pauseState)
    }
    if (input.isTouchDownInRect(width * 0.7, 0, width, height * 0.3)) { // top right screen space touch
        setState(pauseState)
    }
    let rotateAngle = 0
    if (input.keyPressed[65] || input.keyPressed[37]) { // LEFT | A
        rotateAngle = 1.0
    }
    if (input.keyPressed[68] || input.keyPressed[39]) { // RIGHT | D
        rotateAngle = -1.0
    }
    if (input.isTouchInRect(0, 0, width * 0.5, height)) {
        rotateAngle = 1.0 // left
    }
    if (input.isTouchInRect(width * 0.5, 0, width, height)) {
        rotateAngle = -1.0 // right
    }
    level.snake.rotate(rotateAngle)
    level.snake.update(dt)

    level.update(dt)

    camera.position = level.snake.position
    let angles = getCameraRotation(level.snake.position)
    camera.worldMatrix = MultiplyMatrix3(CreateRotationMatrix3(CreateVector3(1.0), angles[0]), CreateRotationMatrix3(CreateVector3(0.0, 1.0), angles[1]))
    if (input.keyDown[113]) { // F2
        needShowDebugInfo = !needShowDebugInfo
        level.showDebugInfo(needShowDebugInfo)
    }
    if (level.applesNeed <= level.applesCount) {
        setState(winState)
    }
    if (level.livesCount <= 0) {
        setState(loseState)
    }
}

function getCameraRotation(position) {
    let cameraVector = NormalizeVector3(position)
    let XZVector = NormalizeVector2([cameraVector[0], cameraVector[2]])
    // let YNVector = NormalizeVector2([cameraVector[1], Math.sqrt(cameraVector[0], cameraVector[2])])
    let baseAngle = Math.acos(XZVector[0]) / Math.PI * 180.0
    let upAngle = Math.acos(cameraVector[1]) / Math.PI * 180.0 - 90.0
    if (cameraVector[2] > 0) {
        baseAngle += 90.0
    } else {
        baseAngle = 90.0 - baseAngle
    }
    return [upAngle, baseAngle]
}

function setState(newState) {
    switch(newState) {
        default:
        case selectLevelState:
            currentMatrix = camera.worldMatrix
            level.hideLevelDetails()
            break
        case startGameState:
            changeLevelAnim = 1.0
            break
        case pauseState:
            break
        case gameState:
            if (state != pauseState) {
                for(let i = 0; i < 30; i++) {
                    level.snake.update(1.0/30.0)
                }
                level.start()
            }
            break
        case winState:
            level.hideLevelDetails()
            levelId += 1
            break
        case loseState:
            level.hideLevelDetails()
            break
    }
    state = newState
}

function frame() {
    let now = timestamp()
    let delta = (now - time) / 1000.0
    fps = 1.0 / delta
    if (delta > minDt) {
        delta = minDt
    }
    update(delta)
    render()
    time = now
    requestAnimationFrame(frame)
    if (width != document.documentElement.clientWidth || height != document.documentElement.clientHeight) {
        width = document.documentElement.clientWidth
        height = document.documentElement.clientHeight
        minSize = Math.min(width, height)
        SetCanvasSize(width, height)
    }
    input.updateInput()
}
requestAnimationFrame(frame)

function SetCanvasSize(width, height) {
    canvasElement.width = width
    canvasElement.height = height

    camera.setSize(width, height)

    let fontSize = 32.0
    if (height > width) {
        fontSize *= height / width
    }
    canvas.font = parseInt(fontSize) + "pt Arial"
}
