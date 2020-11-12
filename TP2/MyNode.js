class MyNode {
    constructor(scene, tg_matrix, texture, material) {
        this.scene = scene;
        this.tg_matrix = tg_matrix;
        this.texture = texture;
        this.material = material;
        this.descendentes = [];
        this.used = false;
        this.animation = null;
        //this.wasReferenced = false;
    }

    addAnimation(animation) {
        this.animation = animation;
    }
    display(time) {
        this.scene.pushMatrix();

        let matSize = this.scene.materialStack.length;
        let texSize = this.scene.textureStack.length;
        let localMat;
        let localText;


        //handle material if clear push null, if null push the last element on the stack, else push the current material

        if (this.material == "clear") {
            localMat = this.scene.defaultMaterial;
            this.scene.materialStack.push(localMat);
        } else if (this.material == null) {
            localMat = this.scene.materialStack[matSize - 1];
            this.scene.materialStack.push(localMat);
        } else {
            localMat = this.material;
            this.scene.materialStack.push(localMat);
        }

        //handle texture if clear push null, if null push the last element on the stack, else push the current texture

        if (this.texture == "clear") {
            localText = null;
            this.scene.textureStack.push(null);
        } else if (this.texture == null) {
            localText = this.scene.textureStack[texSize - 1];
            this.scene.textureStack.push(localText);
        } else {
            localText = this.texture;
            this.scene.textureStack.push(localText)
        }

        matSize += 1;
        texSize += 1;


        // 
        localMat.apply();

        if (localText != null) {
            localText.bind();
        }

        if (this.tg_matrix != null)
            this.scene.multMatrix(this.tg_matrix);
        if (this.animation != null)
            this.animation.apply();
        if(this.animation==null || this.animation.activeFrame!=0){
            for (let i = 0; i < this.descendentes.length; i++) {
                this.descendentes[i].display();
            }
        }
        

        this.scene.materialStack.pop();
        this.scene.textureStack.pop();

        this.scene.popMatrix();
    }
    addDescendente(descendente) {
        this.descendentes.push(descendente);
    }
}