class BoardTile extends Pickable{
    constructor(scene, nodeID, centerX, centerZ, objectID) {
        super();
        this.scene=scene;
        this.nodeID=nodeID;
        this.centerX=centerX;
        this.centerZ=centerZ;
        this.objectID=objectID;
        this.picked=false;

        this.wall = new MyRectangle(this.scene,-0.25,-0.25,0.25,0);

        
    }

    loadTextures(){
        this.XMLnode=this.scene.graph.nodes[this.nodeID];
        this.scene.loadIdentity();


        this.wallNode=new MyNode(this.scene,this.scene.getMatrix(),this.XMLnode.texture,this.XMLnode.material);
        this.wallNode.addDescendente(this.wall);

        console.log(this.wallNode.texture.image);
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


        //BACK
        this.scene.pushMatrix();
         
        this.scene.translate(this.centerX,0,this.centerZ+0.5);
        //this.scene.rotate(Math.PI,1,0,0);
        this.wallNode.display();
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