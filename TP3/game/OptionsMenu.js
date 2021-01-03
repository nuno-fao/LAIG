class Box {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.x = x / 2.0;
        this.y = y / 2.0;
        this.z = z / 2.0;
        this.backRectBF = new MyRectangle(this.scene, -x, y, x, -y, 2, 1);
        this.backRectLR = new MyRectangle(this.scene, -z, y, z, -y, 2, 1);
        this.backRectTB = new MyRectangle(this.scene, -x, z, x, -z, 2, 1);
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

class CBox {
    constructor(scene, x, y, z, objectID, callback) {
        this.callback = callback;
        this.CheckBox = CheckBox;
        this.objectID = objectID;
        this.scene = scene;
        this.x = x / 2.0;
        this.y = y / 2.0;
        this.z = z / 2.0;
        this.backRectBF = new MyRectangle(this.scene, -x, y, x, -y, 2, 1);
        this.backRectLR = new MyRectangle(this.scene, -z, y, z, -y, 2, 1);
        this.backRectTB = new MyRectangle(this.scene, -x, z, x, -z, 2, 1);

        this.clicked_b = 0;
    }



    setPicked() {
        this.callback();
    }

    clicked(clicked) {
        this.clicked_b = clicked;
    }

    pickedAnimation() {

    }

    display() {
        this.scene.registerForPick(this.objectID, this);

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

        this.scene.clearPickRegistration();
    }
}

class Button {
    constructor(scene, x, y, z, objectID, callback) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.objectID = objectID;
        this.scene = scene;
        this.box = new Box(scene, x, y, z);
        this.clicked = false;
        this.time = 0;
        this.motion = 0.2;
        this.callback = callback;

    }
    display(text) {
        this.scene.registerForPick(this.objectID, this);

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.motion);

        this.scene.pushMatrix()
        this.scene.translate(0, 0, -this.z - 0.001);
        if (this.scene.graph.buttonTexture)
            this.scene.graph.buttonTexture.bind();
        this.box.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.02, 0, 0);
        this.scene.scale(this.x * 2.0 / text.text.length, this.x * 2.0 / text.text.length, this.x * 2.0 / text.text.length);
        text.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
        this.scene.clearPickRegistration();
    }

    setPicked() {
        if (!this.clicked) {
            this.time = Date.now();
            this.clicked = true;
        }
    }

    pickedAnimation() {

    }

    update(time) {
        if (this.clicked) {
            let t = time - this.time;
            if (t < 200) {
                this.motion = 0.2 - 0.1 * (t / 200);
            } else if (t > 200 && t <= 400) {
                this.motion = 0.1 + 0.1 * ((t - 200) / 200);
            } else {
                this.clicked = false;
                this.motion = 0.2;
                this.callback();
            }
        }
    }
}

class CheckBox {
    constructor(scene, Text1, Text2, Text3, objectID, check) {
        this.scene = scene;
        this.selected = 0;
        this.t1 = new MySpriteText(scene, Text1);
        this.t2 = new MySpriteText(scene, Text2);
        this.t3 = new MySpriteText(scene, Text3);
        this.check = check;

        this.b1 = new CBox(scene, 0.5, 0.2, 0.1, objectID++, () => {
            this.selected = 0;
            this.b1.clicked(true);
            this.b2.clicked(false);
            this.b3.clicked(false);
            if (check == 0) {
                this.scene.gameOrchestrator.player0.type = this.selected;
            } else if (check == 1) {
                this.scene.gameOrchestrator.player1.type = this.selected;
            }

        });
        this.b2 = new CBox(scene, 0.5, 0.2, 0.1, objectID++, () => {
            this.selected = "1";
            this.b1.clicked(false);
            this.b2.clicked(true);
            this.b3.clicked(false);
            if (check == 0) {
                this.scene.gameOrchestrator.player0.type = this.selected;
            } else if (check == 1) {
                this.scene.gameOrchestrator.player1.type = this.selected;
            }
        });
        this.b3 = new CBox(scene, 0.5, 0.2, 0.1, objectID, () => {
            this.selected = "2";
            this.b1.clicked(false);
            this.b2.clicked(false);
            this.b3.clicked(true);
            if (check == 0) {
                this.scene.gameOrchestrator.player0.type = this.selected;
            } else if (check == 1) {
                this.scene.gameOrchestrator.player1.type = this.selected;
            }
        });

        this.b1.clicked(true);
    }

