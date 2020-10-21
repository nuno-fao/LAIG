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
        if (this.notRoot == false) {
            this.scene.textureStack = [];
        }

        if (this.material != null) {
            this.scene.materialStack.push(this.material);
        }
        if (this.texture == "clear") {
            this.scene.textureStack.push(null);
        } else if (this.texture != null) {
            this.scene.textureStack.push(this.texture);
        }

        let materialEx;

        if (this.scene.materialStack.length != 0) {
            materialEx = this.scene.materialStack[this.scene.materialStack.length - 1];
        } else {
            materialEx = this.scene.defaultMaterial;
        }

        materialEx.apply();
        if (this.scene.textureStack.length > 0 && this.texture != "clear" && this.scene.textureStack[this.scene.textureStack.length - 1] != null) {
            try {
                this.scene.textureStack[this.scene.textureStack.length - 1].bind();
            } catch {}
        }


        if (this.tg_matrix != null)
            this.scene.multMatrix(this.tg_matrix);
        for (let i = 0; i < this.descendentes.length; i++) {
            this.descendentes[i].display();
        }

        if (this.material != null) {
            this.scene.materialStack.pop();
        }

        if (this.texture != null) {
            this.scene.textureStack.pop();
        }


        this.scene.popMatrix();
    }
    addDescendente(descendente) {
        this.descendentes.push(descendente);
    }
}