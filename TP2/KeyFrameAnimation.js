class KeyFrameAnimation extends Animation {
    constructor(keyFrames, scene) {
        super();
        this.scene = scene;
        this.keyFrames = keyFrames;
        this.activeFrame = 0;
        this.timeAccumulator = 0;
        this.activeMatrix = null;
        this.lastTime = 0;
        this.frameMultiplier = (this.keyFrames[this.activeFrame].time - this.lastTime) * 1000;
    }
    update(time) {
        this.timeAccumulator += time;

        for (;;) {
            if (this.timeAccumulator > this.keyFrames[this.activeFrame].time && this.timeAccumulator <= this.keyFrames.length) {
                this.lastTime = this.keyFrames[this.activeFrame].time;
                this.timeAccumulator = 0;
                this.timeAccumulator++;
            } else {
                break;
            }
        }
        this.activeMatrix = this.keyFrames[this.activeFrame].transformations;
        updateMatrix(this.activeMatrix, this.timeAccumulator / this.frameMultiplier);
    }

    apply() {
        console.log(this.timeAccumulator / this.frameMultiplier)
        this.scene.multMatrix(this.activeMatrix);
    }
}

function updateMatrix(matrix, multiplier) {
    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = matrix[i] * multiplier;
    }
}