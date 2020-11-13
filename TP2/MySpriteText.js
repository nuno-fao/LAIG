class MySpriteText{
    constructor(scene,text){
        this.scene=scene;
        this.text=text;
        this.spritesheet = new MySpritesheet(scene,"spritesheets/font.png",16,16);
       
    }

    getCharacterPosition(character){
       position=66; 
    }  

    display(){
        this.spritesheet.texture.bind();
        this.scene.setActiveShader(this.spritesheet.spriteShader);
        for(let i=0;i<this.text.length;i++){
            let rect = new MyRectangle(scene,0+i,1,1+i,0);
            this.spritesheet.activateCellP(this.getCharacterPosition(this.text[i]));
            rect.display();
        }
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}