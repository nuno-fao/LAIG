class PrologInterface{
    constructor(orchestrator){
        this.gameOrchestrator = orchestrator;
    }

    setInitialState(){
        let request = "initial";
        this.getPrologRequest(request, function(data){
            this.gameOrchestrator.gameState = data.target.response;
            //this.gameOrchestrator.gameSequence.addMove(this.gameOrchestrator.gameState,this.gameOrchestrator.board);
            console.log(this.gameOrchestrator.gameSequence.moves);
        });
    }

    getAIMove(gameState,difficulty){
        console.log("MAKING AI MOVE");
        let level = null;
        if(difficulty==playerType.easyAI){
            level='easy';
        }
        else if(difficulty==playerType.hardAI){
            level='hard';
        }
        let request = 'aimove(' + gameState + ',' +level + ')';
        this.getPrologRequest(request, function(data){

            let targetIndex = data.target.response.indexOf(",target");
            let targetString = data.target.response.substring(targetIndex+8,data.target.response.length-2).split(",");

            let restOfReply = data.target.response.substring(1,targetIndex);

            console.log(targetString,restOfReply);

            this.gameOrchestrator.movePiece(this.gameOrchestrator.turnPlayer.getUnplayedPiece(targetString[0]),this.gameOrchestrator.board.getTileFromCoordinate(parseInt(targetString[1]),parseInt(targetString[2])));

            let startChangeIndex = restOfReply.indexOf(",changes");
            let startRemovalIndex = restOfReply.indexOf(",out(");
            let startPointsIndex = restOfReply.indexOf(",points(");

            this.gameOrchestrator.gameState = restOfReply.substring(1,startChangeIndex);

            this.applyChanges(restOfReply.substring(startChangeIndex+10, startRemovalIndex-2));
            this.applyRemoval(restOfReply.substring(startRemovalIndex+6,startPointsIndex-2));
            this.updatePoints(restOfReply.substring(startPointsIndex+8,restOfReply.length-2));

            this.gameOrchestrator.gameSequence.addMove();
            this.gameOrchestrator.event=Events.MOVEDONE;
            console.log(this.gameOrchestrator.gameSequence.moves);

        });
    }

    makeMove(gameState,target){
        console.log("MAKING PLAYER MOVE");
        let request = 'move(' + gameState + ',target(' + target.toString() + '))';
        console.log("request",request);

        this.getPrologRequest(request, function(data){

            let startChangeIndex = data.target.response.indexOf(",changes");
            let startRemovalIndex = data.target.response.indexOf(",out(");
            let startPointsIndex = data.target.response.indexOf(",points(");

            this.gameOrchestrator.gameState = data.target.response.substring(1,startChangeIndex);

            console.log(data.target.response);
            //console.log('Gamestate',this.gameOrchestrator.gameState);

            this.applyChanges(data.target.response.substring(startChangeIndex+10, startRemovalIndex-2));
            this.applyRemoval(data.target.response.substring(startRemovalIndex+6,startPointsIndex-2));
            this.updatePoints(data.target.response.substring(startPointsIndex+8, data.target.response.length-2));

            this.gameOrchestrator.gameSequence.addMove();
            this.gameOrchestrator.event=Events.MOVEDONE;
            console.log(this.gameOrchestrator.gameSequence.moves);

        });
    }

    updatePoints(pointsStr){
        console.log('Points',pointsStr);

        let points = pointsStr.split(",");
        this.gameOrchestrator.updatePoints(points[0],points[1],points[2]);
    }

    applyChanges(changesStr){
        console.log('Changes',changesStr);

        if(changesStr !== ""){
            let changesArr = changesStr.split(",");
            for(let i=0;i<changesArr.length;i+=4){
                if( changesArr[i]!=changesArr[i+2] || changesArr[i+1]!=changesArr[i+3]){
                    this.gameOrchestrator.applyChangeToPiece(changesArr[i],changesArr[i+1],changesArr[i+2],changesArr[i+3]);
                }
            }
        } 
        
    }

    applyRemoval(removalStr){
        console.log('Removal',removalStr);

        if(removalStr !== ""){
            let aux = removalStr.replace(/[\[\]']+/g,'');
            aux = aux.split(",");
            for(let i=0;i<aux.length;i+=4){
                this.gameOrchestrator.applyPieceRemoval(aux[i],aux[i+1],aux[i+2],aux[i+3]);
            }
        }
    }

    getPrologRequest(requestString, onSuccess, onError, port)
    {
        //console.log("ongetprolog",requestString);
        if(onSuccess === undefined) {
            onSuccess = () => console.log("Request successful. Reply: " + data.target.response);
        }
        if(onError === undefined) {
            onError = () => console.log("Error waiting for response");
        }

        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        request.onload = onSuccess.bind(this);
        request.onerror = onError.bind(this);

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
    

}