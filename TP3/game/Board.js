
class Board{
    constructor(scene) {
        this.scene=scene;
        this.board=[];
        this.initBuffers();
    }

    initBuffers(){
        let col1=[];
        let col2=[];
        let col3=[];
        let col4=[];
        let col5=[];
        let col6=[];
        let col7=[];

        this.fillCol(4,col1,-2.25,-1.5,true,10);
        this.board.push(col1);

        this.fillCol(5,col2,-1.5,-2,false,20);
        this.board.push(col2);

        this.fillCol(6,col3,-0.75,-2.5,false,30);
        this.board.push(col3);

        this.fillCol(7,col4,0,-3,false,40);
        this.board.push(col4);

        this.fillCol(6,col5,0.75,-2.5,false,50);
        this.board.push(col5);

        this.fillCol(5,col6,1.5,-2,false,60);
        this.board.push(col6);

        this.fillCol(4,col7,2.25,-1.5,true,70);
        this.board.push(col7);
    }

    fillCol(nrOfTiles,col,firstX,firstZ,allVoid,startingID){
        for(let i=0;i<nrOfTiles;i++){
            startingID++;
            if(allVoid){
                col.push(new BoardTile(this.scene,"voidTile",firstX,firstZ,startingID));

            }
            else{
                if(i==0 || i==(nrOfTiles-1)){
                    col.push(new BoardTile(this.scene,"voidTile",firstX,firstZ,startingID));
                }
                else{
                    col.push(new BoardTile(this.scene,"normalTile",firstX,firstZ,startingID));
                }
            }
            firstZ++;
        }
    }

    loadXMLNodes(){
        for(let i in this.board){
            for(let j in this.board[i]){
                this.board[i][j].loadTextures();
            }
        }
    }

    
    
    display(){
        for(let i in this.board){
            for(let j in this.board[i]){
                this.board[i][j].display();
            }
        }
    }
}