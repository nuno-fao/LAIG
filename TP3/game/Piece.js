class Piece {
    constructor(scene, type, centerX, centerZ, objectID) {
        this.scene = scene;
        this.type = type;
        this.centerX = centerX;
        this.centerY = 0;
        this.centerZ = centerZ;
        this.objectID = objectID;
        this.pieceAnimation = null;
        this.pickedTime = 0;

        this.y = 0;
        this.pickedRotAngle = 0;


        //pointer to holding tile if any
        this.holdingTile = null;
        this.wasMoved = false;

        this.selectable = true;
        this.picked = false;


    }

    loadTextures() {
        if (this.type == pieceType.RED) {
            this.XMLnode = this.scene.graph.templates[this.scene.activeP1Piece];
        } else {
            this.XMLnode = this.scene.graph.templates[this.scene.activeP2Piece];
        }


    }

    getType() {
        return this.type;
    }

    getTile() {
        return this.holdingTile;
    }

    setTile(tile) {
        //this.holdingTile = tile;
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
        this.scene.translate(this.centerX, 0.25 + this.centerY, this.centerZ);
        if (this.picked)
            this.pickedAnimation();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.XMLnode.display();
        this.scene.popMatrix();

        if (this.selectable) {
            this.scene.clearPickRegistration();
        }
    }

    getCenterCoords() {
        return [this.centerX, this.centerZ, this.centerY];
    }

    pickedAnimation() {
        this.scene.translate(0, this.y * 0.4, 0);
        if (this.pickedRotAngle && this.XMLnode.tg_matrix[14] == 0)
            this.scene.rotate(this.pickedRotAngle, 0, 0, 1);
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
        this.centerX = coords[0] - this.XMLnode.tg_matrix[12] - tile.XMLnode.tg_matrix[12];
        this.centerZ = coords[1] - this.XMLnode.tg_matrix[13] - tile.XMLnode.tg_matrix[13];
        this.centerY = this.XMLnode.tg_matrix[14] + tile.XMLnode.tg_matrix[14];
    }
    update(time) {
        if (this.pieceAnimation != null)
            return this.pieceAnimation.update(time);
        if (this.picked) {
            let t = (time - this.pickedTime) % 2000;
            //console.log(t)
            if (t < 850) {
                this.y = ParametricBlend(t, 1700);
                this.pickedRotAngle = 0;
            } else if (t < 1150 && t >= 850) {
                this.pickedRotAngle = Math.PI * 2 * ParametricBlend(t - 850, 600);
                //console.log(this.pickedRotAngle);
            } else {
                this.y = ParametricBlend(t - 300, 1700);
                this.pickedRotAngle = 0;
            }
        }
    }
}

class PieceAnimation {
    constructor(piece, destinationTile, hasYValue) {
        this.piece = piece;
        this.destinationTile = destinationTile;
        this.startP = piece.getCenterCoords();
        //console.log(this.endP);
        this.endP = destinationTile.getCenterCoords();
        this.bias = piece.XMLnode.tg_matrix;
        this.endP[0] -= this.bias[12] + destinationTile.XMLnode.tg_matrix[12];
        this.endP[1] -= this.bias[13] + destinationTile.XMLnode.tg_matrix[13];
        this.endP.push(this.bias[14] + destinationTile.XMLnode.tg_matrix[14]);

        this.startTime = 0;
        this.hasYValue = hasYValue;
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    update(time) {
        if (this.startTime == 0) {
            this.startTime = time;
            return 1;
        }
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
        if (this.hasYValue && this.destinationTile.getType() == 1) {
            if (this.endP[2] != 0) {
                if (t * 2000 <= 1000)
                    this.y = (1 + this.endP[2]) * ParametricBlend((t) * 2000, 2000);
                else {
                    this.y = ParametricBlend((t + 1000) * 2000, 2000) + this.endP[2];
                }
            } else
                this.y = ParametricBlend(t * 2000, 2000);
        }
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