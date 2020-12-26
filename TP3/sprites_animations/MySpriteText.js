class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;
        this.spritesheet = new MySpritesheet(this.scene, "scenes/spritesheets/fonte.png", 16, 14);
        this.offset = text.length / 2;

        this.letters = [];
        for (let i = 0; i < this.text.length; i++) {
            let rect = new MyRectangle(this.scene, 0 + i - this.offset, -0.5, 1 + i - this.offset, 0.5, 1, 1);
            this.letters.push(rect);
        }

    }

    updateText(text){
        this.letters=[];
        this.offset = text.length / 2;
        this.text=text;
        for (let i = 0; i < this.text.length; i++) {
            let rect = new MyRectangle(this.scene, 0 + i - this.offset, -0.5, 1 + i - this.offset, 0.5, 1, 1);
            this.letters.push(rect);
        }
    }

    getCharacterPosition(character) {
        let code = character.charCodeAt(0);
        if (code > 31 && code < 256) {
            return code - 31;
        } else {
            return 130;
        }
    }

    getText(){
        return this.text;
    }

    display() {
        this.spritesheet.texture.bind();
        this.scene.gl.enable(this.scene.gl.BLEND); // enables blending
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA); // defines the blending function
        this.spritesheet.texture.bind(1);
        this.scene.setActiveShaderSimple(this.spritesheet.spriteShader);
        
        for (let i in this.letters) {
            this.spritesheet.activateCellP(this.getCharacterPosition(this.text[i]));
            this.spritesheet.updateUniforms();
            this.letters[i].display();
        }
        
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.gl.disable(this.scene.gl.BLEND); // disables blending


    }
}