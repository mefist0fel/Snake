// Navigation mesh class - to move point throw navigation
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
                this.moveTo(this.currentNode.edgeNeigbhorAB, this.currentNode.pointA, this.currentNode.unitEdgeVectorAB, this.currentNode.unitEdgeNormalAB)
            }
            return
        }
        if (this.currentNode.IsOutBCEdge(position)) {
            if (this.currentNode.edgeNeigbhorBC != null) {
                this.moveTo(this.currentNode.edgeNeigbhorBC, this.currentNode.pointB, this.currentNode.unitEdgeVectorBC, this.currentNode.unitEdgeNormalBC)
            }
            return
        }
        if (this.currentNode.IsOutCAEdge(position)) {
            if (this.currentNode.edgeNeigbhorCA != null) {
                this.moveTo(this.currentNode.edgeNeigbhorCA, this.currentNode.pointC, this.currentNode.unitEdgeVectorCA, this.currentNode.unitEdgeNormalCD)
            }
            return
        }
        this.heroPosition = position
    }

    moveTo(node, edgePointA, unitEdgeVector, unitEdgeNormal) {
        let newHeroPosition = this.FindPositionOnDifferentNode(this.currentNode, node, this.heroPosition, edgePointA, unitEdgeVector, unitEdgeNormal)
        let newHeroDirectionInWorldSpace = this.FindPositionOnDifferentNode(this.currentNode, node, AddVector3(this.heroPosition, this.heroVector), edgePointA, unitEdgeVector, unitEdgeNormal)
        let newHeroVector = SubstractVector3(newHeroDirectionInWorldSpace, newHeroPosition)
        this.currentNode = node
        this.heroPosition = newHeroPosition
        this.heroVector = newHeroVector
        this.heroNormal = this.currentNode.unitNormal
    }

    FindPositionOnDifferentNode(currentNode, newNode, position, edgePointA, unitEdgeVector, unitEdgeNormal) {
        let vectorToEdge = SubstractVector3(position, edgePointA)
        let distanceFromEdgeStart = DotProductVector3(unitEdgeVector, vectorToEdge)
        let cnextNodeUnitEdgeNormal = CrossProductVector3(newNode.unitNormal, unitEdgeVector)
        let distanceFromEdge = DotProductVector3(unitEdgeNormal, vectorToEdge)
        return [
            edgePointA[0] + unitEdgeVector[0] * distanceFromEdgeStart + cnextNodeUnitEdgeNormal[0] * distanceFromEdge,
            edgePointA[1] + unitEdgeVector[1] * distanceFromEdgeStart + cnextNodeUnitEdgeNormal[1] * distanceFromEdge,
            edgePointA[2] + unitEdgeVector[2] * distanceFromEdgeStart + cnextNodeUnitEdgeNormal[2] * distanceFromEdge,
        ]
        // optimized
        // return AddVector3(AddVector3(edgePointA, MultiplyVector3(unitEdgeVector, distanceFromEdgeStart)), MultiplyVector3(cnextNodeUnitEdgeNormal, distanceFromEdge))
    }

    rotateHeroDirection(angle = 0.0) {
        this.heroVector = NormalizeVector3(MultiplyVector3ToMatrix3(this.heroVector, CreateRotationMatrix3(this.currentNode.unitNormal, angle)))
    }
}