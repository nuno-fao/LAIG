class Player{
    constructor(allPieces,type,player){
        this.pieces=allPieces;
        this.type=type;
        this.player=player;
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

    getUnplayedPiece(color){
        for(let i in this.pieces){
            if(this.pieces[i].getType()==color && !this.pieces[i].wasMoved){
                return this.pieces[i];
            }
        }
        return null;
    }
}