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
            let parsedResponse = JSON.parse(data.target.response);
            this.gameOrchestrator.gameState =parsedResponse['gamestate'];
            console.log(parsedResponse);
            console.log(this.gameOrchestrator.gameState);
        })
    }

    getStateFromMove(){
        
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