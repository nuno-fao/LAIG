
class Board{
    constructor(scene) {
        this.scene=scene;
        this.cols=[];
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

        this.fillCol(4,col1,-2.25,-1.5,true);
        this.cols.push(col1);

        this.fillCol(5,col2,-1.5,-2,false);
        this.cols.push(col2);

        this.fillCol(6,col3,-0.75,-2.5,false);
        this.cols.push(col3);

        this.fillCol(7,col4,0,-3,false);
        this.cols.push(col4);

        this.fillCol(6,col5,0.75,-2.5,false);
        this.cols.push(col5);

        this.fillCol(5,col6,1.5,-2,false);
        this.cols.push(col6);

        this.fillCol(4,col7,2.25,-1.5,true);
        this.cols.push(col7);
    }
    
    display(){
        for(let i in this.cols){
            for(let j in this.cols[i]){
                this.cols[i][j].display();
            }
        }
    }

    fillCol(nrOfTiles,col,firstX,firstZ,allVoid){
        for(let i=0;i<nrOfTiles;i++){
            if(allVoid){
                col.push(new BoardTile(this.scene,"voidTile",firstX,firstZ));

            }
            else{
                if(i==0 || i==(nrOfTiles-1)){
                    col.push(new BoardTile(this.scene,"voidTile",firstX,firstZ));
                }
                else{
                    col.push(new BoardTile(this.scene,"normalTile",firstX,firstZ));
                }
            }
            firstZ++;
        }
    }
}