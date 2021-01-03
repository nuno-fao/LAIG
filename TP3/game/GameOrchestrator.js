class GameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        this.board = new Board(this.scene);
        this.optionsBox = new OptionsMenu(scene);
        this.gameSequence = new GameSequence(this);
        this.animator = new Animator(this);
        this.prologInterface = new PrologInterface(this);
        this.lastPicked = null;

        this.player0 = null;
        this.player1 = null;

        this.turnPlayer = null;

        this.wasAdjusted = false;

        //will hold every change that happens on the board due to a single move
        this.gameStateSeq = new GameState();

        //prolog gamestate for communication
        this.gameState = null;

        this.event = Events.LOADING;

        this.roundTime = null;
        this.startTime = null;
        this.pauseTime = null;
        this.startPause = null;
        this.pauseSum = 0;

        this.playingMovie = -1;
        this.roundMaxTime = 90;

    }

    display_time() {
        if (this.board)
            this.board.displayTime();
    }
    display_points() {
        if (this.board)
            this.board.displayPoints();
    }
    display_message() {
        if (this.board)
            this.board.displayMessage();
    }
    display_board() {
        if (this.board)
            this.board.display();
    }
    display_options_box() {
        this.optionsBox.display();
    }

    checkProlog() {
        return this.prologInterface.serverStatus;
    }


    resetGame() {
        this.event = Events.LOADING;

        this.scene.camAngle = 0;
        this.scene.rotatingCam = false;

        if (this.playingMovie == -1) {
            this.gameSequence = new GameSequence(this);
        }

        this.wasAdjusted = false;

        this.board = new Board(this.scene);
        this.lastPicked = null;

        this.turnPlayer = null;

        this.gameStateSeq = new GameState();

        this.gameState = null;

        this.player0.setPieces(this.board.P1pieces);
        this.player1.setPieces(this.board.P2pieces);


        this.board.loadTemplates();
        this.turnPlayer = this.player0;
        this.scene.resetCamera();
        this.turnPlayer.makePiecesSelectable(true);
        this.player1.makePiecesSelectable(false);

        this.roundTime = null;
        this.startTime = null;
        this.pauseTime = null;
        this.startPause = null;
        this.pauseSum = 0;

        this.prologInterface.setInitialState();
    }

    onGraphLoaded() {
        this.board.loadTemplates();

        if (this.scene.graph.first) {
            this.player0 = new Player(this.board.P1pieces, playerType.human, 0);
            this.player1 = new Player(this.board.P2pieces, playerType.human, 1);
            this.turnPlayer = this.player0;
            this.turnPlayer.makePiecesSelectable(true);
            this.player1.makePiecesSelectable(false);

            this.prologInterface.setInitialState();
        }
        this.scene.resetCamera();

    }

    update(time) {
        console.log(this.event);

        this.optionsBox.update(time);

        if (this.playingMovie == -1) {
            switch (this.event) {
                case Events.WAITING:
                    {
                        if (this.ForcePause) {
                            this.event = Events.PAUSE;
                            this.ForcePause = false;
                        }
                        if (this.lastPicked != null && this.lastPicked instanceof Piece) {
                            this.lastPicked.update(time);
                        }
                        if (this.turnPlayer != null && this.turnPlayer.type != playerType.human && this.event == Events.WAITING) {
                            this.event = Events.REQUESTING;
                            this.prologInterface.getAIMove(this.gameState, this.turnPlayer.type);
                        }
                        if (this.startTime == null) {
                            this.startTime = time;
                        } else {
                            let seconds = (this.roundTime - Math.floor((time - this.startTime) / 1000) + this.pauseSum);
                            this.board.updateRoundTime(seconds.toString());
                            if (seconds <= 0) {
                                this.event = Events.END;
                                if (this.turnPlayer == this.player0) {
                                    this.board.updateMessage("Time Ran Out. Player 2 wins!");
                                } else {
                                    this.board.updateMessage("Time Ran Out. Player 1 wins!");
                                }
                            }
                        }
                        break;
                    }
                case Events.REQUESTING:
                    {
                        //do nothing
                        break;
                    }
                case Events.APLLYING:
                    {
                        if (this.gameStateSeq.play.piece.update(time) == 0) {
                            this.event = Events.MOVING;

                            for (let i in this.gameStateSeq.changes) {
                                this.board.movePiece(this.gameStateSeq.changes[i].origin.getPiece(), this.gameStateSeq.changes[i].origin, this.gameStateSeq.changes[i].destination);
                            }
                        }
                        break;
                    }
                case Events.MOVING:
                    {
                        let ended = true;
                        for (let i in this.gameStateSeq.changes) {
                            if (this.gameStateSeq.changes[i].piece.update(time) != 0) {
                                ended = false;
                            }
                        }
                        if (ended) {
                            this.gameStateSeq.updateRemovals();
                            this.event = Events.REMOVING;
                            for (let i in this.gameStateSeq.removed) {
                                this.board.movePieceToCollectZone(this.gameStateSeq.removed[i].origin, this.gameStateSeq.removed[i].destCoords[0], this.gameStateSeq.removed[i].destCoords[1]);
                                //this.board.movePiece(this.gameStateSeq.changes[i].origin.getPiece(), this.gameStateSeq.changes[i].origin, this.gameStateSeq.changes[i].destination);
                            }
                        }
                        break;
                    }
                case Events.REMOVING:
                    {
                        let ended = true;
                        for (let i in this.gameStateSeq.removed) {
                            if (this.gameStateSeq.removed[i].piece.update(time) != 0) {
                                ended = false;
                            }
                        }
                        if (ended) {
                            this.board.updatePoints(this.gameStateSeq.newPoints[1], this.gameStateSeq.newPoints[2]);

                            if (this.changeTurn(true)) {
                                this.event = Events.ROTATE_CAM;
                            } else {
                                this.event = Events.MOVE_DONE;
                            }
                        }
                        break;
                    }
                case Events.ROTATE_CAM:
                    {
                        //do nothing
                        break;
                    }
                case Events.MOVE_DONE:
                    {
                        if (this.gameStateSeq.newPoints[0] != "-1") {
                            if (this.gameStateSeq.newPoints[0] == "0") {
                                this.board.updateMessage("Player 1 wins!");
                            } else if (this.gameStateSeq.newPoints[0] == "1") {
                                this.board.updateMessage("Player 2 wins!");
                            } else {
                                this.board.updateMessage("Game ended in a tie!");
                            }
                            this.event = Events.END;
                        } else {
                            this.board.clearMessage();
                            this.event = Events.WAITING;
                        }
                        this.gameSequence.newMove();
                        break;
                    }
                case Events.PAUSE:
                    {

                        if (this.startPause == null) {
                            this.startPause = time;
                        }
                        this.pauseTime = time;
                        break;
                    }
                default:

                    break;
            }
        }


        //MOVIE
        else {
            switch (this.event) {
                case Events.WAITING:
                    {
                        if (this.ForcePause) {
                            this.event = Events.PAUSE;
                            this.ForcePause = false;
                        }
                        //make move
                        this.newGameStateSeq = this.gameSequence.moves[this.playingMovie];
                        this.movePieceReplay(this.newGameStateSeq.play.piece, this.newGameStateSeq.play.destination);
                        break;
                    }
                case Events.APLLYING:
                    {
                        if (this.newGameStateSeq.play.piece.update(time) == 0) {
                            this.event = Events.MOVING;

                            for (let i in this.newGameStateSeq.changes) {
                                this.board.movePiece(this.newGameStateSeq.changes[i].origin.getPiece(), this.newGameStateSeq.changes[i].origin, this.newGameStateSeq.changes[i].destination);
                            }
                        }
                        break;
                    }
                case Events.MOVING:
                    {
                        let ended = true;
                        for (let i in this.newGameStateSeq.changes) {
                            if (this.newGameStateSeq.changes[i].piece.update(time) != 0) {
                                ended = false;
                            }
                        }
                        if (ended) {
                            this.newGameStateSeq.updateRemovals();
                            this.event = Events.REMOVING;
                            for (let i in this.newGameStateSeq.removed) {
                                this.board.movePieceToCollectZone(this.newGameStateSeq.removed[i].origin, this.newGameStateSeq.removed[i].destCoords[0], this.newGameStateSeq.removed[i].destCoords[1]);
                                //this.board.movePiece(this.gameStateSeq.changes[i].origin.getPiece(), this.gameStateSeq.changes[i].origin, this.gameStateSeq.changes[i].destination);
                            }
                        }
                        break;
                    }
                case Events.REMOVING:
                    {
                        let ended = true;
                        for (let i in this.newGameStateSeq.removed) {
                            if (this.newGameStateSeq.removed[i].piece.update(time) != 0) {
                                ended = false;
                            }
                        }
                        if (ended) {
                            this.board.updatePoints(this.newGameStateSeq.newPoints[1], this.newGameStateSeq.newPoints[2]);
                            this.changeTurn(false);
                            if (this.newGameStateSeq.newPoints[0] != "-1") {
                                if (this.newGameStateSeq.newPoints[0] == "0") {
                                    this.board.updateMessage("Player 1 wins!");
                                } else if (this.newGameStateSeq.newPoints[0] == "1") {
                                    this.board.updateMessage("Player 2 wins!");
                                } else {
                                    this.board.updateMessage("Game ended in a tie!");
                                }
                                this.event = Events.END;
                            } else {
                                this.event = Events.MOVE_DONE;
                            }
                        }
                        break;
                    }
                case Events.ROTATE_CAM:
                    {
                        //do nothing
                        break;
                    }
                case Events.MOVE_DONE:
                    {
                        //this.gameSequence.newMove();
                        if (this.gameSequence.moves.length == this.playingMovie + 1) {
                            this.playingMovie = -1;
                        } else {
                            this.playingMovie++;

                        }
                        this.event = Events.WAITING;
                        break;
                    }
                case Events.END:
                    {
                        //this.gameSequence.newMove();
                        this.playingMovie = -1;
                        break;
                    }
                default:

                    break;
            }
        }
    }

    getGameSequence() {
        return this.gameSequence;
    }

    startGame() {
        this.event = Events.WAITING;
        this.roundTime = this.roundMaxTime;
        this.startTime = null;
        this.pauseTime = null;
        this.startPause = null;
        this.pauseSum = 0;
        this.board.updateRoundTime(this.roundTime.toString());
    }

    changeTurn(rotate) {
        let out = false;

        this.startTime = null;
        this.pauseTime = null;
        this.startPause = null;
        this.pauseSum = 0;

        this.board.clearMessage();

        if (rotate) {
            if (this.player1.type == playerType.human && (this.player0.type == playerType.human || !this.wasAdjusted)) {
                this.wasAdjusted = true;
                this.scene.rotatingCam = true;
                this.scene.resetCamera();
                out = true;
            }
        }

        if (this.turnPlayer == this.player0) {
            this.turnPlayer = this.player1;
            this.player0.makePiecesSelectable(false);
        } else if (this.turnPlayer == this.player1) {
            this.turnPlayer = this.player0;
            this.player1.makePiecesSelectable(false);
        }
        if (this.turnPlayer.type == playerType.human) {
            this.turnPlayer.makePiecesSelectable(true);
        } else {
            this.turnPlayer.makePiecesSelectable(false);
        }

        if (!rotate && this.playingMovie == -1) {
            this.scene.resetCamera();
        }

        return out;

    }

    getTurnPlayer() {
        if (this.turnPlayer == this.player0) {
            return "1";
        } else if (this.turnPlayer == this.player1) {
            return "2";
        }
    }

    applyChangeToPiece(originalCol, originalLine, newCol, newLine) {
        let originalTile = this.board.getTileFromCoordinate(parseInt(originalCol), parseInt(originalLine));
        let newTile = this.board.getTileFromCoordinate(parseInt(newCol), parseInt(newLine));
        this.gameStateSeq.addChange(new GameMove(originalTile.getPiece(), originalTile, newTile, originalTile.getCenterCoords(), newTile.getCenterCoords(), this.board));
        //this.board.movePiece(originalTile.getPiece(), originalTile, newTile);
    }

    applyPieceRemoval(originalCol, originalLine, color, type) {
        let originalTile = this.board.getTileFromCoordinate(parseInt(originalCol), parseInt(originalLine));
        this.gameStateSeq.addRemoved(new GameMove(null, originalTile, null, originalTile.getCenterCoords(), [color, type], this.board));
        //this.board.movePieceToCollectZone(originalTile, color, type);
    }

    updatePoints(winner, p0p, p1p) {
        this.gameStateSeq.addPoints(this.board.P1SS.getText(), this.board.P2SS.getText());
        this.gameStateSeq.addNewPoints([winner, p0p, p1p]);
    }

    managePick(mode, results) {
        if (mode == false) {
            if (results != null && results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    var obj = results[i][0];
                    if (obj) {
                        var customId = results[i][1];
                        this.onObjectSelected(obj, customId);
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

    onObjectSelected(obj, id) {
        if (this.lastPicked instanceof Piece)
            this.lastPicked.setPicked(false);
        if (obj instanceof BoardTile) {
            if (this.event == Events.WAITING && this.lastPicked instanceof Piece && obj.getPiece() == null) {

                this.movePiece(this.lastPicked, obj);

                this.prologInterface.makeMove(this.gameState, obj.getPrologTargetForMove());

            }
            this.lastPicked = obj;
        } else if (obj instanceof Piece) {
            obj.setPicked(true);
            obj.pickedAnimation();
            this.lastPicked = obj;
        } else if (obj instanceof Button) {
            obj.setPicked();
            obj.pickedAnimation()
        } else if (obj instanceof CBox) {
            obj.setPicked();
        }
    }

    movePiece(piece, tile) {
        this.gameStateSeq.addPrologState(this.gameState);
        this.gameStateSeq.addPlay(new GameMove(piece, null, tile, piece.getCenterCoords(), tile.getCenterCoords(), this.board));
        this.board.movePieceToBoard(piece, tile);
        this.event = Events.APLLYING;
        //console.log(this.generateGameState());
    }

    movePieceReplay(piece, tile) {
        this.board.movePieceToBoard(piece, tile);
        this.event = Events.APLLYING;
    }

    generateGameState() {
        return [this.board.buildBoardString(), [this.player0.getRedPieces(), this.player0.getBluePieces(), this.player1.getRedPieces(), this.player1.getBluePieces()],
            [this.player0.getBonusPieces(), this.player1.getBonusPieces(), this.player0.getRiskPieces(), this.player1.getRiskPieces()],
            [this.turnPlayer.getPlayer()]
        ];

    }

    undo() {
        if (this.player0.type == playerType.human || this.player1.type == playerType.human) {
            if (this.event == Events.WAITING || this.event == Events.END) {
                this.event = Events.REWINDING;
                this.gameSequence.undo();
                this.event = Events.WAITING;
            } else {}

        } else {

        }

    }

    pause() {
        if (this.event == Events.PAUSE) {
            this.pauseSum += Math.floor((this.pauseTime - this.startPause) / 1000);
            this.pauseTime = null;
            this.startPause = null;
            this.event = Events.WAITING;
            this.board.clearMessage();
            this.ForcePause = false;
        } else {
            this.ForcePause = true;
            this.board.updateMessage("Game paused");
        }
    }

    playMovie() {
        if ((this.event == Events.WAITING || this.event == Events.END) && this.gameSequence.moves.length > 0 && this.playingMovie == -1) {
            this.board.updateMessage("Playing movie");
            this.playingMovie = 0;
            this.event = Events.WAITING;
            this.gameSequence.undoAll();
        }
    }
}


const playerType = {
    human: 0,
    easyAI: 1,
    hardAI: 2
}

const Events = {
    LOADING: -1,
    WAITING: 0,
    REQUESTING: 1,
    APLLYING: 2,
    MOVING: 3,
    REMOVING: 4,
    MOVE_DONE: 5,
    END: 6,
    REWINDING: 7,
    ROTATE_CAM: 8,
    PAUSE: 9,
}