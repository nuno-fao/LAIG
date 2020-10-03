class MyNode {
	constructor(scene,tg_matrix,texture,material) {
		this.scene	= scene;
		this.tg_matrix	= tg_matrix;   
		this.texture	= texture;
		this.material	= material;
		this.descendentes = [];
		this.notRoot = false;
	}
	display(){
		this.scene.pushMatrix();
		this.scene.multMatrix(this.tg_matrix);
		for(var i=0; i<this.descendentes.length; i++){
			this.descendentes[i].display();
		}
		this.scene.popMatrix();
	}
	addDescendente(descendente){
		this.descendentes.push(descendente);
	}
}
