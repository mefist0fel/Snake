function createCube(size = 10.0) {
    let objects = []
    let edgeSize = size * 0.5
    let color = '#FFFFFF'
    // forw
    let af = CreateVector3(-edgeSize, -edgeSize, edgeSize)
    let bf = CreateVector3( edgeSize, -edgeSize, edgeSize)
    let cf = CreateVector3( edgeSize,  edgeSize, edgeSize)
    let df = CreateVector3(-edgeSize,  edgeSize, edgeSize)
    objects.push(new Object3DTriangle(af, bf, cf, color))
    objects.push(new Object3DTriangle(af, cf, df, color))
    // backw
    let ab = CreateVector3(-edgeSize, -edgeSize, -edgeSize)
    let bb = CreateVector3( edgeSize, -edgeSize, -edgeSize)
    let cb = CreateVector3( edgeSize,  edgeSize, -edgeSize)
    let db = CreateVector3(-edgeSize,  edgeSize, -edgeSize)
    objects.push(new Object3DTriangle(ab, cb, bb, color))
    objects.push(new Object3DTriangle(ab, db, cb, color))
    color = '#DDDDDD'
    // top
    let at = CreateVector3(-edgeSize, edgeSize, -edgeSize)
    let bt = CreateVector3( edgeSize, edgeSize, -edgeSize)
    let ct = CreateVector3( edgeSize, edgeSize,  edgeSize)
    let dt = CreateVector3(-edgeSize, edgeSize,  edgeSize)
    objects.push(new Object3DTriangle(at, ct, bt, color))
    objects.push(new Object3DTriangle(at, dt, ct, color))
    // down
    let ad = CreateVector3(-edgeSize, -edgeSize, -edgeSize)
    let bd = CreateVector3( edgeSize, -edgeSize, -edgeSize)
    let cd = CreateVector3( edgeSize, -edgeSize,  edgeSize)
    let dd = CreateVector3(-edgeSize, -edgeSize,  edgeSize)
    objects.push(new Object3DTriangle(ad, bd, cd, color))
    objects.push(new Object3DTriangle(ad, cd, dd, color))
    color = '#AAAAAA'
    // left
    let al = CreateVector3(-edgeSize, -edgeSize, -edgeSize)
    let bl = CreateVector3(-edgeSize,  edgeSize, -edgeSize)
    let cl = CreateVector3(-edgeSize,  edgeSize,  edgeSize)
    let dl = CreateVector3(-edgeSize, -edgeSize,  edgeSize)
    objects.push(new Object3DTriangle(al, cl, bl, color))
    objects.push(new Object3DTriangle(al, dl, cl, color))
    // right
    let ar = CreateVector3( edgeSize, -edgeSize, -edgeSize)
    let br = CreateVector3( edgeSize,  edgeSize, -edgeSize)
    let cr = CreateVector3( edgeSize,  edgeSize,  edgeSize)
    let dr = CreateVector3( edgeSize, -edgeSize,  edgeSize)
    objects.push(new Object3DTriangle(ar, br, cr, color))
    objects.push(new Object3DTriangle(ar, cr, dr, color))
    return objects
}

