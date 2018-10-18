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
            // console.log(">>>>> find for node_" + navigationNodes[i].name + " : " + navigationNodes[i].pointA + " " + navigationNodes[i].pointB + " " + navigationNodes[i].pointC)
            for (let j = 0; j < navigationNodes.length; j++) {
                if (i == j)
                    continue
                // console.log("check node_" + navigationNodes[j].name + " : " + navigationNodes[j].pointA + " " + navigationNodes[j].pointB + " " + navigationNodes[j].pointC)
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
            if (this.currentNode.edgeNeigbhorAB != null) {
                this.moveTo(this.currentNode.edgeNeigbhorAB, this.currentNode.pointA, this.currentNode.pointB)
            }
            return
        }
        if (this.currentNode.IsOutBCEdge(position)) {
            if (this.currentNode.edgeNeigbhorBC != null) {
                this.moveTo(this.currentNode.edgeNeigbhorBC, this.currentNode.pointB, this.currentNode.pointC)
            }
            return
        }
        if (this.currentNode.IsOutCAEdge(position)) {
            if (this.currentNode.edgeNeigbhorCA != null) {
                this.moveTo(this.currentNode.edgeNeigbhorCA, this.currentNode.pointC, this.currentNode.pointA)
            }
            return
        }
        this.heroPosition = position
    }

    moveTo(node, edgePointA, edgePointB) {
        let vectorToEdge = SubstractVector3(this.heroPosition, edgePointA)
        let distanceFromEdgeStart = DotProductVector3(NormalizeVector3(SubstractVector3(edgePointB, edgePointA)), vectorToEdge)
        // // let distanceFromEdge = DotProductVector3(this.currentNode.edgeNormalAB, vectorToEdge)
        this.currentNode = node
        this.heroPosition = this.currentNode.center
        this.heroVector = this.currentNode.unitTangent
        this.heroDirection = 0.0
    }

    rotateHeroDirection(angle = 0.0) {
        this.heroDirection += angle
        this.heroVector = NormalizeVector3(MultiplyVector3ToMatrix3(this.currentNode.unitTangent, CreateRotationMatrix3(this.currentNode.unitNormal, this.heroDirection)))
    }
}