class PrologInterface{
    constructor(orchestrator){
        this.gameOrchestrator = orchestrator;
    }

    setInitialState(){
        let request = "initial";
        this.getPrologRequest(request, function(data){
            this.gameOrchestrator.gameState = data.target.response;
        })
    }

    makeMove(gameState,target){
        let request = 'move(' + gameState + ',target(' + target.toString() + '))';
        console.log("request",request);

        this.getPrologRequest(request, function(data){

            let startChangeIndex = data.target.response.indexOf(",changes");
            let startRemovalIndex = data.target.response.indexOf(",out(");

            this.gameOrchestrator.gameState = data.target.response.substring(1,startChangeIndex);

            console.log(data.target.response);
            //console.log('Gamestate',this.gameOrchestrator.gameState);

            this.applyChanges(data.target.response.substring(startChangeIndex+10, startRemovalIndex-2));
            this.applyRemoval(data.target.response.substring(startRemovalIndex+6, data.target.response.length-3));

        })
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