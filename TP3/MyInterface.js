/**
 * MyInterface class, creating a GUI interface.
 */
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.filenames = [];
        this.items = [];
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

    destroy() {
        for (let i in this.items) {
            try {
                this.gui.removeFolder(this.items[i]);
            } catch (err) {
                this.gui.remove(this.items[i]);
            }
        }
        this.items = [];
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
        let cam = this.gui.add(this.scene, 'selectedCamera', this.scene.cameraKeys).name('Selected camera').onChange(this.scene.setCamera.bind(this.scene));
        let lights = this.gui.add(this.scene, 'seeLights').name("See Lights");
        this.items.push(cam);
        this.items.push(lights);
    }

    initLights() {
        let i = 0;
        let folder = this.gui.addFolder("Lights");
        this.items.push(folder);
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

    initGameFolder() {
        let folder = this.gui.addFolder("Game");
        this.items.push(folder);
        folder.add({ undo: this.scene.gameOrchestrator.undo.bind(this.scene.gameOrchestrator) }, 'undo').name('Undo');
        folder.add({ pause: this.scene.gameOrchestrator.pause.bind(this.scene.gameOrchestrator) }, 'pause').name('Pause');
        folder.add(this.scene.gameOrchestrator.player0, 'type', playerType).name('Player 1');
        folder.add(this.scene.gameOrchestrator.player1, 'type', playerType).name('Player 2');
        folder.add({ move: this.scene.gameOrchestrator.playMovie.bind(this.scene.gameOrchestrator) }, 'move').name('Play Movie');
        folder.add({ resetCam: this.scene.resetCamera.bind(this.scene) }, 'resetCam').name('Reset Camera');
        folder.add({ reset: this.scene.gameOrchestrator.resetGame.bind(this.scene.gameOrchestrator) }, 'reset').name('New Game');
    }

    initThemeFolder() {
        let folder = this.gui.addFolder("Themes");
        this.items.push(folder);
        folder.add(this.scene, 'activeScene', this.filenames).name('Scene').onChange((scene) => {
            this.destroy();
            this.scene.sceneInited = false;
            new MySceneGraph(scene, this.scene, false);
        });
        folder.add(this.scene, 'activeP1Piece', this.scene.graph.P1Names).name('P1 Pieces').onChange(this.scene.loadTemplates.bind(this.scene));
        folder.add(this.scene, 'activeP2Piece', this.scene.graph.P2Names).name('P2 Pieces').onChange(this.scene.loadTemplates.bind(this.scene));
        folder.add(this.scene, 'activeNormalTile', this.scene.graph.NormalNames).name('Normal Tile').onChange(this.scene.loadTemplates.bind(this.scene));
        folder.add(this.scene, 'activeVoidTile', this.scene.graph.VoidNames).name('Void Tile').onChange(this.scene.loadTemplates.bind(this.scene));
        folder.add(this.scene, 'activeHolder', this.scene.graph.HolderNames).name('Holder').onChange(this.scene.loadTemplates.bind(this.scene));
    }
    setFilenames(filenames) {
        this.filenames = filenames;
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