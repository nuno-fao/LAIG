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

		var phi = 0;
		var theta = 0;
		var phiInc = Math.PI / this.latDivs;
		var thetaInc = (2 * Math.PI) / this.longDivs;
		var latVertices = this.longDivs + 1;

		var mapLong = 0;
		var mapLat = 0;
		var longAdd = 1/this.longDivs;
		var latAdd = 1/this.latDivs;

        // build an all-around stack at a time, starting on "north pole" and proceeding "south"
        //STACKS ARE STILL ALONG Y AXIS, NEED TO CHANGE
		for (let latitude = 0; latitude <= this.latDivs; latitude++) {
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			// in each stack, build all the slices around, starting on longitude 0
			theta = 0;
			mapLong = 0;

			for (let longitude = 0; longitude <= this.longDivs; longitude++) {
				//--- Vertices coordinates
				var x = Math.cos(theta) * sinPhi;
				var y = cosPhi;
				var z = Math.sin(-theta) * sinPhi;
				this.vertices.push(x*this.radius, y*this.radius, z*this.radius);

				//--- Indices
				if (latitude < this.latDivs && longitude < this.longDivs) {
					var current = latitude * latVertices + longitude;
					var next = current + latVertices;
					// pushing two triangles using indices from this round (current, current+1)
					// and the ones directly south (next, next+1)
					// (i.e. one full round of slices ahead)

					this.indices.push( current + 1, current, next);
					this.indices.push( current + 1, next, next +1);
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