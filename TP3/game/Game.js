class Game{
    constructor(scene){
        this.scene = scene;
        this.board = new Board(this.scene);
        this.lastPicked = null;
        this.newPicked = null;
    }

    display(){
        this.logPicking();
        this.handlePicking();
        this.scene.clearPickRegistration();
        this.board.display();
    }

    onGraphLoaded(){
        this.board.loadXMLNodes();
    }

    
	logPicking() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
					if (obj) {
                        var customId = this.scene.pickResults[i][1];
                        this.newPicked=this.scene.pickResults[i][0];
						console.log("Picked object: " + obj + ", with pick id " + customId);						
					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
    }
    
    handlePicking(){
        if(this.newPicked!=null){

            if(this.lastPicked!=null){

                if(this.newPicked.isTile() && this.lastPicked.isPiece()){
                    let newCoords = this.newPicked.getCenterCoords();
                    this.lastPicked.updateCenter(newCoords[0],newCoords[1]);
                }

            }
            console.log("last",this.lastPicked);
            this.lastPicked=this.newPicked;
            console.log("new",this.lastPicked);
            this.newPicked=null;
        }
        
    }
}