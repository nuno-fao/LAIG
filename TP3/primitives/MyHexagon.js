
class MyHexagon extends CGFobject {
    constructor(scene) {
        super(scene);

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            //TOPO
            -0.5, 0, 0,  //0
            -0.25, 0, -0.433012702, //1
            0.25, 0, -0.433012702,  //2
            0.5, 0, 0,  //3
            0.25, 0, 0.433012702,  //4
            -0.25, 0, 0.433012702    //5
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            2, 1, 0,
            3, 2, 0,
            4, 3, 0,
            5, 4, 0
        ];

        //Facing Z positive
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

        /*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

        this.texCoords = [
            //TOPO
            0, 0.5,
            0.25, 0,
            0.75, 0,
            1, 0.5,
            0.75, 1,
            0.25, 1,

        ];
        // this.texCoords = [
        //     0, 0.5/this.aft,
        //     0.25/this.afs, 0,
        //     0.75/this.afs, 0,
        //     1/this.afs, 0.5/this.aft,
        //     0.75/this.afs, 1/this.aft,
        //     0.25/this.afs, 1/this.aft
        // ];
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the rectangle
     * @param {Array} coords - Array of texture coordinates
     */
}