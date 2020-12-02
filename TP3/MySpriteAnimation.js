class MySpriteAnimation{
    constructor(scene,spritesheet,duration,startCell,endCell){
        this.scene = scene;
        this.spritesheet = spritesheet;
        this.duration=duration;
        this.startCell=startCell;
        this.endCell=endCell;
        this.rect = new MyRectangle(this.scene,-0.5,-0.5,0.5,0.5,1,1);
    }

    update(time){
        this.spritesheet.activateCellP(this.startCell +  Math.floor(((time%this.duration)/this.duration)*(this.endCell-this.startCell+1)));
    }

    display(){
        this.spritesheet.texture.bind(1);
        this.scene.setActiveShaderSimple(this.spritesheet.spriteShader);
        this.spritesheet.updateUniforms();
        this.rect.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}