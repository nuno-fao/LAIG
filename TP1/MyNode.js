class MyNode {
    constructor(scene, tg_matrix, texture, material) {
        this.scene = scene;
        this.tg_matrix = tg_matrix;
        this.texture = texture;
        this.material = material;
        this.descendentes = [];
        this.used = false;
    }
    display() {
        this.scene.pushMatrix();

        let matSize = this.scene.materialStack.length;
        let texSize = this.scene.textureStack.length;
        if (matSize == 0) {
            this.scene.materialStack.push(this.scene.defaultMaterial);
            matSize = this.scene.materialStack.length;
        }


        //handle material if clear push null, if null push the last element on the stack, else push the current material
        if (this.material == "clear") {
            this.scene.materialStack.push(this.scene.defaultMaterial);
        } else if (this.material == null) {
            this.scene.materialStack.push(this.scene.materialStack[matSize - 1]);
        } else {
            this.scene.materialStack.push(this.material);
        }

        //handle texture if clear push null, if null push the last element on the stack, else push the current texture
        if (this.texture == "clear") {
            this.scene.textureStack.push(null);
        } else if (this.texture == null) {
            this.scene.textureStack.push(this.scene.textureStack[texSize - 1]);
        } else {
            this.scene.textureStack.push(this.texture)
        }

        matSize = this.scene.materialStack.length;
        texSize = this.scene.textureStack.length;


        // 
        this.scene.materialStack[matSize - 1].apply();


        if (this.scene.textureStack[texSize - 1] != null) {
            this.scene.textureStack[texSize - 1].bind();
        }

        if (this.tg_matrix != null)
            this.scene.multMatrix(this.tg_matrix);
        for (let i = 0; i < this.descendentes.length; i++) {
            this.descendentes[i].display();
        }

        this.scene.materialStack.pop();
        this.scene.textureStack.pop();


        this.scene.popMatrix();
    }
    addDescendente(descendente) {
        this.descendentes.push(descendente);
    }
}