    get_selected() {
        return this.selected;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.2);

        let b1In = 0;
        let b2In = 0;
        let b3In = 0;

        if (this.selected == 0) {
            b1In = -0.15;
        }
        if (this.selected == 1) {
            b2In = -0.15;
        }
        if (this.selected == 2) {
            b3In = -0.15;
        }

        this.scene.pushMatrix();
        this.scene.translate(-1.5, 0, b1In);
        this.b1.display();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.101);
        this.scene.scale(1 / this.t1.text.length, 1 / this.t1.text.length, 1.0 / this.t1.text.length);
        this.t1.display();
        this.scene.popMatrix();

        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(0, 0, b2In);
        this.b2.display();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.101);
        this.scene.scale(1 / this.t2.text.length, 1 / this.t2.text.length, 1.0 / this.t2.text.length);
        this.t2.display();
        this.scene.popMatrix();

        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(1.5, 0, b3In);
        this.b3.display();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.101);
        this.scene.scale(1 / this.t3.text.length, 1 / this.t3.text.length, 1.0 / this.t3.text.length);
        this.t3.display();
        this.scene.popMatrix();

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
        this.NewGame = new MySpriteText(this.scene, "New Game");
        this.Play = new MySpriteText(this.scene, "Play");
        this.Player1 = new MySpriteText(this.scene, "Player 1");
        this.Player2 = new MySpriteText(this.scene, "Player 2");
        this.PlayMovie = new MySpriteText(this.scene, "Play Movie");

        this.BackBox = new Box(scene, 2.1, 2.5, 0.1);
        this.NewButton = new Button(scene, 0.5, 0.2, 0.1, 203, () => { this.scene.gameOrchestrator.resetGame() });
        this.UndoButton = new Button(scene, 0.5, 0.2, 0.1, 200, () => { this.scene.gameOrchestrator.undo() });

        this.PauseButton = new Button(scene, 0.6, 0.2, 0.1, 201, () => {
            this.scene.gameOrchestrator.pause();
            this.paused = !this.paused;
        });

        this.PlayMovieButton = new Button(scene, 1, 0.2, 0.1, 202, () => { this.scene.gameOrchestrator.playMovie() });

        this.p1 = new CheckBox(scene, "Human", "Easy", "Hard", 300, 0);
        this.p2 = new CheckBox(scene, "Human", "Easy", "Hard", 400, 1);
    }


    update(time) {
        this.UndoButton.update(time);
        this.PauseButton.update(time);
        this.PlayMovieButton.update(time);
        this.NewButton.update(time);
    }


    display() {
        this.scene.pushMatrix();
        this.BackBox.display();

        this.scene.translate(0, 0.5, 0);

        this.scene.pushMatrix();
        this.scene.translate(-1.4, 1.5, 0);
        this.UndoButton.display(this.Undo);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.05, 1.5, 0);
        this.NewButton.display(this.NewGame);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(+1.3, 1.5, 0);
        if (!this.paused)
            this.PauseButton.display(this.Pause);
        else
            this.PauseButton.display(this.Play);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.PlayMovieButton.display(this.PlayMovie);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(0.2, 0.2, 0.2);
        this.Player1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.15);
        this.scene.scale(0.3, 0.3, 0.3);
        this.Player1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.p1.display(this.PlayMovie);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0.15);
        this.scene.scale(0.3, 0.3, 0.3);
        this.Player2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1.5, 0);
        this.p2.display(this.PlayMovie);
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}