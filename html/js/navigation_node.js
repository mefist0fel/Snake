// nav node - for nav class
class NavigationNode {
    // https://mathinsight.org/distance_point_plane
    // plane formula
    // Ax + By + Cz + D = 0
    constructor (vectorA, vectorB, vectorC) {
        this.pointA = vectorA
        this.pointB = vectorB
        this.pointC = vectorC

        this.points = [vectorA, vectorB, vectorC]
        let center = FindMiddlePoint([vectorA, vectorB, vectorC])
        this.center = center
        let bc = SubstractVector3(vectorB, center)
        let cc = SubstractVector3(vectorC, center)
        let normal = CrossProductVector3(bc, cc)
        this.normal = normal
        this.unitNormal = NormalizeVector3(normal)
        this.unitTangent = NormalizeVector3(SubstractVector3(vectorB, center))
        this.unitBinormal = NormalizeVector3(CrossProductVector3(this.unitNormal, this.unitTangent))

        let vectorAB = SubstractVector3(vectorB, vectorA)
        let vectorBC = SubstractVector3(vectorC, vectorB)
        let vectorCA = SubstractVector3(vectorA, vectorC)
        this.edgePointAB = this.pointA
        this.edgeUnitAB = NormalizeVector3(vectorAB)
        this.edgeNormalAB = NormalizeVector3(CrossProductVector3(this.unitNormal, vectorAB))
        this.edgePointBC = this.pointB
        this.edgeUnitBC = NormalizeVector3(vectorBC)
        this.edgeNormalBC = NormalizeVector3(CrossProductVector3(this.unitNormal, vectorBC))
        this.edgePointCA = this.pointC
        this.edgeUnitCA = NormalizeVector3(vectorCA)
        this.edgeNormalCA = NormalizeVector3(CrossProductVector3(this.unitNormal, vectorCA))
        this.area = this.GetArea(Vector3Length(vectorAB), Vector3Length(vectorBC), Vector3Length(vectorCA))

        this.edgeNeigbhorAB = null
        this.edgeNeigbhorBC = null
        this.edgeNeigbhorCA = null
        // cached values for speedUp
        this.unitEdgeVectorAB = NormalizeVector3(SubstractVector3(vectorB, vectorA))
        this.unitEdgeVectorBC = NormalizeVector3(SubstractVector3(vectorC, vectorB))
        this.unitEdgeVectorCA = NormalizeVector3(SubstractVector3(vectorA, vectorC))
        this.unitEdgeNormalAB = CrossProductVector3(this.unitNormal, this.unitEdgeVectorAB)
        this.unitEdgeNormalBC = CrossProductVector3(this.unitNormal, this.unitEdgeVectorBC)
        this.unitEdgeNormalCD = CrossProductVector3(this.unitNormal, this.unitEdgeVectorCA)
    }

    GetArea(ABLength, BCLength, CALength) {
        // triangle area https://ru.wikipedia.org/wiki/%D0%A4%D0%BE%D1%80%D0%BC%D1%83%D0%BB%D0%B0_%D0%93%D0%B5%D1%80%D0%BE%D0%BD%D0%B0
        let p = (ABLength + BCLength + CALength) * 0.5
        return Math.sqrt(p * (p - ABLength) * (p - BCLength) * (p - CALength))
    }

    TryAddNeigbhorNode(otherNode) {
        for (let i = 0; i < otherNode.points.length; i++) {
            let otherPointA = otherNode.points[i]
            let otherPointB = otherNode.points[(i + 1) % otherNode.points.length]
            
            if (this.isCommonEdge(this.pointA, this.pointB, otherPointA, otherPointB)) {
                this.edgeNeigbhorAB = otherNode
                return
            }
            if (this.isCommonEdge(this.pointB, this.pointC, otherPointA, otherPointB)) {
                this.edgeNeigbhorBC = otherNode
                return
            }
            if (this.isCommonEdge(this.pointC, this.pointA, otherPointA, otherPointB)) {
                this.edgeNeigbhorCA = otherNode
                return
            }
        }
    }
    
    GetRandomPosition() {
        var x = Math.random()
        var y = Math.random()
        if (x + y > 1.0) {
            x = 1.0 - x
            y = 1.0 - y
        }
        let ab = SubstractVector3(this.pointB, this.pointA)
        let ac = SubstractVector3(this.pointC, this.pointA)
        return AddVector3(this.pointA, AddVector3(MultiplyVector3(ab, x), MultiplyVector3(ac, y)))
    }

    isCommonEdge(aStart, aEnd, bStart, bEnd) {
        return (
            (IsEqualVector3(aStart, bStart) && IsEqualVector3(aEnd, bEnd)) ||
            (IsEqualVector3(aStart, bEnd) && IsEqualVector3(aEnd, bStart))
        )
    }

    IsOutABEdge(point) {
        return (this.GetDistanceToEdge(point, this.edgePointAB, this.edgeNormalAB) < 0)
    }

    IsOutBCEdge(point) {
        return (this.GetDistanceToEdge(point, this.edgePointBC, this.edgeNormalBC) < 0)
    }

    IsOutCAEdge(point) {
        return (this.GetDistanceToEdge(point, this.edgePointCA, this.edgeNormalCA) < 0)
    }

    GetDistanceToEdge(point, edgePoint, edgeUnitNormal) {
        let offset = SubstractVector3(point, edgePoint)
        return DotProductVector3(edgeUnitNormal, offset)
    }

    GetDistanceToPlane(point) {
        let offset = SubstractVector3(point, this.center)
        return DotProductVector3(this.unitNormal, offset)
    }

    GetProjectionPoint(point) {
        let distance = this.GetDistanceToPlane(point)
        return AddVector3(point, MultiplyVector3(this.unitNormal, -distance))
    }
}