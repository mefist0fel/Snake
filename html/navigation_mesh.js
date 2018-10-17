class NavigationMesh {
    constructor(navigationNodes = [], startNodeId = 0) {
        this.nodes = navigationNodes
        this.currentNode = this.nodes[startNodeId]
        this.heroPosition = this.currentNode.center
        this.heroVector = this.currentNode.unitTangent
        this.heroDirection = 0.0
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

    moveHero(distance = 1.0) {
        let position = AddVector3(this.heroPosition, MultiplyVector3(this.heroVector, distance))
        if (this.currentNode.IsOutABEdge(position)) {
            if (this.currentNode.edgeNeigbhorAB != null)
                this.moveTo(this.currentNode.edgeNeigbhorAB)
            return
        }
        if (this.currentNode.IsOutBCEdge(position)) {
            if (this.currentNode.edgeNeigbhorBC != null)
                this.moveTo(this.currentNode.edgeNeigbhorBC)
            return
        }
        if (this.currentNode.IsOutCAEdge(position)) {
            if (this.currentNode.edgeNeigbhorCA != null)
                this.moveTo(this.currentNode.edgeNeigbhorCA)
            return
        }
        this.heroPosition = position
        //if (this.currentNode.IsInsideTriangle(position))
        //    this.heroPosition = position
        //this.heroPosition = AddVector3(this.heroPosition, MultiplyVector3(this.heroVector, distance))
    }

    moveTo(node) {
        this.currentNode = node
        this.heroPosition = this.currentNode.center
        this.heroVector = this.currentNode.unitTangent
        this.heroDirection = 0.0
    }

    rotateHeroDirection(angle = 0.0) {
        console.log(this.currentNode.unitNormal);
        this.heroDirection += angle
        this.heroVector = NormalizeVector3(MultiplyVector3ToMatrix3(this.currentNode.unitTangent, CreateRotationMatrix3(this.currentNode.unitNormal, this.heroDirection)))
    }
}