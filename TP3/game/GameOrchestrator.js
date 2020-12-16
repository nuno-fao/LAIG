class GameOrchestrator{
    constructor(scene){
        this.scene = scene;
        this.board = new Board(this.scene);
        this.gameSequence = new GameSequence();
        this.animator = new Animator(this);
        this.serverComm = new PrologInterface();
        this.lastPicked = null;

        this.player0=null;
        this.player1=null;

        this.turnPlayer=null;
    }

    display(){
        this.board.display();
    }

    onGraphLoaded(){
        this.board.loadXMLNodes();

        this.serverComm.getPrologRequest("handshake");

        this.player0 = new Player(10,5,playerType.HUMAN,0);
        this.player1 = new Player(5,10,playerType.HUMAN,1);
        this.turnPlayer=this.player0;
        //this.serverComm.getPrologRequest("test(1,2)");
    }

    getGameSequence(){
        return this.gameSequence;
    }

    changeTurn(){
        (this.turnPlayer==this.player0) ? this.turnPlayer=this.player1 : this.turnPlayer=this.player0;
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
                this.board.movePieceToBoard(this.lastPicked,obj);
                this.turnPlayer.changeUnused(this.lastPicked);
                
                console.log(this.generateGameState());
                this.changeTurn();
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

    generateGameState(){
        return [this.board.buildBoardString(),
            [this.player0.getRedPieces(),this.player0.getBluePieces(),this.player1.getRedPieces(),this.player1.getBluePieces()],
            [this.player0.getBonusPieces(),this.player1.getBonusPieces(),this.player0.getRiskPieces(),this.player1.getRiskPieces()],
            [this.turnPlayer.getPlayer()]
        ];

    }
}

const playerType = {
    HUMAN : 0,
    AI : 1
}