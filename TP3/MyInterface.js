/**
 * MyInterface class, creating a GUI interface.
 */
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)


        this.initKeys();

        

        return true;
    }

    /**
     * initKeys
     */

    initCameras() {
        this.scene.cameraKeys = []
        let i = 0
        for (let key in this.scene.graph.views) {
            this.scene.cameraKeys.push(key)
        }
        this.gui.add(this.scene, 'selectedCamera', this.scene.cameraKeys).name('Selected camera').onChange(this.scene.setCamera.bind(this.scene));
        this.gui.add(this.scene, 'seeLights').name("See Lights");
    }

    initLights() {
        let i = 0;
        let folder = this.gui.addFolder("Lights");
        for (let key in this.scene.graph.lights) {
            folder.add(this.scene.lights[i], 'enabled').name(this.scene.lights[i].idLight)
            i++;
        }
    }

    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function() {};
        this.activeKeys = {};
    }

    initGameFolder(){
        // var undoFunc = {
        //     undo: function(){
        //             this.scene.gameOrchestrator.undo();
        //         }
        // };
        
        let folder = this.gui.addFolder("Game");
        folder.add({undo : this.scene.gameOrchestrator.undo.bind(this.scene.gameOrchestrator)},'undo').name('Undo');
        folder.add({pause : this.scene.gameOrchestrator.pause.bind(this.scene.gameOrchestrator)},'pause').name('Pause');
        folder.add(this.scene.gameOrchestrator.player0, 'type', playerType).name('Player 1');
        folder.add(this.scene.gameOrchestrator.player1, 'type', playerType).name('Player 2');
        folder.add({resetCam : this.scene.resetCamera.bind(this.scene)},'resetCam').name('Reset Camera');
        folder.add({reset : this.scene.gameOrchestrator.resetGame.bind(this.scene.gameOrchestrator)},'reset').name('Restart Game');
        folder.open();
    }
    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}