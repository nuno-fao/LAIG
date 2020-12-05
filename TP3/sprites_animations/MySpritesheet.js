class MySpritesheet{
    constructor(scene, path, sizeM, sizeN){
        this.scene=scene;
        this.texture =  new CGFtexture(this.scene,path);;
        this.sizeM=sizeM;
        this.sizeN=sizeN;

        this.cellWidth = 1/sizeM;
        this.cellHeight = 1/sizeN;

        
        this.spriteShader = new CGFshader(this.scene.gl,"shaders/spritesheet.vert","shaders/spritesheet.frag");

        this.spriteShader.setUniformsValues({width: this.cellWidth});
        this.spriteShader.setUniformsValues({height: this.cellHeight});
        this.spriteShader.setUniformsValues({uSampler2: 1});

        this.activeX=null;
        this.activeY=null;
    }

    activateCellMN(m,n){
        this.activeX = this.cellWidth*m;
        this.activeY = this.cellHeight*n;
    }
    activateCellP(p){
        this.activeX = ((p-1)%this.sizeM) * this.cellWidth;
        this.activeY = Math.floor((p-1)/this.sizeM) * this.cellHeight;
    }
    updateUniforms(){
        this.spriteShader.setUniformsValues({x: this.activeX, y: this.activeY});
    }
}