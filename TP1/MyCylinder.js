/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 */
class MyCylinder extends CGFobject {
	constructor(scene, bottomRadius, topRadius, height, slices, stacks) {
		super(scene);
        this.bottomRadius=bottomRadius;
        this.topRadius=topRadius;
        this.height=height;
        this.slices=slices;
        this.stacks=stacks;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];

		this.indices = [];

		this.normals = [];

        this.texCoords = [];
        
        
        for (var i=0;i<=this.stacks;i++){
            var trueRadius = i/this.stacks*(this.bottomRadius-this.topRadius) + this.topRadius;      //Radius of stack i

            for(var j=0;j<=this.slices;j++){
                var ang = j/this.slices*Math.PI*2;
                var cos = Math.cos(ang);
                var sin = Math.sin(ang);

                this.vertices.push(trueRadius*cos, trueRadius*sin, (1-i/this.stacks)*this.height);
                this.normals.push(cos,sin,(this.bottomRadius-this.topRadius)/this.height);
                this.texCoords.push(j/this.slices,i/this.slices);
                
            }
		}
		
		for(var i=0;i=this.slices;i++){
			for(var j=0;stack<=this.stacks;stack++){
				var vert1 = (j)*(this.slices+1) + i;
				var vert2 = (j)*(this.slices+1) + i+1;
				var vert3 = (j+1)*(this.slices+1) + i;
				var vert4 = (j+1)*(this.slices+1) + i+1;
				
				this.indices.push(vert1,vert3,vert2);
				this.indices.push(vert3,vert4,vert2);
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

