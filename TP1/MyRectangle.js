/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 */
class MyRectangle extends CGFobject {
    constructor(scene, x1, y1, x2, y2, aft, afs) {
        super(scene);
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.aft = aft;
        this.afs = afs;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            this.x1, this.y1, 0, //0
            this.x2, this.y1, 0, //1
            this.x1, this.y2, 0, //2
            this.x2, this.y2, 0 //3
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            1, 3, 2
        ];

        //Facing Z positive
        this.normals = [
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

        let x = this.x2 - this.x1;
        let y = this.y2 - this.y1;
        x = Math.abs(x);
        y = Math.abs(y);
        this.texCoords = [
            0, 1 / this.aft,
            1 / this.afs, 1 / this.aft,
            0, 0,
            1 / this.afs, 0
        ];
        /*this.texCoords = [
            0, y / this.aft,
            x / this.afs, y / this.aft,
            0, 0,
            x / this.afs, 0
        ];*/
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the rectangle
     * @param {Array} coords - Array of texture coordinates
     */
}