class Box {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.x = x / 2.0;
        this.y = y / 2.0;
        this.z = z / 2.0;
        this.backRectBF = new MyRectangle(this.scene, -x, y, x, -y, 1, 1);
        this.backRectLR = new MyRectangle(this.scene, -z, y, z, -y, 1, 1);
        this.backRectTB = new MyRectangle(this.scene, -x, z, x, -z, 1, 1);
    }

    display() {

        //front
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.z * 2.0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.backRectBF.display();
        this.scene.popMatrix();

        //back
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -this.z * 2.0);
        this.backRectBF.display();
        this.scene.popMatrix();

        //right
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0, -this.x * 2.0);
        this.backRectLR.display();
        this.scene.popMatrix();

        //left
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(0, 0, -this.x * 2.0);
        this.backRectLR.display();
        this.scene.popMatrix();

        //top
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0, -this.y * 2.0);
        this.backRectTB.display();
        this.scene.popMatrix();

        //bottom
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, 0, -this.y * 2.0);
        this.backRectTB.display();
        this.scene.popMatrix();
    }
}

class Button {
    constructor(scene, x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.box = new Box(scene, x, y, z);
    }
    display(text) {
        this.scene.pushMatrix()
        this.scene.translate(0, 0, 0.2);

        this.scene.pushMatrix()
        this.scene.translate(0, 0, -this.z - 0.001);
        this.box.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.02, 0, 0);
        this.scene.scale(this.x * 2.0 / text.text.length, this.x * 2.0 / text.text.length, this.x * 2.0 / text.text.length);
        text.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}

class OptionsMenu {
    constructor(scene) {
        this.paused = false;
        this.player1 = 0;
        this.player2 = 0;
        this.scene = scene;

        this.Undo = new MySpriteText(this.scene, "Undo");
        this.Pause = new MySpriteText(this.scene, "Pause");
        this.Play = new MySpriteText(this.scene, "Play");
        this.Player1 = new MySpriteText(this.scene, "Player 1");
        this.Player2 = new MySpriteText(this.scene, "Player 2");
        this.Human = new MySpriteText(this.scene, "Human");
        this.HardAI = new MySpriteText(this.scene, "Hard AI");
        this.EasyAI = new MySpriteText(this.scene, "Easy AI");
        this.PlayMovie = new MySpriteText(this.scene, "Play Movie");
        this.ResetCamera = new MySpriteText(this.scene, "Reset Camera");
        this.NewGame = new MySpriteText(this.scene, "New Game");

        this.BackBox = new Box(scene, 2, 2, 0.1);
        this.UndoButton = new Button(scene, 0.5, 0.2, 0.1);
        this.PauseButton = new Button(scene, 0.6, 0.2, 0.1);
    }


    display() {
        this.scene.pushMatrix()
        this.BackBox.display();
        this.T = {...this.scene.activeTexture };

        this.scene.pushMatrix();
        this.scene.translate(-1.4, 0, 0);
        this.UndoButton.display(this.Undo);
        this.scene.popMatrix();

        this.T.bind = this.scene.activeTexture.bind;
        this.T.bind();

        this.scene.pushMatrix();
        this.scene.translate(+1.4, 0, 0);
        this.PauseButton.display(this.Pause);
        this.scene.popMatrix();

        this.scene.popMatrix();
    }



}