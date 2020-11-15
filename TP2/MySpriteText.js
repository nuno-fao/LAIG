class MySpriteText{
    constructor(scene,text){
        this.scene=scene;
        this.text=text;
        this.spritesheet = new MySpritesheet(this.scene,"spritesheets/fonte.png",16,14);
        //this.offset=text.length/2;
    }

    getCharacterPosition(character){
       return character.charCodeAt(0) - 31; 
    }  

    display(){
        this.spritesheet.texture.bind(1);
        this.scene.setActiveShader(this.spritesheet.spriteShader);
        for(let i=0;i<this.text.length;i++){
            let rect = new MyRectangle(this.scene, 0+i, 0 , 1+i ,1,1,1);
            this.spritesheet.activateCellP(this.getCharacterPosition(this.text[i]));
            rect.display();
        }
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}