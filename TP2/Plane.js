class Plane extends CGFobject{
    constructor(scene, nPartsU, nPartsV) {
        super(scene);
        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;
        this.controlPoints = [
            // U = 0
            [   // V = 0, 1
                [0.5, 0.0, -0.5, 1.0],
                [0.5, 0.0, 0.5, 1.0]
            ],
            // U = 1
            [   // V = 0, 1
                [-0.5, 0.0, -0.5, 1.0],
                [-0.5, 0.0, 0.5, 1.0]
            ]
        ];

        this.surface = new CGFnurbsSurface(1,1,this.controlPoints);
        this.object = new CGFnurbsObject(this.scene,this.nPartsU,this.nPartsV,this.surface);
    }
    display(){
        this.object.display();
    }
}