class Animation {
    constructor(timeFrames, transformations, fps) {
        this.timeFrames=timeFrames;
        this.transformations=transformations;
        this.timeFrameSize=this.timeFrames.length;
        this.fps=fps;
        this.translateValuesPerFrame=[0,0,0];
        this.rotateValuesPerFrame=[0,0,0];
        this.scaleValuesPerFrame=[0,0,0];
        this.translateValues=[0,0,0];
        this.rotateValues=[0,0,0];
        this.scaleValues=[0,0,0];
        this.lastTimeFrame=0;
    }

    update(time){
        if(time<=this.timeFrames[this.timeFrameSize]){
            for(let i=0; i<this.timeFrameSize;i++){
                if(time<=this.timeFrames[i] && i!=0 ){

                    //update values to use between keyFrames
                    if(this.lastTimeFrame!=i){
                        //update in which time frame we are moving
                        this.lastTimeFrame=i;

                        //calculate how many frames there are between KeyFrames
                        let distancePerFrame = (this.timeFrames[i]-this.timeFrames[i-1])*this.fps;

                        //update transformation values per frame
                        this.translateValuesPerFrame=[
                            (this.transformations[i*3][0]-this.transformations[(i-1)*3][0])/distancePerFrame,
                            (this.transformations[i*3][1]-this.transformations[(i-1)*3][1])/distancePerFrame,
                            (this.transformations[i*3][2]-this.transformations[(i-1)*3][2])/distancePerFrame
                        ];
                        this.rotateValuesPerFrame=[
                            (this.transformations[i*3+1][0]-this.transformations[(i-1)*3+1][0])/distancePerFrame,
                            (this.transformations[i*3+1][1]-this.transformations[(i-1)*3+1][1])/distancePerFrame,
                            (this.transformations[i*3+1][2]-this.transformations[(i-1)*3+1][2])/distancePerFrame
                        ];
                        this.rotateValuesPerFrame=[
                            (this.transformations[i*3+2][0]-this.transformations[(i-1)*3+2][0])/distancePerFrame,
                            (this.transformations[i*3+2][1]-this.transformations[(i-1)*3+2][1])/distancePerFrame,
                            (this.transformations[i*3+2][2]-this.transformations[(i-1)*3+2][2])/distancePerFrame
                        ];
                    }
                    
                    //calculate current frame to update values
                    let frame = time - this.timeFrames[i-1];

                    //update values
                    this.translateValues=[
                        this.translateValuesPerFrame[0]*frame,
                        this.translateValuesPerFrame[1]*frame,
                        this.translateValuesPerFrame[2]*frame 
                    ];
                    this.rotateValues=[
                        this.rotateValuesPerFrame[0]*frame,
                        this.rotateValuesPerFrame[1]*frame,
                        this.rotateValuesPerFrame[2]*frame 
                    ];
                    this.scaleValues=[
                        this.scaleValuesPerFrame[0]*frame,
                        this.scaleValuesPerFrame[1]*frame,
                        this.scaleValuesPerFrame[2]*frame 
                    ];

                    
                }
            }
        }
    }
    apply(){
        //apply transformation values to the scene matrix (not the per frame values)
    }
}