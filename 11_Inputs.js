let inpPerplexity;
let inpTradeOff;
function CreateTheInputs(){
    let SizeOfInput=[60,20];
    inpPerplexity=createInput((3).toString());
    inpPerplexity.size(SizeOfInput[0],SizeOfInput[1]);
    inpPerplexity.position(370,39);
    inpPerplexity.input(myInputPerplexity);

    inpLearningRatio=createInput((3).toString());
    inpLearningRatio.size(SizeOfInput[0],SizeOfInput[1]);
    inpLearningRatio.position(626,25);
    inpLearningRatio.input(myInputLearningRatio);

    inpMomentum=createInput((0.3).toString());
    inpMomentum.size(SizeOfInput[0],SizeOfInput[1]);
    inpMomentum.position(626,52);
    inpMomentum.input(myInputMomentum);

    inpTradeOff=createInput((0.5).toString());
    inpTradeOff.size(SizeOfInput[0],SizeOfInput[1]);
    inpTradeOff.position(810,39);
    inpTradeOff.input(myInputTradeOff);

    inpEarlyExaggerationIterations=createInput((250).toString());
    inpEarlyExaggerationIterations.size(SizeOfInput[0],SizeOfInput[1]);
    inpEarlyExaggerationIterations.position(1007,25);
    inpEarlyExaggerationIterations.input(myInputEarlyExaggerationIterations);

    inpEarlyExaggerationFactor=createInput((4).toString());
    inpEarlyExaggerationFactor.size(SizeOfInput[0],SizeOfInput[1]);
    inpEarlyExaggerationFactor.position(1007,52);
    inpEarlyExaggerationFactor.input(myInputEarlyExaggerationFactor);

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
    function myInputEarlyExaggerationIterations(){
        EarlyExaggeration.Iterations = UpdateComponent(inpEarlyExaggerationIterations);
    }
    function myInputEarlyExaggerationFactor(){
        EarlyExaggeration.Factor = UpdateComponent(inpEarlyExaggerationFactor);
    }
}
function UpdateComponent(ComponentOfDOM){
    if(ComponentOfDOM.elt.value==''){
        return 0;
    }
    return parseFloat(ComponentOfDOM.elt.value);
}
