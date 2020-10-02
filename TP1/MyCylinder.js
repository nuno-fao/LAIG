/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param bottomRadius - radius of the base (at z=0)
 * @param topRadius - radius of the top
 * @param height - height of the cylinder (at z axis)
 * @param slices - number of divisions around z axis
 * @param stacks - number of divisions along its height
 */
class MyCylinder extends CGFobject {
	constructor(scene, bottomRadius, topRadius, height, slices, stacks) {
		super(scene);
		this.bottomRadius = bottomRadius;
		this.topRadius = topRadius;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];

		this.indices = [];

		this.normals = [];

		this.texCoords = [];


		var div = 2 * Math.PI / this.slices;

		this.vertices.push(0, 0, 0);
		this.normals.push(0, 0, -1);
		this.texCoords.push(0.5, 0.5);

		for (var i = 0; i <= this.slices; i++) {
			this.vertices.push(this.bottomRadius*Math.cos(i * div), this.bottomRadius*Math.sin(i * div), 0);
			this.normals.push(0, 0, -1);
			this.texCoords.push(0.5 + 0.5 * Math.cos(i * div), 0.5 + 0.5 * Math.sin(i * div));
		}

		for (var i = 0; i < this.slices; i++) {
			this.indices.push(i, 0, i + 1);
		}

		this.indices.push(this.slices,0, 1);





		var div = 2 * Math.PI / this.slices;

		this.vertices.push(0, 0, this.height);
		this.normals.push(0, 0, 1);
		this.texCoords.push(0.5, 0.5);

		for (var i = 0; i <= this.slices; i++) {
			this.vertices.push(this.topRadius*Math.cos(i * div), this.topRadius*Math.sin(i * div), this.height);
			this.normals.push(0, 0, 1);
			this.texCoords.push(0.5 + 0.5 * Math.cos(i * div), 0.5 + 0.5 * Math.sin(i * div));
		}
		let a = (this.slices+2);
		for (var i = 0; i < this.slices; i++) {
			this.indices.push(a, i+a, (i + 1)+a);
		}
		console.log("Frango",this.vertices,a)

		this.indices.push(a+1,a, 2*a-2);

		//drawing body from top to bottom
		for (let i = 0; i <= this.stacks; i++) {
			var trueRadius = i / this.stacks * (this.bottomRadius - this.topRadius) + this.topRadius;      //Radius of stack i

			for (let j = 0; j <= this.slices; j++) {
				var ang = j / this.slices * Math.PI * 2;
				var cos = Math.cos(ang);
				var sin = Math.sin(ang);

				this.vertices.push(trueRadius * cos, trueRadius * sin, (1 - i / this.stacks) * this.height);
				this.normals.push(cos, sin, (this.bottomRadius - this.topRadius) / this.height);
				this.texCoords.push(j / this.slices, i / this.slices);
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
		
		a = a*2;
		for (i = 0; i < this.slices; i++) {
			for (let j = 0; j < this.stacks; j++) {
				var vert1 =a+ (j) * (this.slices + 1) + i;
				var vert2 =a+ (j) * (this.slices + 1) + i + 1;
				var vert3 =a+ (j + 1) * (this.slices + 1) + i;
				var vert4 =a+ (j + 1) * (this.slices + 1) + i + 1;

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

