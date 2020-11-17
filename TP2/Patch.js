class Patch extends CGFobject {
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        super(scene);
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = controlPoints;

        this.surface = new CGFnurbsSurface(npointsU-1,npointsV-1,this.controlPoints);
        this.object = new CGFnurbsObject(this.scene,this.npartsU,this.npartsV,this.surface);
    }

    display() {
        this.object.display();
    }

}