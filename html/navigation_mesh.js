class NavigationMesh {
}

class NavigationTriangle {
    // https://mathinsight.org/distance_point_plane
    // plane formula
    // Ax + By + Cz + D = 0
    constructor (vectorA, vectorB, vectorC) {
        this.pointA = vectorA
        this.pointB = vectorB
        this.pointC = vectorC
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
        this.edgeNormalAB = NormalizeVector3(CrossProductVector3(this.unitNormal, vectorAB))
        this.edgePointBC = this.pointB
        this.edgeNormalBC = NormalizeVector3(CrossProductVector3(this.unitNormal, vectorBC))
        this.edgePointCA = this.pointC
        this.edgeNormalCA = NormalizeVector3(CrossProductVector3(this.unitNormal, vectorCA))
        // this.planeA = normal[0]
        // this.planeB = normal[1]
        // this.planeC = normal[2]
        // this.planeD = - normal[0] * vectorA[0] - normal[1] * vectorA[1] - normal[2] * vectorA[2];
    }

    IsInsideTriangle(point) {
        if (this.GetDistanceToEdge(point, this.edgePointAB, this.edgeNormalAB) < 0) {
            return false
        }
        if (this.GetDistanceToEdge(point, this.edgePointBC, this.edgeNormalBC) < 0) {
            return false
        }
        if (this.GetDistanceToEdge(point, this.edgePointCA, this.edgeNormalCA) < 0) {
            return false
        }
        return true
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