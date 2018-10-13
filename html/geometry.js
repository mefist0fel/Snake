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

function Vector3Length(v) {
	return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
}

function NormalizeVector3(v) {
	var dist = 1.0 / Vector2Length(v);
	if (dist == Infinity) {
		dist = Number.MAX_VALUE;
	}
	if (dist == -Infinity) {
		dist = Number.MIN_VALUE;
	}
	return MultiplyVector3(v, dist);
}

// Matrix 3 * 3 functions
function CreateUnitMatrix3() {
	return [     //  ids
		1, 0, 0, // 0 1 2
		0, 1, 0, // 3 4 5
		0, 0, 1  // 6 7 8
	]
}

function CreateRotationMatrix3(axeVector, angle) { // axe vector must be unit
	var x = axeVector[0]
	var y = axeVector[1]
	var z = axeVector[2]
	var radian = angle / 180.0 * Math.PI
	var c = Math.cos(radian)
	var s = Math.sin(radian)
	var q = (1.0 - c)
	return [
		c + q * x * x,       q * x * y - s * z,   q * x * z + s * y,
		q * y * x + s * z,   c + q * y * y,       q * y * z - s * x,
		q * z * x - s * y,   q * z * y - s * x,   c + q * z * z
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

// Matrix 4 * 4 functions
function CreateUnitMatrix4() {
	return [         //  ids
		1, 0, 0, 0,  //  0  1  2  3
		0, 1, 0, 0,  //  4  5  6  7
		0, 0, 1, 0,  //  8  9 10 11
		0, 0, 0, 1   // 12 13 14 15
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
	return [
		v[0] * m[ 0] + v[1] * m[ 4] + v[2] * m[ 8] + 1.0 * m[12],
		v[0] * m[ 1] + v[1] * m[ 5] + v[2] * m[ 9] + 1.0 * m[13],
		v[0] * m[ 2] + v[1] * m[ 6] + v[2] * m[10] + 1.0 * m[14]
	]
}

function CreateProjectionMatrix4(topY = 100.0, rightX = 100.0, nearZ = 1.0, farZ = 100.0) {
	// http://www.songho.ca/opengl/gl_projectionmatrix.html
	var n = nearZ
	var f = farZ
	var t = topY
	var r = rightX
	var g = -(f + n) / (f - n)
	var h = (-2.0 * f * n) / (f - n)
	return [
		n/r,   0,   0,   0,
		  0, n/t,   0,   0,
		  0,   0,   g,   h,
		  0,   0,  -1,   1
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