function createDrawedCube(size = 5) {
	let objects = []
	for (let i = -size; i < size; i++) {
	 	for (let j = -size; j < size; j++) {
            let color = '#FFFFFF'
            if ((parseInt(size + i * 0.5 + 0.5) + parseInt(size + j * 0.5 + 0.5)) % 2 == 1)
                color = '#666666'
            // forw
            let af = CreateVector3( i    , j    , size)
            let bf = CreateVector3( i + 1, j    , size)
            let cf = CreateVector3( i + 1, j + 1, size)
            let df = CreateVector3( i    , j + 1, size)
            objects.push(new Object3DTriangle(af, bf, cf, color))
            objects.push(new Object3DTriangle(af, cf, df, color))
            // backw
            let ab = CreateVector3( i    , j    ,-size)
            let bb = CreateVector3( i + 1, j    ,-size)
            let cb = CreateVector3( i + 1, j + 1,-size)
            let db = CreateVector3( i    , j + 1,-size)
            objects.push(new Object3DTriangle(ab, cb, bb, color))
            objects.push(new Object3DTriangle(ab, db, cb, color))
            // top
            let at = CreateVector3( i    , size, j    )
            let bt = CreateVector3( i + 1, size, j    )
            let ct = CreateVector3( i + 1, size, j + 1)
            let dt = CreateVector3( i    , size, j + 1)
            objects.push(new Object3DTriangle(at, ct, bt, color))
            objects.push(new Object3DTriangle(at, dt, ct, color))
            // down
            let ad = CreateVector3( i    , -size, j    )
            let bd = CreateVector3( i + 1, -size, j    )
            let cd = CreateVector3( i + 1, -size, j + 1)
            let dd = CreateVector3( i    , -size, j + 1)
            objects.push(new Object3DTriangle(ad, bd, cd, color))
            objects.push(new Object3DTriangle(ad, cd, dd, color))
            // left
            let al = CreateVector3(-size, i    , j    )
            let bl = CreateVector3(-size, i + 1, j    )
            let cl = CreateVector3(-size, i + 1, j + 1)
            let dl = CreateVector3(-size, i    , j + 1)
            objects.push(new Object3DTriangle(al, cl, bl, color))
            objects.push(new Object3DTriangle(al, dl, cl, color))
            // right
            let ar = CreateVector3( size, i    , j    )
            let br = CreateVector3( size, i + 1, j    )
            let cr = CreateVector3( size, i + 1, j + 1)
            let dr = CreateVector3( size, i    , j + 1)
            objects.push(new Object3DTriangle(ar, br, cr, color))
            objects.push(new Object3DTriangle(ar, cr, dr, color))
        }
    }
    return objects
}

function createSphere(radius = 10.0, segments = 7) {
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
                let color = '#FFFFFF'
                if ((i + j) % 2 == 1)
                    color = '#666666'
                
                // forw
                let af = createNormalizedPoint(     i,     j, size, radius, sidesRotationMatrix[sideId])
                let bf = createNormalizedPoint( i + 1,     j, size, radius, sidesRotationMatrix[sideId])
                let cf = createNormalizedPoint( i + 1, j + 1, size, radius, sidesRotationMatrix[sideId])
                let df = createNormalizedPoint(     i, j + 1, size, radius, sidesRotationMatrix[sideId])
                objects.push(new Object3DTriangle(af, bf, cf, color))
                objects.push(new Object3DTriangle(af, cf, df, color))
            }
        }
    }
    return objects
}

function createCilynder(sides = 16, radius = 5.0, height = 10.0) {
	let objects = []
	let radiusVectors = []
	for (let i = 0; i <= sides; i++) {
		let angle = 360.0 / sides * i
		var sideVector = MultiplyVector3ToMatrix3(CreateVector3(radius, 0, 0), CreateMatrix3RotatedY(angle))
		radiusVectors.push(sideVector)
	}
	let centerUpPoint = CreateVector3(0, height * 0.5, 0)
	let centerDownPoint = CreateVector3(0, -height * 0.5, 0)
	for (let i = 0; i < sides; i++) {
		let color = '#FFFFFF'
		if (i % 2 == 1)
			color = '#666666'
		let upStart = AddVector3(centerUpPoint, radiusVectors[i])
		let upEnd = AddVector3(centerUpPoint, radiusVectors[i + 1])
		let downStart = AddVector3(centerDownPoint, radiusVectors[i])
		let downEnd = AddVector3(centerDownPoint, radiusVectors[i + 1])
		objects.push(new Object3DTriangle(centerUpPoint, upStart, upEnd, color))
		objects.push(new Object3DTriangle(centerDownPoint, downEnd, downStart, color))
		objects.push(new Object3DTriangle(upStart, downEnd, upEnd, color))
		objects.push(new Object3DTriangle(upStart, downStart, downEnd, color))
    }
    return objects
}

function createDotCube(size = 5) {
    let objects = []
    for (let i = -size; i <= size; i++) {
        for (let j = -size; j <= size; j++) {
            objects.push(createObject( i, j, size))
            objects.push(createObject( i, j,-size))
            objects.push(createObject( i, size, j))
            objects.push(createObject( i,-size, j))
            objects.push(createObject( size, i, j))
            objects.push(createObject(-size, i, j))
        }
    }
    return objects
}

function createObject(x, y, z) {
    let position = CreateVector3(x, y, z)
    var r = parseInt((x + 5) * 255 / 10)
    var g = parseInt((y + 5) * 255 / 10)
    var b = parseInt((z + 5) * 255 / 10)
    let color = rgbToHex(r, g, b)
    return new Object3D(position, 0.5, color)
}

function rgbToHex(r, g, b) {
    function componentToHex(c) {
        var hex = c.toString(16)
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}