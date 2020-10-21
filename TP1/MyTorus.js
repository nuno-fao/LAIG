/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param bottomRadius - radius of the base (at z=0)
 * @param topRadius - radius of the top
 * @param height - height of the cylinder (at z axis)
 * @param slices - number of divisions around z axis
 * @param stacks - number of divisions along its height
 */
class MyTorus extends CGFobject {
    constructor(scene, innerRadius, outerRadius, slices, loops) {
        super(scene);
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];

        this.indices = [];

        this.normals = [];

        this.texCoords = [];


        let u, v, vertX, vertY, vertZ;
        //thank god for google
        for (let i = 0; i <= this.slices; i++) {

            for (let j = 0; j <= this.loops; j++) {

                u = (j / this.loops) * Math.PI * 2;
                v = (i / this.slices) * Math.PI * 2;

                vertX = (this.outerRadius + this.innerRadius * Math.cos(v)) * Math.cos(u);
                vertY = (this.outerRadius + this.innerRadius * Math.cos(v)) * Math.sin(u);
                vertZ = Math.sin(v) * this.innerRadius;

                this.vertices.push(vertX, vertY, vertZ);
                this.normals.push(Math.cos(v) * Math.cos(u), Math.cos(v) * Math.sin(u), Math.sin(v)); //THESE ARE NOT CORRECT
                this.texCoords.push(j / this.loops, i / this.slices);

            }
        }


        //set indices for drawing
        /*
         *	vert3->	 _______	<-vert4
         *			|		|
         *	vert1->	|_______|	<-vert2
         *
         *
         */

        for (let i = 0; i < this.slices; i++) {
            for (let j = 0; j < this.loops; j++) {
                let vert1 = i * (this.loops + 1) + j
                let vert2 = (i + 1) * (this.loops + 1) + j;
                let vert3 = i * (this.loops + 1) + j + 1;
                let vert4 = (i + 1) * (this.loops + 1) + j + 1;

                this.indices.push(vert2, vert1, vert3);
                this.indices.push(vert2, vert3, vert4);
            }
        }





        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the rectangle
     * @param {Array} coords - Array of texture coordinates
     */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}