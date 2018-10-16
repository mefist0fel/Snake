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
        this.center = FindMiddlePoint([vectorA, vectorB, vectorC])
        let bc = SubstractVector3(vectorB, this.center)
        let cc = SubstractVector3(vectorC, this.center)
        let normal = CrossProductVector3(bc, cc)
        this.normal = normal
        this.unitNormal = NormalizeVector3(normal)
        this.unitTangent = NormalizeVector3(SubstractVector3(vectorB, this.center))
        this.unitBinormal = NormalizeVector3(CrossProductVector3(this.unitNormal, this.unitTangent))
        this.planeA = normal[0]
        this.planeB = normal[1]
        this.planeC = normal[2]
        this.planeD = - normal[0] * vectorA[0] - normal[1] * vectorA[1] - normal[2] * vectorA[2];
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