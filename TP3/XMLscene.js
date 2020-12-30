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
        //this.rotateTime = 0;
        //this.target = 1;
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
        this.setUpdatePeriod(20);

        this.loadingProgressObject = new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress = 0;

        this.defaultAppearance = new CGFappearance(this);

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

        // enable picking
        this.setPickEnabled(true);

        this.rotatingCam = false;
        this.camAngle = 0;

        this.gameOrchestrator = new GameOrchestrator(this);
        this.initTime = Date.now();

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
        let auxCam = this.graph.views[cameraKey];
        this.camera = new CGFcamera(auxCam.fov, auxCam.near, auxCam.far, auxCam.position, auxCam.target);
        this.selectedCamera = cameraKey;
        this.interface.setActiveCamera(this.camera);
    }

    setCameraMidGame(cameraKey, Player) {
        let auxCam = this.graph.views[cameraKey];
        let auxPosition = [...auxCam.position];

        if (Player == "2") {
            auxPosition[2] = -auxPosition[2];
        }
        this.camera = new CGFcamera(auxCam.fov, auxCam.near, auxCam.far, auxPosition, auxCam.target);
        this.selectedCamera = cameraKey;
        this.interface.setActiveCamera(this.camera);
    }

    resetCamera() {
        this.setCameraMidGame(this.selectedCamera, this.gameOrchestrator.getTurnPlayer());
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

        this.gameOrchestrator.onGraphLoaded();
        this.interface.initGameFolder();
        

        this.sceneInited = true;

        this.allNodes={};
        for(let i in this.graph.sceneIndexes){
            this.allNodes[i] = i;
        }

        this.activeScene = 0;

        this.interface.initThemeFolder();

    }

    changeScene(){
        this.sceneInited=false;
        this.graph.nodes=[];
        this.graph.rootNode = null;
        this.graph.spriteAnimations = [];
        let error;
        if ((error = this.graph.parseNodes( this.graph.allChildren[this.graph.sceneIndexes[this.activeScene]])) != null)
            return error;
        this.sceneInited=true;
    }

    update(time) {
        //this.rotateTime = time;
        this.gameOrchestrator.update(time);

        //camera rotation

        if (this.rotatingCam) {
            let rotAngle = Math.PI * (time - this.lastTime) / 1500;
            if (this.camAngle + rotAngle > Math.PI) {
                rotAngle = Math.PI - this.camAngle;
            }
            this.camAngle += rotAngle;
            if (this.camAngle == Math.PI) {
                rotAngle -= this.camAngle - Math.PI;
                this.camAngle = 0;
                this.rotatingCam = false;
                this.gameOrchestrator.event = Events.MOVE_DONE;
            }
            this.camera.orbit(vec3.fromValues(0, 1, 0), rotAngle);
        }

        for (let a in this.graph.parsedAnimations) {
            this.graph.parsedAnimations[a].update(time - this.lastTime);
        }

        for (let i in this.graph.spriteAnimations) {
            this.graph.spriteAnimations[i].update(time / 1000);
        }

        this.lastTime = time;


    }


    /**
     * Displays the scene.
     */
    display() {

        this.gameOrchestrator.managePick(this.pickMode, this.pickResults);
        this.clearPickRegistration();
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
            this.graph.displayScene(this.activeScene);
            // Displays all the game related objects
            //this.rotateCamera(this.target);
            this.gameOrchestrator.display();
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

    rotateCamera(targetPosition) {
        let targetTime = 2000;
        if (targetPosition == 1) {
            this.rotate(3.1415 * (this.rotateTime - this.initTime) / targetTime, 0, 1, 0);
        } else if (targetPosition == 0) {
            this.rotate(3.1415 - 3.1415 * (this.rotateTime - this.initTime) / targetTime, 0, 1, 0);
        }
        if (this.rotateTime - this.initTime >= targetTime) {
            this.initTime = this.rotateTime;
            //this.target = (this.target == 0) ? 1 : 0; // comentar para retirar o movimento automatico
        }
    }
}