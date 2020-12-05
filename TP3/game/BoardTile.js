class BoardTile {
    constructor(scene, nodeID, centerX, centerZ, objectID) {
        this.scene=scene;
        this.nodeID=nodeID;
        this.centerX=centerX;
        this.centerZ=centerZ;
        this.objectID=objectID;
        this.height=0.4330127025;
        this.wall = new MyRectangle(this.scene,-0.25,-0.25,0.25,0,1,1);
    }

    loadTextures(){
        this.XMLnode=this.scene.graph.nodes[this.nodeID];
        this.scene.loadIdentity();


        this.wallNode=new MyNode(this.scene,this.scene.getMatrix(),this.XMLnode.texture,this.XMLnode.material);
        this.wallNode.addDescendente(this.wall);

    }
    
    display(){
        this.scene.registerForPick(this.objectID,this);

        //TOPO
        this.scene.pushMatrix();
        this.scene.translate(this.centerX,0,this.centerZ);
        this.XMLnode.display();
        this.scene.popMatrix();

        //BASE
        this.scene.pushMatrix();
        this.scene.translate(this.centerX,-0.25,this.centerZ);
        this.scene.rotate(Math.PI,1,0,0);
        this.XMLnode.display();
        this.scene.popMatrix();

        //DOWN
        this.scene.pushMatrix();
        this.scene.translate(this.centerX,0,this.centerZ+this.height);
        //this.scene.rotate(Math.PI,1,0,0);
        this.wall.display();
        this.scene.popMatrix();

        //DOWN RIGHT
        this.scene.pushMatrix();
        this.scene.translate(this.centerX+0.375,0,this.centerZ+this.height/2);
        this.scene.rotate(Math.PI/3,0,1,0);
        this.wall.display();
        this.scene.popMatrix();

        //DOWN LEFT
        this.scene.pushMatrix();
        this.scene.translate(this.centerX-0.375,0,this.centerZ+this.height/2);
        this.scene.rotate(-Math.PI/3,0,1,0);
        this.wall.display();
        this.scene.popMatrix();

        //UP
        this.scene.pushMatrix();
        this.scene.translate(this.centerX,0,this.centerZ-this.height);
        this.scene.rotate(Math.PI,0,1,0);
        this.wall.display();
        this.scene.popMatrix();

        //UP RIGHT
        this.scene.pushMatrix();
        this.scene.translate(this.centerX+0.375,0,this.centerZ-this.height/2);
        this.scene.rotate(-4*Math.PI/3,0,1,0);
        this.wall.display();
        this.scene.popMatrix();

        //UP LEFT
        this.scene.pushMatrix();
        this.scene.translate(this.centerX-0.375,0,this.centerZ-this.height/2);
        this.scene.rotate(4*Math.PI/3,0,1,0);
        this.wall.display();
        this.scene.popMatrix();

    }

    getCenterCoords(){
        return [this.centerX,this.centerZ];
    }

    isTile(){
        return true;
    }

    isPiece(){
        return super.isPiece();
    }
}