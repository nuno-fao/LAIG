
class BoardTile{
    constructor(scene, nodeID, centerX, centerZ) {
        this.scene=scene;
        this.nodeID=nodeID;
        this.centerX=centerX;
        this.centerZ=centerZ;
        this.XMLnode=this.scene.graph.nodes[nodeID];

    }
    
    display(){
        this.scene.pushMatrix();
        this.scene.translate(this.centerX,0,this.centerZ);
        this.XMLnode.display();
        this.scene.popMatrix();
    }
}