class Defbarrel extends CGFobject{
    constructor(scene, r, R, L, slices, stacks) {
        super(scene);
        this.r=r;
        this.R=R;
        this.L=L;
        this.slices=slices;
        this.stacks=stacks;
        this.initBuffers();
    }
    initBuffers(){
        var H = 4/3*(this.R-this.r);
        var h = 4/3*this.r;
        var alpha = 20 * 0.0174532925;
        this.controlPoints=[
            //P4
            [
                [this.r, 0, 0, 1],    //Q1
                [this.r + H, 0, H / Math.tan(alpha), 1],    //Q2
                [this.r + H, 0, this.L - H / Math.tan(alpha), 1],    //Q3
                [this.r, 0, this.L, 1]     //Q4
            ],
            //P3
            [
                [this.r,h,0,1],     //Q1
                [this.r + H, h + H, H / Math.tan(alpha), 1],     //Q2
                [this.r + H, h + H, this.L - H / Math.tan(alpha), 1],      //Q3
                [this.r, h, this.L, 1]      //Q4
            ],
            //P2
            [
                [-this.r, h, 0, 1],  //Q1
                [-this.r - H, h + H, this.H / Math.tan(alpha), 1],   //Q2
                [-this.r - H, h + H, this.L - H / Math.tan(alpha), 1],   //Q3
                [-this.r, h, this.L, 1]    //Q4
            ],
            //P1
            [
                [-this.r, 0, 0, 1],  //Q1
                [-this.r - H, 0, H / Math.tan(alpha), 1],    //Q2
                [-this.r - H, 0, this.L - H / Math.tan(alpha), 1],     //Q2
                [-this.r, 0, this.L, 1]   //Q4
            ]

        ];
        this.surface = new CGFnurbsSurface(3,3,this.controlPoints);
        this.object = new CGFnurbsObject(this.scene,this.slices,this.stacks,this.surface);

        //this.object = new Patch(this.scene,4,4,20,20,this.controlPoints);

        //console.log(this);
    }
    display(){
        this.object.display();
    }
}