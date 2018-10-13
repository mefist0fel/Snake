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

// function CreateEulerMatrix(x, y, z) {
//	return [
//		Math.cos(x) * Math.cos(z) - Math.sin(x) * Math.cos(y) * Math.sin(z),// 
//	]
//}

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


// basic vector2[x, y] functons
function vAdd(av, bv) {
	return [av[0] + bv[0], av[1] + bv[1],  av[2] + bv[2]];
}
function vSub(av, bv) {
	return [av[0] - bv[0], av[1] - bv[1], av[2] - bv[2]];
}
function magnitude(va, vb) {
	return Math.sqrt((va[0] - vb[0]) * (va[0] - vb[0]) + (va[1] - vb[1]) * (va[1] - vb[1]));
}
function vNorm(v) { // normilize
	var dist = 1 / magnitude(v, [0, 0, 0]);
	if (dist <= 0) {
		dist = 0.0000000001;
	}
	if (dist == Infinity) {
		dist = Number.MAX_VALUE;
	}
	if (dist == -Infinity) {
		dist = Number.MIN_VALUE;
	}
	return vMult(v, dist);
}
function vMult(v, m) { // m - float
	return [v[0] * m, v[1] * m, v[2] * m];
}
function vInRect(v, rect) { // rect is arr[4] description of AABB rect
	return (v[0] >= rect[0] && v[0] <= rect[2] && v[1] >= rect[1] && v[1] <= rect[3]);
}