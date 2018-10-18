class Camera {
    constructor(width, height) {
        this.screenWidht = width;
        this.screenHeight = height;
        this.worldMatrix = CreateUnitMatrix3()
        this.projectionMatrix = CreateProjectionMatrix4(1.0, 1.0, 1.0, 2.0)
        this.centerOffcet = CreateVector3(width * 0.5, height * 0.5)
        this.cameraPosition = CreateVector3(0.0, 0.0, 20.0)
        this.position = CreateVector3(0.0, 0.0, 0.0)
    }

    worldToScreenVector3 (point) {
        let worldPoint = point
        worldPoint = AddVector3(worldPoint, this.position)
        worldPoint = MultiplyVector3ToMatrix3(worldPoint, this.worldMatrix)
        worldPoint = AddVector3(worldPoint, this.cameraPosition)
        worldPoint = MultiplyVector3ToMatrix4(worldPoint, this.projectionMatrix)
        worldPoint = MultiplyVector3(worldPoint, 500.0)
        return AddVector3(worldPoint, this.centerOffcet)
    }

    worldToScreenVector3WithOffcet (point, offcet) {
        let worldPoint = point
        worldPoint = AddVector3(worldPoint, this.position)
        worldPoint = MultiplyVector3ToMatrix3(worldPoint, this.worldMatrix)
        worldPoint = AddVector3(worldPoint, this.cameraPosition)
        worldPoint = AddVector3(worldPoint, offcet)
        worldPoint = MultiplyVector3ToMatrix4(worldPoint, this.projectionMatrix)
        worldPoint = MultiplyVector3(worldPoint, 500.0)
        return AddVector3(worldPoint, this.centerOffcet)
    }
}