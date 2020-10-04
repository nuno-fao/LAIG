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
		
		if(this.material!=null){
			this.scene.materialStack.push(this.material);
		}
		if(this.texture!=null){
			this.scene.textureStack.push(this.texture);
		}

		var materialEx;

		if(this.scene.materialStack.length!=0){
			materialEx = this.scene.materialStack[this.scene.materialStack.length-1];
		}
		else{
			materialEx = this.scene.defaultMaterial;
		}
		materialEx.apply();
		if(this.scene.textureStack.length!=0 && this.texture!="clear"){
			this.scene.textureStack[this.scene.textureStack.length-1].bind();
		}
		
	
		//console.log(materialEx);
		

		this.scene.multMatrix(this.tg_matrix);
		for(var i=0; i<this.descendentes.length; i++){
			this.descendentes[i].display();
		}

		if(this.material!=null){
			this.scene.materialStack.pop();
		}

		if(this.texture!=null){
			this.scene.textureStack.pop();
		}

		
		this.scene.popMatrix();
	}
	addDescendente(descendente){
		this.descendentes.push(descendente);
	}
}
