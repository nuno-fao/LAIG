class Player{
    constructor(allPieces,redPieces,bluePieces,type,player){
        this.pieces=allPieces;
        this.redPieces = redPieces;
        this.bluePieces = bluePieces;
        this.bonusPieces = 0;
        this.riskPieces = 0;
        this.type=type;
        this.player=player;
    }

    getRedPieces(){
        return this.redPieces;
    }
    getBluePieces(){
        return this.bluePieces;
    }
    getBonusPieces(){
        return this.bonusPieces;
    }
    getRiskPieces(){
        return this.riskPieces;
    }
    getTotalPieces(){
        return this.redPieces + this.bluePieces;
    }
    getType(){
        return this.type;
    }
    getPlayer(){
        return this.player;
    }

    changeUnused(piece){
        if(piece.getType()=="r"){
            this.redPieces--;
        }
        else{
            this.bluePieces--;
        }
    }

    makePiecesSelectable(state){
        if(state){
            for(let i in this.pieces){
                if(this.pieces[i].wasMoved){
                    this.pieces[i].selectable=false;
                }else{
                    this.pieces[i].selectable=true;
                }
                    
            }
        }
        else{
            for(let i in this.pieces){
                this.pieces[i].selectable=false;
            }
        }
    }
}