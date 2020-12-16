class Player{
    constructor(redPieces,bluePieces,type,player){
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

    
}