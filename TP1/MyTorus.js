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
		this.height = height;
		this.slices = slices;
		this.loops = loops;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];

		this.indices = [];

		this.normals = [];

		this.texCoords = [];


		//drawing body from top to bottom
		for (let i = 0; i <= this.stacks; i++) {

			for (let j = 0; j <= this.loops; j++) {
				
                var u = (j/this.loops)*Math.PI*2;
                var v = (i/this.slices)*Math.PI*2;

				this.vertices.push(
                    (this.outerRadius + this.innerRadius*Math.cos(v))*Math.cos(u),
                    (this.outerRadius + this.innerRadius*Math.cos(v))*Math.sin(u),
                    Math.sin(v)*this.inner
                );
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
		
		for (i = 0; i < this.slices; i++) {
			for (let j = 0; j < this.loops; j++) {
				var vert1 = (j) * (this.slices + 1) + i;
				var vert2 = (j) * (this.slices + 1) + i + 1;
				var vert3 = (j + 1) * (this.slices + 1) + i;
				var vert4 = (j + 1) * (this.slices + 1) + i + 1;

				this.indices.push(vert1, vert3, vert2);
				this.indices.push(vert3, vert4, vert2);
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

