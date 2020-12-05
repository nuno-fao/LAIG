class Piece extends Pickable{
    constructor(scene, nodeID, centerX, centerZ, objectID) {
        super();
        this.scene=scene;
        this.nodeID=nodeID;
        this.centerX=centerX;
        this.centerZ=centerZ;
        this.objectID=objectID;
        this.picked=false;
        
    }

    loadTextures(){
        this.XMLnode=this.scene.graph.nodes[this.nodeID];
    }

    updateCenter(newX,newZ){
        this.centerX=newX;
        this.centerZ=newZ;
    }
    
    display(){
        this.scene.registerForPick(this.objectID,this);
        this.scene.pushMatrix();
        this.scene.translate(this.centerX,0.25,this.centerZ);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.XMLnode.display();
        this.scene.popMatrix();
    }

    getCenterCoords(){
        return [this.centerX,this.centerZ];
    }

    isPiece(){
        return true;
    }

    isTile(){
        return super.isTile();
    }
}