class NavigationMesh {
    constructor(navigationNodes = [], startNodeId = 0) {
        this.nodes = navigationNodes
        this.currentNode = this.nodes[startNodeId]
        this.heroPosition = this.currentNode.center
        this.heroVector = this.currentNode.unitTangent
        // find neigbhors
    }

    push (navigationTriangle) {
        this.triangles.push(navigationTriangle)
    }

    moveHero(distance = 1.0) {
        this.heroPosition = AddVector3(this.heroPosition, MultiplyVector3(this.heroVector, distance))
    }

    rotateHeroDirection(angle = 0.0) {
        this.heroVector = MultiplyVector3ToMatrix3(this.heroVector, CreateRotationMatrix3(this.currentNode.unitNormal, angle))
    }
}