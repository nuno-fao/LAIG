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

                u = (j/this.loops)*Math.PI*2;
				v = (i/this.slices)*Math.PI*2;
				
				vertX=(this.outerRadius + this.innerRadius*Math.cos(v))*Math.cos(u);
				vertY=(this.outerRadius + this.innerRadius*Math.cos(v))*Math.sin(u);
				vertZ=Math.sin(v)*this.innerRadius;

				this.vertices.push(vertX,vertY,vertZ);
				this.normals.push(vertX,vertY,vertZ);	//THESE ARE NOT CORRECT
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
				var vert1 = (j) * (this.slices + 1) + i;
				var vert2 = (j) * (this.slices + 1) + i + 1;
				var vert3 = (j + 1) * (this.slices + 1) + i;
				var vert4 = (j + 1) * (this.slices + 1) + i + 1;

				this.indices.push(vert2, vert3, vert1);
				this.indices.push(vert2, vert4, vert3);
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

