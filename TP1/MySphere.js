/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the object
 * @param radius - Radius of the sphere
 * @param slices - Number of desired slices
 * @param stacks - Number of desired stacks
 */
class MySphere extends CGFobject {
    constructor(scene, radius, slices, stacks) {
        super(scene);
        this.latDivs = stacks * 2; //longitude
        this.longDivs = slices; //latitude
        this.radius = radius;

        this.initBuffers();
    }

    /**
     * @method initBuffers
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let phi = 0;
        let theta = 0;
        let phiInc = Math.PI / this.latDivs;
        let thetaInc = (2 * Math.PI) / this.longDivs;
        let latVertices = this.longDivs + 1;

        let mapLong = 0;
        let mapLat = 0;
        let longAdd = 1 / this.longDivs;
        let latAdd = 1 / this.latDivs;

        // build an all-around stack at a time, starting on "north pole" and proceeding "south"
        for (let latitude = 0; latitude <= this.latDivs; latitude++) {
            let sinPhi = Math.sin(phi);
            let cosPhi = Math.cos(phi);

            // in each stack, build all the slices around, starting on longitude 0
            theta = 0;
            mapLong = 0;

            for (let longitude = 0; longitude <= this.longDivs; longitude++) {
                //--- Vertices coordinates

                let x = Math.cos(-theta) * sinPhi
                let y = Math.sin(theta) * sinPhi
                let z = cosPhi;

                this.vertices.push(x * this.radius, y * this.radius, z * this.radius);

                //--- Indices
                if (latitude < this.latDivs && longitude < this.longDivs) {
                    let current = latitude * latVertices + longitude;
                    let next = current + latVertices;
                    // pushing two triangles using indices from this round (current, current+1)
                    // and the ones directly south (next, next+1)
                    // (i.e. one full round of slices ahead)

                    this.indices.push(current + 1, current, next);
                    this.indices.push(current + 1, next, next + 1);
                }

                //--- Normals
                // at each vertex, the direction of the normal is equal to 
                // the vector from the center of the sphere to the vertex.
                // in a sphere of radius equal to one, the vector length is one.
                // therefore, the value of the normal is equal to the position vectro
                this.normals.push(x, y, z);
                theta += thetaInc;

                //--- Texture Coordinates
                this.texCoords.push(mapLong, mapLat);
                mapLong += longAdd;
            }

            phi += phiInc;
            mapLat += latAdd;
        }


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        if (this.scene.selectedObject == 1)
            this.scene.earthMaterial.apply();
        super.display();
    }
}