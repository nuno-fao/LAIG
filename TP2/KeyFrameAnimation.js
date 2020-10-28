class KeyFrameAnimation extends Animation {
    constructor(timeFrames, transformations, fps, scene) {
        super(timeFrames, transformations, fps);
        this.scene=scene;
    }

}