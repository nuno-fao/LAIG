class Piece {
    constructor(scene, type, centerX, centerZ, objectID) {
        this.scene = scene;
        this.type = type;
        this.centerX = centerX;
        this.centerZ = centerZ;
        this.objectID = objectID;
        this.pieceAnimation = null;
        this.pickedTime = 0;

        this.y = 0;

        if (this.type == pieceType.RED) {
            this.nodeID = "P1piece";
        } else {
            this.nodeID = "P2piece";
        }

        //pointer to holding tile if any
        this.holdingTile = null;
        this.wasMoved = false;

        this.selectable = true;
        this.picked = false;


    }

    loadTextures() {
        this.XMLnode = this.scene.graph.nodes[this.nodeID];
    }

    getType() {
        return this.type;
    }

    getTile() {
        return this.holdingTile;
    }

    setTile(tile) {
        this.holdingTile = tile;
        /*let coords = tile.getCenterCoords();
        this.centerX = coords[0];
        this.centerZ = coords[1];*/
        this.holdingTile = tile;
        this.selectable = false;
        this.wasMoved = true;
    }

    removeTile() {
        this.holdingTile = null;
    }

    display() {
        if (this.selectable) {
            this.scene.registerForPick(this.objectID, this);
        }
        this.scene.pushMatrix();
        if (this.pieceAnimation != null)
            this.pieceAnimation.display();
        if (this.picked)
            this.pickedAnimation();
        this.scene.translate(this.centerX, 0.25, this.centerZ);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.XMLnode.display();
        this.scene.popMatrix();

        if (this.selectable) {
            this.scene.clearPickRegistration();
        }
    }

    getCenterCoords() {
        return [this.centerX, this.centerZ];
    }

    pickedAnimation() {
        this.scene.translate(0, this.y * 0.2, 0);
    }

    setPicked(isPicked) {
        this.pickedTime = Date.now();
        this.y = 0;
        this.picked = isPicked;
    }

    movePiece(tile, hasYValue) {
        this.pieceAnimation = new PieceAnimation(this, tile, hasYValue);
    }
    stopPiece(tile) {
        this.pieceAnimation = null;
        let coords = tile.getCenterCoords();
        this.centerX = coords[0];
        this.centerZ = coords[1];
    }
    update(time) {
        if (this.pieceAnimation != null)
            return this.pieceAnimation.update(time);
        if (this.picked)
            this.y = ParametricBlend(time - this.pickedTime, 750);
    }
}

class PieceAnimation {
    constructor(piece, destinationTile, hasYValue) {
        this.piece = piece;
        this.destinationTile = destinationTile;
        this.startTime = Date.now();
        this.startP = piece.getCenterCoords();
        //console.log(this.endP);
        this.endP = destinationTile.getCenterCoords();
        this.hasYValue = hasYValue;
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    update(time) {
        let t = time - this.startTime;
        if (t >= 2000) {
            this.piece.stopPiece(this.destinationTile);
            return 0;
        }
        t /= 2000.0;
        let sqt = t * t;
        let mult = sqt / (2.0 * (sqt - t) + 1.0);
        // console.log(this.endP);
        // console.log(this.startP);
        this.x = (this.endP[0] - this.startP[0]) * mult;
        if (this.hasYValue)
            this.y = ParametricBlend(t * 2000, 2000);
        this.z = (this.endP[1] - this.startP[1]) * mult;
        return 1;
    }
    display() {
        // console.log(this.x, this.y, this.z);
        if (this.piece != null)
            this.piece.scene.translate(this.x, this.y, this.z);
    }
}

function ParametricBlend(t, fullTime) {
    t = t % fullTime;
    t = t / 1000.0;
    t = t / fullTime * 2000.0
    if (t <= 1.0) {
        let sqt = t * t;
        return sqt / (2.0 * (sqt - t) + 1.0);
    } else if (t <= 2.0) {
        t = t - 1.0;
        let sqt = t * t;
        return -sqt / (2.0 * (sqt - t) + 1.0) + 1.0;
    }
}