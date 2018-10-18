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

        this.edgeNeigbhorAB = null
        this.edgeNeigbhorBC = null
        this.edgeNeigbhorCA = null
    }

    TryAddNeigbhorNode(otherNode) {
        for (let i = 0; i < otherNode.points.length; i++) {
            let otherPointA = otherNode.points[i]
            let otherPointB = otherNode.points[(i + 1) % otherNode.points.length]
            
            if (this.isCommonEdge(this.pointA, this.pointB, otherPointA, otherPointB)) {
                // console.log("add AB " + this.name + " neigbhor " + otherNode.name + " : " +
                //     this.pointA + " " + this.pointB + "=" + otherPointA + " " + otherNode.points[i + 1])
                this.edgeNeigbhorAB = otherNode
                return
            }
            if (this.isCommonEdge(this.pointB, this.pointC, otherPointA, otherPointB)) {
                // console.log("add BC " + this.name + " neigbhor " + otherNode.name + " : " +
                //     this.pointB + " " + this.pointC + "=" + otherPointA + " " + otherNode.points[i + 1])
                this.edgeNeigbhorBC = otherNode
                return
            }
            if (this.isCommonEdge(this.pointC, this.pointA, otherPointA, otherPointB)) {
                // console.log("add CA " + this.name + " neigbhor " + otherNode.name + " : " +
                //     this.pointC + " " + this.pointA + "=" + otherPointA + " " + otherPointB)
                this.edgeNeigbhorCA = otherNode
                return
            }
        }
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