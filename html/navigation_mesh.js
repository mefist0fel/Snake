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
        let ba = SubstractVector3(vectorB, vectorA)
        let ca = SubstractVector3(vectorC, vectorA)
        let normal = CrossProductVector3(ba, ca)
        this.normal = normal
        this.unitNormal = NormalizeVector3(normal)
        this.planeA = normal[0]
        this.planeB = normal[1]
        this.planeC = normal[2]
        this.planeD = - normal[0] * vectorA[0] - normal[1] * vectorA[1] - normal[2] * vectorA[2];
    }

    GetDistanceToPlane(point) {
        let offset = SubstractVector3(point, this.pointA)
        return DotProductVector3(this.unitNormal, offset)
    }

    GetProjectionPoint(point) {
        let distance = this.GetDistanceToPlane(point)
        return AddVector3(point, MultiplyVector3(this.unitNormal, -distance))
    }
}