class Piece {
    constructor(scene, type, centerX, centerZ, objectID) {
        this.scene=scene;
        this.type=type;
        this.centerX=centerX;
        this.centerZ=centerZ;
        this.objectID=objectID;

        if(this.type==pieceType.RED){
            this.nodeID="P1piece";
        }
        else{
            this.nodeID="P2piece";
        }

        //pointer to holding tile if any
        this.holdingTile=null;

        this.selectable=true;
        

    }

    loadTextures(){
        this.XMLnode=this.scene.graph.nodes[this.nodeID];
    }

    getType(){
        return this.type;
    }

    getTile(){
        return this.holdingTile;
    }

    setTile(tile){
        this.holdingTile=tile;
        let coords = tile.getCenterCoords();
        this.centerX=coords[0];
        this.centerZ=coords[1];
        this.holdingTile=tile;
        this.selectable=false;
    }

    removeTile(){
        this.holdingTile=null;
    }
    
    display(){
        if(this.selectable){
            this.scene.registerForPick(this.objectID,this);
        }
        this.scene.pushMatrix();
        this.scene.translate(this.centerX,0.25,this.centerZ);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.XMLnode.display();
        this.scene.popMatrix();

        if(this.selectable){
            this.scene.clearPickRegistration();
        }
    }

    getCenterCoords(){
        return [this.centerX,this.centerZ];
    }
}