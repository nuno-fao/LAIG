class Board {
    constructor(scene) {
        this.scene = scene;
        this.board = [];
        this.P1pieces = [];
        this.P2pieces = [];
        this.collectZones = null;
        this.P1SS = new MySpriteText(this.scene, "00");
        this.P2SS = new MySpriteText(this.scene, "00");
        this.time = new MySpriteText(this.scene, "00");
        this.holderNode = null;

        this.initBuffers();
    }

    initBuffers() {
        this.initBoard();
        this.initPlayers();
        this.initCollectZones();
    }

    initCollectZones() {
        this.collectZones = {
            'RB': new CollectZone(this.scene, this, 3.5, 1.75, "RED BONUS", 131),
            'RR': new CollectZone(this.scene, this, -7.5, 1.75, "RED RISK", 146),
            'BB': new CollectZone(this.scene, this, -7.5, -3.5, "BLUE BONUS", 146),
            'BR': new CollectZone(this.scene, this, 3.5, -3.5, "BLUE RISK", 146),
        }

        this.riskSS = new MySpriteText(this.scene, "RISK ZONE");
        this.bonusSS = new MySpriteText(this.scene, "BONUS ZONE");
    }

    initPlayers() {
        let ID = 100;

        let startZ = 4;
        let startX = -2.25;

        for (let i = 0; i < 10; i++) {
            ID++;
            this.P1pieces.push(new Piece(this.scene, pieceType.RED, startX, startZ, ID));
            startX += 0.5;
        }

        startZ = 3.5;
        startX = -1;

        for (let i = 0; i < 5; i++) {
            ID++;
            this.P1pieces.push(new Piece(this.scene, pieceType.BLUE, startX, startZ, ID));
            startX += 0.5;
        }

        startZ = -4;
        startX = -2.25;

        for (let i = 0; i < 10; i++) {
            ID++;
            this.P2pieces.push(new Piece(this.scene, pieceType.BLUE, startX, startZ, ID));
            startX += 0.5;
        }

        startZ = -3.5;
        startX = -1;
        for (let i = 0; i < 5; i++) {
            ID++;
            this.P2pieces.push(new Piece(this.scene, pieceType.RED, startX, startZ, ID));
            startX += 0.5;
        }
    }

    initBoard() {
        let col1 = [];
        let col2 = [];
        let col3 = [];
        let col4 = [];
        let col5 = [];
        let col6 = [];
        let col7 = [];

        this.fillCol(4, col1, -2.25, -1.5, true, 10);
        this.board.push(col1);

        this.fillCol(5, col2, -1.5, -2, false, 20);
        this.board.push(col2);

        this.fillCol(6, col3, -0.75, -2.5, false, 30);
        this.board.push(col3);

        this.fillCol(7, col4, 0, -3, false, 40);
        this.board.push(col4);

        this.fillCol(6, col5, 0.75, -2.5, false, 50);
        this.board.push(col5);

        this.fillCol(5, col6, 1.5, -2, false, 60);
        this.board.push(col6);

        this.fillCol(4, col7, 2.25, -1.5, true, 70);
        this.board.push(col7);
    }

    buildBoardString() {
        let prologBoard = [
            [this.board[3][0].getPrologRep()],
            [this.board[2][0].getPrologRep(), this.board[4][0].getPrologRep()],
            [this.board[1][0].getPrologRep(), this.board[3][1].getPrologRep(), this.board[5][0].getPrologRep()],
            [this.board[0][0].getPrologRep(), this.board[2][1].getPrologRep(), this.board[4][1].getPrologRep(), this.board[6][0].getPrologRep()],
            [this.board[1][1].getPrologRep(), this.board[3][2].getPrologRep(), this.board[5][1].getPrologRep()],
            [this.board[0][1].getPrologRep(), this.board[2][2].getPrologRep(), this.board[4][2].getPrologRep(), this.board[6][1].getPrologRep()],
            [this.board[1][2].getPrologRep(), this.board[3][3].getPrologRep(), this.board[5][2].getPrologRep()],
            [this.board[0][2].getPrologRep(), this.board[2][3].getPrologRep(), this.board[4][3].getPrologRep(), this.board[6][2].getPrologRep()],
            [this.board[1][3].getPrologRep(), this.board[3][4].getPrologRep(), this.board[5][3].getPrologRep()],
            [this.board[0][3].getPrologRep(), this.board[2][4].getPrologRep(), this.board[4][4].getPrologRep(), this.board[6][3].getPrologRep()],
            [this.board[1][4].getPrologRep(), this.board[3][5].getPrologRep(), this.board[5][4]],
            [this.board[2][5].getPrologRep(), this.board[4][5].getPrologRep()],
            [this.board[3][6].getPrologRep()]
        ];
        return prologBoard;
    }

    fillCol(nrOfTiles, col, firstX, firstZ, allVoid, startingID) {
        let tileHeight = 0.4330127025 * 2;
        firstZ = firstZ * tileHeight;
        for (let i = 0; i < nrOfTiles; i++) {
            startingID++;
            if (allVoid) {
                col.push(new BoardTile(this.scene, this, tileType.VOID, firstX, firstZ, startingID));

            } else {
                if (i == 0 || i == (nrOfTiles - 1)) {
                    col.push(new BoardTile(this.scene, this, tileType.VOID, firstX, firstZ, startingID));
                } else {
                    col.push(new BoardTile(this.scene, this, tileType.BOARD_NV, firstX, firstZ, startingID));
                }
            }
            firstZ += tileHeight;
        }
    }

    loadTemplates() {
        for (let i in this.board) {
            for (let j in this.board[i]) {
                this.board[i][j].loadTextures();
            }
        }

        for (let i in this.P1pieces) {
            this.P1pieces[i].loadTextures();
        }

        for (let i in this.P2pieces) {
            this.P2pieces[i].loadTextures();
        }

        this.collectZones['RB'].loadTextures();
        this.collectZones['RR'].loadTextures();
        this.collectZones['BB'].loadTextures();
        this.collectZones['BR'].loadTextures();

        this.holderNode=this.scene.graph.templates[this.scene.activeHolder];
    }

    updateRoundTime(time){
        if(time.length==1){
            time="0"+time;
        }
        this.time.updateText(time);
    }

    movePieceToBoard(piece, tile) {
        if (tile.getPiece() == null && piece.getTile() == null) {
            piece.movePiece(tile, true);
            piece.setTile(tile);
            tile.setPiece(piece);
        }
    }

    movePieceToCollectZone(originalTile, color, type) {
        let targetTile = null;
        let piece = originalTile.getPiece();
        if (color == 'red') {
            if (type == 'risk') {
                targetTile = this.collectZones['RR'].getNext();
            } else if (type == 'bonus') {
                targetTile = this.collectZones['RB'].getNext();
            }
        } else if (color == 'blue') {
            if (type == 'risk') {
                targetTile = this.collectZones['BR'].getNext();
            } else if (type == 'bonus') {
                targetTile = this.collectZones['BB'].getNext();
            }
        }
        piece.movePiece(targetTile, true);
        piece.setTile(targetTile);
        originalTile.removePiece();
        targetTile.setPiece(piece);
    }

    movePiece(piece, startTile, finalTile) {
        if (piece.getTile() == startTile && finalTile.getPiece() == null) {
            piece.movePiece(finalTile, false);
            piece.setTile(finalTile);
            startTile.removePiece();
            finalTile.setPiece(piece);
        }
    }

    removePieceFromTile(piece, tile) {
        if (tile.getPiece == piece) {
            piece.removeTile();
            tile.removePiece();
        }
    }

    getTileFromCoordinate(col, line) {
        return this.board[col - 1][line - 1];
    }

    getTileFromPiece(piece) {
        return piece.getTile;
    }

    getPieceFromTile(tile) {
        return tile.getPiece;
    }

    updatePoints(p0, p1) {
        if(p0.length==1){
            p0 = "0"+p0;
        }
        if(p1.length==1){
            p1 = "0"+p1;
        }
        this.P1SS.updateText(p0);
        this.P2SS.updateText(p1);
    }


    display() {
        for (let i in this.board) {
            for (let j in this.board[i]) {
                this.board[i][j].display();
            }
        }

        this.collectZones['RB'].display();
        this.collectZones['RR'].display();
        this.collectZones['BB'].display();
        this.collectZones['BR'].display();

        this.scene.pushMatrix();
        this.scene.translate(-5.5, 0, 1)
        this.scene.scale(0.5, 1, 0.7);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.riskSS.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-5.5, 0, -1)
        this.scene.scale(-0.5, 1, 0.7);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.bonusSS.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(5.5, 0, 1)
        this.scene.scale(0.5, 1, 0.7);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.bonusSS.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(5.5, 0, -1)
        this.scene.scale(-0.5, 1, 0.7);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.riskSS.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(9, 0.5, -2.5);
        this.scene.scale(1, 2, 2);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.P2SS.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(9, 0.5, 3);
        this.scene.scale(1, 2, 2);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.P1SS.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(9, 3, 0.35);
        this.scene.scale(1, 2, 2);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.time.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.125, 3.7);
        this.scene.scale(5, 0.25, 1.2);
        this.holderNode.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.125, -3.7);
        this.scene.scale(5, 0.25, 1.2);
        this.holderNode.display();
        this.scene.popMatrix();

        for (let i in this.P1pieces) {
            this.P1pieces[i].display();
        }

        for (let i in this.P2pieces) {
            this.P2pieces[i].display();
        }


    }
}

const pieceType = {
    RED: 'r',
    BLUE: 'b'
}

const tileType = {
    VOID: 0,
    BOARD_NV: 1, //board not void
}