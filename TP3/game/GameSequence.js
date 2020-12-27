class GameSequence{
    constructor(gameOrchestrator){
        this.gameOrchestrator=gameOrchestrator;
        this.moves=[];
    }
    newMove(){
        this.moves.push(this.gameOrchestrator.gameStateSeq);
        this.gameOrchestrator.gameStateSeq = new GameState();
    }

    undo(){
        if(this.moves.length == 0){
            //do nothing
        }
        else{
            this.applyChangesToOrchestrator(this.moves[this.moves.length-1]);
            this.moves.pop();
            if(this.gameOrchestrator.turnPlayer.type != playerType.human){
                this.applyChangesToOrchestrator(this.moves[this.moves.length-1]);
                this.moves.pop();
            }
        }
    }
    // moveReplay(){
    // }

    applyChangesToOrchestrator(move){
        //update removed pieces
        for(let i in move.removed){
            move.removed[i].piece.removeTile();
            move.removed[i].piece.setTile(move.removed[i].origin);
            move.removed[i].origin.setPiece(move.removed[i].piece);

            if(move.removed[i].destCoords[0]=='red'){
                if(move.removed[i].destCoords[1]=='risk'){
                    this.gameOrchestrator.board.collectZones['RR'].getLast();
                }
                else if(move.removed[i].destCoords[1]=='bonus'){
                    this.gameOrchestrator.board.collectZones['RB'].getLast();
                }
            }
            else if(move.removed[i].destCoords[0]=='blue'){
                if(move.removed[i].destCoords[1]=='risk'){
                    this.gameOrchestrator.board.collectZones['BR'].getLast();
                }
                else if(move.removed[i].destCoords[1]=='bonus'){
                    this.gameOrchestrator.board.collectZones['BB'].getLast();
                }
            }
        }

        //update changes on board
        for(let i in move.changes){
            this.gameOrchestrator.board.movePiece( move.changes[i].destination.getPiece(), move.changes[i].destination,move.changes[i].origin);
        }
        
        //revert play
        move.play.piece.removeTile();
        move.play.piece.wasMoved=false;
        move.play.piece.centerX=move.play.originCoords[0];
        move.play.piece.centerZ=move.play.originCoords[1];
        move.play.piece.selectable=true;
        move.play.destination.removePiece();
        

        //update points
        this.gameOrchestrator.board.updatePoints(move.points[0],move.points[1]);

        //update gamestate
        this.gameOrchestrator.gameState=move.prologState;

        //change turn
        this.gameOrchestrator.changeTurn();

    }

}

class GameState{
    constructor(){
        this.play = null;
        this.changes = [];
        this.removed = [];
        this.points = [];
        this.prologState = null;
        this.newPoints = null;
    }

    addPlay(play){
        this.play = play;
    }

    addChange(change){
        this.changes.push(change)
    }

    addRemoved(removed){
        this.removed.push(removed);
    }

    addPoints(points0,points1){
        this.points=[points0,points1];
    }

    addPrologState(state){
        this.prologState=state;
    }

    addNewPoints(newPoints){
        this.newPoints = newPoints;
    }
}