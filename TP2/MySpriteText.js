class MySpriteText{
    constructor(scene,text){
        this.scene=scene;
        this.text=text;
        this.spritesheet = new MySpritesheet(this.scene,"spritesheets/fonte.png",16,14);
        this.offset=text.length/2;
    }

    getCharacterPosition(character){
       return character.charCodeAt(0) - 31; 
    }  

    display(){
        this.spritesheet.texture.bind(1);
        this.scene.setActiveShaderSimple(this.spritesheet.spriteShader);
        for(let i=0;i<this.text.length;i++){
            let rect = new MyRectangle(this.scene, 0+i - this.offset, -0.5 , 1+i- this.offset ,0.5,1,1);
            this.spritesheet.activateCellP(this.getCharacterPosition(this.text[i]));
            this.spritesheet.updateUniforms();
            rect.display();
        }
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}