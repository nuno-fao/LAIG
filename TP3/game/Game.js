class Game{
    constructor(scene){
        this.scene = scene;
        this.board = new Board(this.scene);
    }

    display(){
        this.scene.logPicking();
        this.scene.clearPickRegistration();
        this.board.display();
    }

    onGraphLoaded(){
        this.board.loadXMLNodes();
    }
}