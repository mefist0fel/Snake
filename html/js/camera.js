// 3d camera controller
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
}