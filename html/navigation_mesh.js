class NavigationMesh {
    constructor(navigationNodes = [], startNodeId = 0) {
        this.nodes = navigationNodes
        this.currentNode = this.nodes[startNodeId]
        this.heroPosition = this.currentNode.center
        this.heroVector = this.currentNode.unitTangent
        this.heroNormal = this.currentNode.unitNormal
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

    getRandomPosition () {
        let randomNode = this.nodes[getRandomInt(0, this.nodes.length)]
        return randomNode.center

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
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
        let newHeroPosition = this.FindPositionOnDifferentNode(this.currentNode, node, this.heroPosition, edgePointA, edgePointB)
        let newHeroDirectionInWorldSpace = this.FindPositionOnDifferentNode(this.currentNode, node, AddVector3(this.heroPosition, this.heroVector), edgePointA, edgePointB)
        let newHeroVector = SubstractVector3(newHeroDirectionInWorldSpace, newHeroPosition)
        this.currentNode = node
        this.heroPosition = newHeroPosition
        this.heroVector = newHeroVector
        this.heroNormal = this.currentNode.unitNormal
    }

    FindPositionOnDifferentNode(currentNode, newNode, position, edgePointA, edgePointB) {
        let vectorToEdge = SubstractVector3(position, edgePointA)
        let unitEdgeVector = NormalizeVector3(SubstractVector3(edgePointB, edgePointA))
        let distanceFromEdgeStart = DotProductVector3(unitEdgeVector, vectorToEdge)
        let currentNodeUnitEdgeNormal = CrossProductVector3(currentNode.unitNormal, unitEdgeVector)
        let cnextNodeUnitEdgeNormal = CrossProductVector3(newNode.unitNormal, unitEdgeVector)
        let distanceFromEdge = DotProductVector3(currentNodeUnitEdgeNormal, vectorToEdge)
        return AddVector3(AddVector3(edgePointA, MultiplyVector3(unitEdgeVector, distanceFromEdgeStart)), MultiplyVector3(cnextNodeUnitEdgeNormal, distanceFromEdge))
    }

    rotateHeroDirection(angle = 0.0) {
        this.heroVector = NormalizeVector3(MultiplyVector3ToMatrix3(this.heroVector, CreateRotationMatrix3(this.currentNode.unitNormal, angle)))
    }
}