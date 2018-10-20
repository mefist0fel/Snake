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

function Vector2Length(v) {
	return Math.sqrt(v[0] * v[0] + v[1] * v[1])
}

function NormalizeVector2(v) {
	var dist = 1.0 / Vector2Length(v);
	if (dist == Infinity) {
		dist = Number.MAX_VALUE;
	}
	if (dist == -Infinity) {
		dist = Number.MIN_VALUE;
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
	return Math.acos(DotProductVector3(NormalizeVector3(a), NormalizeVector3(b))) / Math.PI * 180.0
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
		dist = Number.MAX_VALUE
	}
	if (dist == Infinity) {
		dist = Number.MAX_VALUE
	}
	if (dist == -Infinity) {
		dist = Number.MIN_VALUE
	}
	return MultiplyVector3(v, dist)
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
	var a = angle / 180.0 * Math.PI
	var ca = Math.cos(a)
	var sa = Math.sin(a)
	return [
		1,  0,  0,
		0, ca,-sa,
		0, sa, ca
	]
}

function CreateMatrix3RotatedY(angle = 0.0) {
	// angles in radians
	var a = angle / 180.0 * Math.PI
	var ca = Math.cos(a)
	var sa = Math.sin(a)
	return [
		 ca,  0, sa,
		  0,  1,  0,
		-sa,  0, ca
	]
}

function CreateMatrix3RotatedZ(angle = 0.0) {
	// angles in radians
	var a = angle / 180.0 * Math.PI
	var ca = Math.cos(a)
	var sa = Math.sin(a)
	return [
		 ca,-sa, 0,
		 sa, ca, 0,
		  0,  0, 1
	]
}

function CreateEulerMatrix3(xAngle = 0.0, yAngle = 0.0, zAngle = 0.0) {
	// angles in radians
	var a = xAngle / 180.0 * Math.PI
	var b = yAngle / 180.0 * Math.PI
	var y = zAngle / 180.0 * Math.PI
	var ca = Math.cos(a)
	var cb = Math.cos(b)
	var cy = Math.cos(y)
	var sa = Math.sin(a)
	var sb = Math.sin(b)
	var sy = Math.sin(y)
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
	let radian = angle / 180.0 * Math.PI
	let c = Math.cos(radian)
	let s = Math.sin(radian)
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
}