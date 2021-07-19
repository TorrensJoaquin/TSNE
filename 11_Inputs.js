let inpPerplexity;
let inpTradeOff;
function CreateTheInputs(){
    let SizeOfInput=[60,20];
    inpPerplexity=createInput((3).toString());
    inpPerplexity.size(SizeOfInput[0],SizeOfInput[1]);
    inpPerplexity.position(375,20);
    inpPerplexity.input(myInputPerplexity);

    inpTradeOff=createInput((0.5).toString());
    inpTradeOff.size(SizeOfInput[0],SizeOfInput[1]);
    inpTradeOff.position(375,50);
    inpTradeOff.input(myInputTradeOff);

    inpLearningRatio=createInput((3).toString());
    inpLearningRatio.size(SizeOfInput[0],SizeOfInput[1]);
    inpLearningRatio.position(705,20);
    inpLearningRatio.input(myInputLearningRatio);

    inpMomentum=createInput((0.3).toString());
    inpMomentum.size(SizeOfInput[0],SizeOfInput[1]);
    inpMomentum.position(705,50);
    inpMomentum.input(myInputMomentum);
    function myInputPerplexity(){
        DesiredPerplexity = UpdateComponent(inpPerplexity);
        TradeOff = UpdateComponent(inpTradeOff);
        LearningRatio = UpdateComponent(inpLearningRatio);
        shouldIStartAllOverAgain = true;
        Momentum = UpdateComponent(inpMomentum);
    }
    function myInputTradeOff(){
        TradeOff = UpdateComponent(inpTradeOff) * 1.73;
    }
    function myInputLearningRatio(){
        LearningRatio = UpdateComponent(inpLearningRatio) * 4;
    }
    function myInputMomentum(){
        Momentum = UpdateComponent(inpMomentum);
    }
    function UpdateComponent(ComponentOfDOM){
        if(ComponentOfDOM.elt.value==''){
            return 0;
        }
        return parseFloat(ComponentOfDOM.elt.value);
    }
}
