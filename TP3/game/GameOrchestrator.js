class GameOrchestrator{
    constructor(scene){
        this.scene = scene;
        this.board = new Board(this.scene);
        this.gameSequence = new GameSequence();
        this.animator = new Animator(this);
        this.lastPicked = null;
    }

    display(){
        this.board.display();
    }

    onGraphLoaded(){
        this.board.loadXMLNodes();
    }

    getGameSequence(){
        return this.gameSequence;
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
}