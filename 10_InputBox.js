function CreateTheInputsBoxes(){
    InputFromXLS=select('#PasteData');
    InputFromXLS.input(InputIsActivated1);
    InputFromXLS.position(120,300);

    LabelsFromXLS=select('#PasteLabels');
    LabelsFromXLS.input(InputIsActivated2);
    LabelsFromXLS.position(385,300);

    ColorsFromXLS=select('#PasteColors');
    ColorsFromXLS.input(InputIsActivated3);
    ColorsFromXLS.position(670,300);
}
function InputIsActivated1(){
    X=[];
    if(InputFromXLS.elt.value != ''){
        generateTable1(InputFromXLS.elt.value);
    };
    Labels = undefined;
    DesiredPerplexity = UpdateComponent(inpPerplexity);
    TradeOff = UpdateComponent(inpTradeOff);
    LearningRatio = UpdateComponent(inpLearningRatio);
    shouldIStartAllOverAgain = true;
    shouldIStartReInitializeY = true;
    Momentum = UpdateComponent(inpMomentum);
    EarlyExaggeration.DidIFinish = false;
    EarlyExaggeration.Counter = 0;
    ColorMode = 0;
}
function InputIsActivated2(){
    if(LabelsFromXLS.elt.value != ''){
        generateTable2(LabelsFromXLS.elt.value);
    };
}
function InputIsActivated2(){
    if(LabelsFromXLS.elt.value != ''){
        generateTable2(LabelsFromXLS.elt.value);
    };
}
function InputIsActivated3(){
    if(ColorsFromXLS.elt.value != ''){
        generateTable3(ColorsFromXLS.elt.value);
    };
}
function generateTable1(data) {
    data = data.split("\n");//
    let NumberOfRows = data.length;//
    DeleteEmptySpaces();//
    for(let i=0; i < NumberOfRows; i++){//
        data[i] = data[i].split('\t');//
    }//
    let NumberOfColumns = data[0].length;//
    for(let i=0; i < NumberOfRows; i++){
        for(let j=0; j < NumberOfColumns; j++){
            if(NumberOfColumns != data[i].length){console.log('Error reading the row/column '+ j + 1)}
            data[i][j] = data[i][j].replace(' ', ''); //Delete blank spaces if presents.
        }
    }
    function DeleteEmptySpaces(){
        for(let i=0; i < NumberOfRows; i++){
            if(data[i] == ''){data.splice(i,i)}
        }
        NumberOfRows = data.length;    
    }
    X=zeros(NumberOfRows ,NumberOfColumns);
    for(let i=0; i < NumberOfRows; i++){
        for(let j=0; j < NumberOfColumns; j++){
            X[i][j]=parseFloat(data[i][j]);
        }
    }
    InputFromXLS.elt.value = '';
}
function generateTable2(data) {
    data = data.split("\n");
    let NumberOfRows = data.length;
    DeleteEmptySpaces();
    for(let i=0; i < NumberOfRows; i++){
        data[i] = data[i].split('\t');
    }
    Labels=Array(NumberOfRows);
    for(let i=0; i < NumberOfRows; i++){
        Labels[i]=data[i];
    }
    function DeleteEmptySpaces(){
        for(let i=0; i < NumberOfRows; i++){
            if(data[i] == ''){data.splice(i,i)}
        }
        NumberOfRows = data.length;    
    }
    LabelsFromXLS.elt.value = '';
}
function generateTable3(data) {
    data = data.split("\n");
    let NumberOfRows = data.length;
    DeleteEmptySpaces();
    for(let i=0; i < NumberOfRows; i++){
        data[i] = data[i].split('\t');
    }
    let NumberOfColumns = data[0].length;
    for(let i=0; i < NumberOfRows; i++){
        for(let j=0; j < NumberOfColumns; j++){
            if(NumberOfColumns != data[i].length){console.log('Error reading the row/column '+ j + 1)}
            data[i][j] = data[i][j].replace(' ', ''); //Delete blank spaces if presents.
        }
    }
    function DeleteEmptySpaces(){
        for(let i=0; i < NumberOfRows; i++){
            if(data[i] == ''){data.splice(i,i)}
        }
        NumberOfRows = data.length;    
    }
    Colors=zeros( NumberOfRows, NumberOfColumns);
    for(let i=0; i < NumberOfRows; i++){
        for(let j=0; j < NumberOfColumns; j++){
            Colors[i][j]=parseFloat(data[i][j]);
        }
    }
    if (NumberOfColumns > 2){ColorMode = 2}
    else if(NumberOfColumns > 0){ColorMode = 1}
    ColorsFromXLS.elt.value = '';
}
