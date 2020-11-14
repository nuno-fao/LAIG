class MySpriteAnimation{
    constructor(scene,sprites,sizeM,sizeN,duration,startCell,endCell){
        this.scene=scene;
        this.sprites=sprites;
        this.spritesheet = new MySpritesheet(scene,sprites,sizeM,sizeN);
        this.duration=duration;
        this.startCell=startCell;
        this.endCell=endCell;
        this.rect = new MyRectangle(scene,0,1,1,0);
    }

    update(time){
        this.spritesheet.activateCellP(this.startCell +  Math.floor(((time%duration)/duration)*(this.endCell-startCell)));
    }

    display(){
        this.spritesheet.texture.bind();
        this.scene.setActiveShader(this.spritesheet.spriteShader);
        this.rect.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}