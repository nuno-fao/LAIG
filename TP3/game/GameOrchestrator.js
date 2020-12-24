class GameOrchestrator{
    constructor(scene){
        this.scene = scene;
        this.board = new Board(this.scene);
        this.gameSequence = new GameSequence(this);
        this.animator = new Animator(this);
        this.prologInterface = new PrologInterface(this);
        this.lastPicked = null;

        this.player0=null;
        this.player1=null;

        this.turnPlayer=null;

        this.gameStateSeq = new GameState();

        this.gameState=null;

        this.event = Events.WAITING;
    }

    display(){
        this.board.display();
    }

    resetGame(){
        this.board = new Board(this.scene);
        this.lastPicked = null;

        this.player0=null;
        this.player1=null;

        this.turnPlayer=null;

        this.gameStateSeq = new GameState();

        this.gameState=null;

        this.board.loadXMLNodes();

        this.player0 = new Player(this.board.P1pieces,playerType.human,0);
        this.player1 = new Player(this.board.P2pieces,playerType.human,1);
        this.turnPlayer=this.player0;
        this.turnPlayer.makePiecesSelectable(true);
        this.player1.makePiecesSelectable(false);

        this.prologInterface.setInitialState();
    }

    onGraphLoaded(){
        this.board.loadXMLNodes();

        this.player0 = new Player(this.board.P1pieces,playerType.human,0);
        this.player1 = new Player(this.board.P2pieces,playerType.human,1);
        this.turnPlayer=this.player0;
        this.turnPlayer.makePiecesSelectable(true);
        this.player1.makePiecesSelectable(false);

        this.prologInterface.setInitialState();
        
    }

    update(time){
        if(this.event==Events.MOVEDONE){
            this.changeTurn();
            this.event = Events.WAITING;

        } 
        if(this.turnPlayer!=null && this.turnPlayer.type!=playerType.human && this.event==Events.WAITING){
            this.event=Events.REQUESTING;
            this.prologInterface.getAIMove(this.gameState,this.turnPlayer.type);
        }
    }

    getGameSequence(){
        return this.gameSequence;
    }

    changeTurn(){
        if(this.turnPlayer==this.player0){
            this.turnPlayer=this.player1;
            this.player0.makePiecesSelectable(false);
        }
        else if(this.turnPlayer==this.player1){
            this.turnPlayer=this.player0;
            this.player1.makePiecesSelectable(false);
        }
        
        this.turnPlayer.makePiecesSelectable(true);

    }

    applyChangeToPiece(originalCol,originalLine,newCol,newLine){
        let originalTile = this.board.getTileFromCoordinate(parseInt(originalCol),parseInt(originalLine));
        let newTile = this.board.getTileFromCoordinate(parseInt(newCol),parseInt(newLine));
        this.gameStateSeq.addChange(new GameMove(originalTile.getPiece(),originalTile,newTile,originalTile.getCenterCoords(),newTile.getCenterCoords(),this.board));
        this.board.movePiece(originalTile.getPiece(),originalTile,newTile);
    }

    applyPieceRemoval(originalCol,originalLine,color,type){
        let originalTile = this.board.getTileFromCoordinate(parseInt(originalCol),parseInt(originalLine));
        this.gameStateSeq.addRemoved(new GameMove(originalTile.getPiece(),originalTile,null,originalTile.getCenterCoords(),[color,type],this.board));
        this.board.movePieceToCollectZone(originalTile,color,type);
    }
    
    updatePoints(winner,p0p,p1p){
        this.gameStateSeq.addPoints(this.board.P1SS.getText(),this.board.P2SS.getText());
        this.board.updatePoints(p0p,p1p);
        if(winner!="-1"){
            if(winner=="0"){
                alert("Player 1 wins!");
            }
            else if(winner=="1"){
                alert("Player 2 wins!");
            }
            else{
                alert("The game ended in a tie!");
            }
        }
    }
    
	managePick(mode,results) {
		if (mode == false) {
			if (results != null && results.length > 0) {
				for (var i = 0; i < results.length; i++) {
					var obj = results[i][0];
					if (obj) {
                        var customId = results[i][1];
                        this.onObjectSelected(obj,customId);
					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
    }

    onObjectSelected(obj, id){
        console.log("Picked object: " + obj + ", with pick id " + id);
        if(obj instanceof BoardTile){
            if(this.lastPicked instanceof Piece && obj.getPiece()==null){

                this.movePiece(this.lastPicked,obj);
                
                this.prologInterface.makeMove(this.gameState,obj.getPrologTargetForMove());
                
            }
            this.lastPicked=obj;
        }
        else if(obj instanceof Piece){
            this.lastPicked=obj;
        }
        else{
            //nothing happens
        }
    }

    movePiece(piece,tile){
        this.gameStateSeq.addPrologState(this.gameState);
        this.gameStateSeq.addPlay(new GameMove(piece,null,tile,piece.getCenterCoords(),tile.getCenterCoords(),this.board));
        this.board.movePieceToBoard(piece,tile);
        //console.log(this.generateGameState());
    }

    generateGameState(){
        return [this.board.buildBoardString(),
            [this.player0.getRedPieces(),this.player0.getBluePieces(),this.player1.getRedPieces(),this.player1.getBluePieces()],
            [this.player0.getBonusPieces(),this.player1.getBonusPieces(),this.player0.getRiskPieces(),this.player1.getRiskPieces()],
            [this.turnPlayer.getPlayer()]
        ];

    }

    undo(){
        if(this.player0.type==playerType.human || this.player1.type==playerType.human){
            if(this.event==Events.WAITING){
                this.event=Events.REWINDING;
                this.gameSequence.undo();
                this.event=Events.WAITING;
            }
            else{
                alert("Wait for previous move to finish");
            }
            
        }
        else{
            alert("Can't undo on AI vs AI mode");
        }
        
    }
}

const playerType = {
    human : 0,
    easyAI : 1,
    hardAI : 2
}

const Events = {
    WAITING : 0,
    REQUESTING : 1,
    APLLYING : 2,
    MOVING : 3,
    REMOVING : 4,
    MOVEDONE : 5,
    END : 6,
    REWINDING : 7,
}