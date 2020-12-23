class GameSequence{
    constructor(){
        this.moves=[];
    }
    addMove(prologState,boardInstance){
        this.moves.push(new GameState(prologState,boardInstance));
    }
    undo(){

    }
    // moveReplay(){
    // }

}

class GameState{
    constructor(prologState,boardInstance){
        this.prologState=prologState;
        this.boardInstance=boardInstance;
    }
}