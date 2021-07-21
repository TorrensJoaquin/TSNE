function CreateTheInputsBoxes(){
    InputFromXLS=select('#PasteData');
    InputFromXLS.input(InputIsActivated1);
    InputFromXLS.position(115,230);

    LabelsFromXLS=select('#PasteLabels');
    LabelsFromXLS.input(InputIsActivated2);
    LabelsFromXLS.position(570,230);
}
function InputIsActivated1(){
    X = [];
    points = [];
    if(InputFromXLS.elt.value != ''){
        generateTable1(InputFromXLS.elt.value);
    };
    Labels = undefined;
    shouldIStartAllOverAgain = true;
}
function InputIsActivated2(){
    if(LabelsFromXLS.elt.value != ''){
        generateTable2(LabelsFromXLS.elt.value);
    };
}
function generateTable1(data) {
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
    InputFromXLS.elt.value = '';
    function DeleteEmptySpaces(){
        for(let i=0; i < NumberOfRows; i++){
            if(data[i] == ''){data.splice(i,i)}
        }
        NumberOfRows = data.length;    
    }
    X=zeros([NumberOfRows,NumberOfColumns]);
    for(let i=0; i < NumberOfRows; i++){
        for(let j=0; j < NumberOfColumns; j++){
            X[i][j]=parseFloat(data[i][j]);
        }
    }
}
function generateTable2(data) {
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
    LabelsFromXLS.elt.value = '';
    function DeleteEmptySpaces(){
        for(let i=0; i < NumberOfRows; i++){
            if(data[i] == ''){data.splice(i,i)}
        }
        NumberOfRows = data.length;    
    }
    Labels=zeros([NumberOfRows,NumberOfColumns]);
    for(let i=0; i < NumberOfRows; i++){
        for(let j=0; j < NumberOfColumns; j++){
            Labels[i][j]=data[i][j];
        }
    }
}
