class KeyFrameAnimation extends Animation {
    constructor(keyFrames, scene) {
        super();
        this.scene = scene;
        this.keyFrames = keyFrames;
        this.activeFrame = 0;
        this.timeAccumulator = 0;
        this.lastx = 0;
        this.lasty = 0;
        this.lastz = 0;
        this.lastt = [0, 0, 0];
        this.lasts = [1, 1, 1];
        this.activex = this.keyFrames[this.activeFrame].x;
        this.activey = this.keyFrames[this.activeFrame].y;
        this.activez = this.keyFrames[this.activeFrame].z;
        this.activet = this.keyFrames[this.activeFrame].t;
        this.actives = this.keyFrames[this.activeFrame].s;
        this.subtractList(this.actives, this.lasts);
        this.lastTime = 0;
        this.dead = false;

        this.frameMultiplier = (this.keyFrames[this.activeFrame].time - this.lastTime);
    }
    update(time) {
        if (this.dead == false) {
            this.timeAccumulator += time;
            while (1) {
                if (this.timeAccumulator > this.keyFrames[this.activeFrame].time && this.activeFrame < this.keyFrames.length - 1) {
                    this.lastTime = this.keyFrames[this.activeFrame].time;
                    this.lastt = this.keyFrames[this.activeFrame].t;
                    this.lastx = this.keyFrames[this.activeFrame].x;
                    this.lasty = this.keyFrames[this.activeFrame].y;
                    this.lastz = this.keyFrames[this.activeFrame].z;
                    this.activeFrame++;

                    this.activex = this.keyFrames[this.activeFrame].x - this.lastx;
                    this.activey = this.keyFrames[this.activeFrame].y - this.lasty;
                    this.activez = this.keyFrames[this.activeFrame].z - this.lastz;

                    this.activet = this.keyFrames[this.activeFrame].t;
                    this.subtractList(this.activet, this.lastt);

                    this.addList(this.actives, this.lasts);
                    this.lasts = this.actives;
                    this.actives = this.keyFrames[this.activeFrame].s;
                    this.subtractList(this.actives, this.lasts);
                    this.frameMultiplier = (this.keyFrames[this.activeFrame].time - this.lastTime);

                } else if ((this.activeFrame == this.keyFrames.length - 1) && this.timeAccumulator > this.keyFrames[this.activeFrame].time) {
                    this.timeAccumulator = this.keyFrames[this.activeFrame].time;
                    this.dead = true;
                    break;
                } else {
                    break;
                }
            }
            this.multiplier = (this.timeAccumulator - this.lastTime) / this.frameMultiplier;
        }
    }

    apply() {
        this.applyTrans(this.activet[0], this.activet[1], this.activet[2], this.lastt[0], this.lastt[1], this.lastt[2], this.multiplier);
        this.applyRot([1, 0, 0], this.activex, this.lastx, this.multiplier);
        this.applyRot([0, 1, 0], this.activey, this.lasty, this.multiplier);
        this.applyRot([0, 0, 1], this.activez, this.lastz, this.multiplier);
        this.applyScale(this.actives[0], this.actives[1], this.actives[2], this.lasts[0], this.lasts[1], this.lasts[2], this.multiplier);
    }
    applyRot(axis, angle, lastAngle, multiplier) {
        this.scene.rotate(lastAngle + angle * multiplier, axis[0], axis[1], axis[2]);
    }

    applyTrans(x, y, z, lx, ly, lz, multiplier) {
        this.scene.translate(lx + x * multiplier, ly + y * multiplier, lz + z * multiplier);
    }

    applyScale(x, y, z, lx, ly, lz, multiplier) {
        this.scene.scale(lx + x * multiplier, ly + y * multiplier, lz + z * multiplier);
    }

    subtractList(B, A) {
        for (let i = 0; i < B.length; i++) {
            B[i] -= A[i];
        }
    }
    addList(B, A) {
        for (let i = 0; i < B.length; i++) {
            B[i] += A[i];
        }
    }
}