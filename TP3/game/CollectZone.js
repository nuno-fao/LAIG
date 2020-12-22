class CollectZone{
    constructor(scene,board,startX,startZ,text,startID){
        this.scene=scene;
        this.board=board;
        this.startX=startX;
        this.startZ=startZ;
        this.text=text;
        this.startID=startID;
        this.zones=null;

        this.next = 0;

        this.initBuffers();
    }

    getNext(){
        let aux=this.next;
        this.next++;
        return this.zones[aux];
    }

    initBuffers(){
        this.zones = [];
        for(let i=0;i<3;i++){
            let auxZ = this.startZ + i * 0.4330127025 * 2;

            for(let j=0;j<5;j++){
                let auxX = this.startX + j;
                this.zones.push(new BoardTile(this.scene,this.board,tileType.VOID,auxX,auxZ,this.startID));
                this.startID++;
            }
        }
    }

    loadTextures(){
        for(let i in this.zones){
            this.zones[i].loadTextures();
        }
    }

    display(){
        for(let i in this.zones){
            this.zones[i].display();
        }
    }
}