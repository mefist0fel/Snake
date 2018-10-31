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
}