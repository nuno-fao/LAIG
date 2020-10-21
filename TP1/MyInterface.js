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