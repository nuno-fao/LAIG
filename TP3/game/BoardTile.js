class BoardTile {
    constructor(scene, board, type, centerX, centerZ, objectID) {
        this.scene = scene;
        this.board = board;
        this.type = type;
        this.centerX = centerX;
        this.centerZ = centerZ;
        this.objectID = objectID;

        this.height = 0.4330127025;
        this.wall = new MyRectangle(this.scene, -0.25, -0.25, 0.25, 0, 1, 1);

        if (this.type == tileType.VOID) {
            this.selectable = false;
        } else {
            this.selectable = true;
        }

        //pointer to holding piece
        this.holdingPiece = null;
    }

    loadTextures() {
        if (this.type == tileType.VOID) {
            this.XMLnode = this.scene.graph.templates[this.scene.activeVoidTile];
        } else {
            this.XMLnode = this.scene.graph.templates[this.scene.activeNormalTile];
        }
        
        this.scene.loadIdentity();


        this.wallNode = new MyNode(this.scene, this.scene.getMatrix(), this.XMLnode.texture, this.XMLnode.material);
        this.wallNode.addDescendente(this.wall);

    }

    getType() {
        return this.type;
    }

    setPiece(piece) {
        this.holdingPiece = piece;
        this.selectable = false;
    }

    getPiece() {
        return this.holdingPiece;
    }

    removePiece() {
        this.holdingPiece = null;
        this.selectable = true;
    }

    display() {
        if (this.selectable) {
            this.scene.registerForPick(this.objectID, this);
        }

        //TOPO
        this.scene.pushMatrix();
        this.scene.translate(this.centerX, 0, this.centerZ);
        this.XMLnode.display();
        this.scene.popMatrix();

        //BASE
        this.scene.pushMatrix();
        this.scene.translate(this.centerX, -0.25, this.centerZ);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.XMLnode.display();
        this.scene.popMatrix();

        //DOWN
        this.scene.pushMatrix();
        this.scene.translate(this.centerX, 0, this.centerZ + this.height);
        //this.scene.rotate(Math.PI,1,0,0);
        this.wall.display();
        this.scene.popMatrix();

        //DOWN RIGHT
        this.scene.pushMatrix();
        this.scene.translate(this.centerX + 0.375, 0, this.centerZ + this.height / 2);
        this.scene.rotate(Math.PI / 3, 0, 1, 0);
        this.wall.display();
        this.scene.popMatrix();

        //DOWN LEFT
        this.scene.pushMatrix();
        this.scene.translate(this.centerX - 0.375, 0, this.centerZ + this.height / 2);
        this.scene.rotate(-Math.PI / 3, 0, 1, 0);
        this.wall.display();
        this.scene.popMatrix();

        //UP
        this.scene.pushMatrix();
        this.scene.translate(this.centerX, 0, this.centerZ - this.height);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.wall.display();
        this.scene.popMatrix();

        //UP RIGHT
        this.scene.pushMatrix();
        this.scene.translate(this.centerX + 0.375, 0, this.centerZ - this.height / 2);
        this.scene.rotate(-4 * Math.PI / 3, 0, 1, 0);
        this.wall.display();
        this.scene.popMatrix();

        //UP LEFT
        this.scene.pushMatrix();
        this.scene.translate(this.centerX - 0.375, 0, this.centerZ - this.height / 2);
        this.scene.rotate(4 * Math.PI / 3, 0, 1, 0);
        this.wall.display();
        this.scene.popMatrix();

        if (this.selectable) {
            this.scene.clearPickRegistration();
        }

    }

    getCenterCoords() {
        return [this.centerX, this.centerZ];
    }

    getPrologTargetForMove() {
        let target = [];
        target.push(this.holdingPiece.getType());
        target.push(Math.floor(this.objectID / 10));
        target.push(this.objectID % 10);
        return target;
    }

    getPrologRep() {
        if (this.holdingPiece == null) {
            return 'e';
        } else {
            return this.holdingPiece.getType();
        }
    }
}