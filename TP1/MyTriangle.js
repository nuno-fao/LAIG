/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 * @param x3 - x coordinate corner 3
 * @param y3 - y coordinate corner 3
 */
class MyTriangle extends CGFobject {
    constructor(scene, x1, y1, x2, y2, x3, y3, afs, aft) {
        super(scene);
        this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.z1 = 0;
        this.z2 = 0;
        this.z3 = 0;
        this.aft = aft;
        this.afs = afs;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            this.x1, this.y1, this.z1, //0
            this.x2, this.y2, this.z2, //1
            this.x3, this.y3, this.z3 //2
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2
        ];

        //Facing Z positive
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

        //distance between vertices
        let a = Math.sqrt(Math.pow(this.x1 - this.x2, 2) + Math.pow(this.y1 - this.y2, 2));
        let b = Math.sqrt(Math.pow(this.x3 - this.x2, 2) + Math.pow(this.y3 - this.y2, 2));
        let c = Math.sqrt(Math.pow(this.x3 - this.x1, 2) + Math.pow(this.y3 - this.y1, 2));

        //cos(alpha) and sin(alpha)
        let cosalpha = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c);
        let sinalpha = Math.sqrt(1 - Math.pow(cosalpha, 2));

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
            0, 1,
            a / this.afs, 1,
            c * cosalpha / this.afs, 1 - c * sinalpha / this.aft
        ];
        console.log(a, b, c, this.afs, this.aft);
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