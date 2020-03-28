// Level generation class
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
                navigationTriangles = CreateNavigationCube(8.0)
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
				this.apples[i].remove(this.getRandomPosition())
        		this.snake.lenght += 0.5
				this.applesCount += 1
			}
		}
		for(let i = 0; i < this.rocks.length; i++) {
			if (DistanceVector3(this.navigationMesh.heroPosition, this.rocks[i].position) < 1.0) {
				this.rocks[i].remove(this.getRandomPosition())
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

    getRandomPosition() {
        let randomPosition
        do {
            randomPosition = this.navigationMesh.getRandomPosition()
        } while (this.hasCollisions(randomPosition))
        return randomPosition;
    }

    hasCollisions(position) {
		for(let i = 0; i < this.apples.length; i++) {
			if (DistanceVector3(position, this.apples[i].position) < 1.0) {
				return true
			}
		}
		for(let i = 0; i < this.rocks.length; i++) {
			if (DistanceVector3(position, this.rocks[i].position) < 1.0) {
				return true
			}
        }
        return false
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

function CreateNavigationCube(size = 9.0, navigationRadius = 0.5) {
    let sidesRotationMatrix = [
        CreateMatrix3RotatedX(0.0),
        CreateMatrix3RotatedX(90.0),
        CreateMatrix3RotatedX(180.0),
        CreateMatrix3RotatedX(270.0),
        CreateMatrix3RotatedY(90.0),
        CreateMatrix3RotatedY(270.0)
    ]
    let getShift = function(i) {
        if (i >= 3) {
            return (i - 3) * 0.5
        } else {
            return (2 - i) * -0.5
        }
    }
    let getOffcet = function(i, s) {
        if (i >= 3) {
            return s
        } else {
            return -s
        }
    }
    let id = function(i, j) {
        return i + j * 6
    }
    let mesh = []
    for(let sideId = 0; sideId < sidesRotationMatrix.length; sideId ++) {
        let points = []
        let point = null
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                point = NormalizeVector3(CreateVector3(getShift(i), getShift(j), 1.0))
                point = MultiplyVector3(point, navigationRadius)
                point = AddVector3(point, CreateVector3(getOffcet(i, size * 0.5), getOffcet(j, size * 0.5), size * 0.5))
                points[id(i, j)] = MultiplyVector3ToMatrix3(point, sidesRotationMatrix[sideId])
            }
        }
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                mesh.push([points[id(i, j)], points[id(i + 1, j)], points[id(i + 1, j + 1)]])
                mesh.push([points[id(i, j)], points[id(i + 1, j + 1)], points[id(i, j + 1)]])
            }
        }
    }

    return mesh
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
    let cilynderRotationPoints = [
        [radius, height * 0.5 + navigationRadius],
        [radius + navigationRadius * 0.5, height * 0.5 + navigationRadius * 0.85],
        [radius + navigationRadius * 0.85, height * 0.5 + navigationRadius * 0.5],
        [radius + navigationRadius, height * 0.5],
        [radius + navigationRadius, - height * 0.5],
        [radius + navigationRadius * 0.85, -height * 0.5 - navigationRadius * 0.5],
        [radius + navigationRadius * 0.5, -height * 0.5 - navigationRadius * 0.85],
        [radius, -height * 0.5 - navigationRadius]
    ]
	let radiusVectors = []
	for (let i = 0; i <= sides; i++) {
		let angle = 360.0 / sides * i
		var sideVector = MultiplyVector3ToMatrix3(CreateVector3(1.0, 0, 0), CreateMatrix3RotatedY(angle))
		radiusVectors.push(sideVector)
	}
	let centerUpPoint = CreateVector3(0, height * 0.5 + navigationRadius, 0)
    let centerDownPoint = CreateVector3(0, -height * 0.5 - navigationRadius, 0)
    let navigationTriangles = []
	for (let i = 0; i < sides; i++) {
        let rotationStartPoints = []
        let rotationEndPoints = []
        for(let j = 0; j < cilynderRotationPoints.length; j ++) {
            rotationStartPoints.push(
                AddVector3(
                    CreateVector3(0, cilynderRotationPoints[j][1]),
                    MultiplyVector3(
                        radiusVectors[i],
                        cilynderRotationPoints[j][0])))
                        rotationEndPoints.push(
                AddVector3(
                    CreateVector3(0, cilynderRotationPoints[j][1]),
                    MultiplyVector3(
                        radiusVectors[i + 1],
                        cilynderRotationPoints[j][0])))
        }
        let eid = rotationStartPoints.length - 1
		navigationTriangles.push([centerUpPoint, rotationStartPoints[0], rotationEndPoints[0]])
        navigationTriangles.push([centerDownPoint, rotationEndPoints[eid], rotationStartPoints[eid]])
        for(let j = 0; j < cilynderRotationPoints.length - 1; j ++) {
            navigationTriangles.push([rotationStartPoints[j], rotationEndPoints[j + 1], rotationEndPoints[j]])
            navigationTriangles.push([rotationStartPoints[j], rotationStartPoints[j + 1], rotationEndPoints[j + 1]])
        }
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