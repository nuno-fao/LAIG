/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();
        this.lastTime = Date.now();
        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.camera = (new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0)));

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.textureStack = [];
        this.materialStack = [];

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.loadingProgressObject = new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress = 0;

        this.defaultAppearance = new CGFappearance(this);

        this.previous = Date.now();
        this.start = Date.now();
        this.frames = 0;
        this.seeLights = false;


        this.defaultMaterial = new CGFappearance(this);
        this.defaultMaterial.setAmbient(0.2, 0.2, 0.2, 1.0);
        this.defaultMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.defaultMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
        this.defaultMaterial.setShininess(10.0);
        this.defaultMaterial.setEmission(0, 0, 0, 1);


        //GUI
        this.selectedCamera = 0;


    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        if (this.defaultCamera == null)
            for (let key in this.graph.views) {
                this.setCamera(key)
                return;
            }
        else
            this.setCamera(this.defaultCamera)
    }

    setCamera(cameraKey) {
        this.camera = this.graph.views[cameraKey];
        this.selectedCamera = cameraKey;
        this.interface.setActiveCamera(this.graph.views[cameraKey]);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        let i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (let key in this.graph.lights) {
            if (i >= 8)
                break; // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                let graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);
                this.lights[i].idLight = graphLight[5];

                this.lights[i].setVisible(true);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();
                this.lights[i].setVisible(false);

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.initCameras();

        if (this.graph.referenceLength > 0) {
            this.axis = new MyAxis(new CGFaxis(this, this.graph.referenceLength), true);
        } else {
            this.axis = new MyAxis(new CGFaxis(this, 1), false);
        }

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();

        this.interface.initCameras();
        this.interface.initLights();
        this.setUpdatePeriod(20); //50 fps

        this.sceneInited = true;
    }

    update(time){
        for (let a in this.graph.parsedAnimations) {
            this.graph.parsedAnimations[a].update(time - this.lastTime);
        }
        this.lastTime = time;
    }

    /**
     * Displays the scene.
     */
    display() {

        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        for (let i = 0; i < this.lights.length; i++) {
            if (this.seeLights)
                this.lights[i].setVisible(true);
            else {
                this.lights[i].setVisible(false);
            }
            this.lights[i].update();
        }

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();
            this.defaultAppearance.apply();
            let key;
            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        } else {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress / 10.0, 0, 0, 1);

            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        setTimeout(() => {}, 200);
    }
}