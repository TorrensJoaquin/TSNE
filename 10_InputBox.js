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
    function Tiene_Menos_De_20_Unicos(data) {
        const unicos = new Set(data);
        return unicos.size < 20;
    }
    if(LabelsFromXLS.elt.value != ''){
        let data = LabelsFromXLS.elt.value;
        data = data.replace(/,/g, ".");
        generateTable2(LabelsFromXLS.elt.value);
        if (Check_If_The_Input_Is_Numerical(data)){
            Colors_Array = Convert_Labels_To_Colors(data);
            Colors = Colors_Array;
            ColorMode = 2;
        };
        if (Tiene_Menos_De_20_Unicos){
            data = data.split("\n");
            coloresPorValor = asignarColoresRGB(data);
            Colors = data.map(valor => coloresPorValor[valor]);
            ColorMode = 2;
        }
    };
}
function Convert_Labels_To_Colors(data){
    function obtenerMinMax(array) {
       let min = Infinity;
        let max = -Infinity;
        for (let valor of array) {
            if (valor < min) min = valor;
            if (valor > max) max = valor;
        }
        return {min, max};
    }
    data = data.split("\n");
    let NumberOfRows = data.length;
    DeleteEmptySpaces(data, NumberOfRows);
    NumberOfRows = data.length;
    Color_Rainbow = []; //First assumption
    _ = obtenerMinMax(data);
    minimum_value = float(_.min)
    maximum_value = float(_.max)
    for(let i=0; i < NumberOfRows; i++){
        Color_Rainbow[i] = getColor(data[i], minimum_value, maximum_value);
    }
    return Color_Rainbow;
}
function InputIsActivated3(){
    if(ColorsFromXLS.elt.value != ''){
        generateTable3(ColorsFromXLS.elt.value);
    };
}
function generateTable1(data) {
    data = data.split("\n");//
    let NumberOfRows = data.length;//
    DeleteEmptySpaces(data, NumberOfRows);//
    NumberOfRows = data.length;
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
    X=zeros(NumberOfRows ,NumberOfColumns);
    for(let i=0; i < NumberOfRows; i++){
        for(let j=0; j < NumberOfColumns; j++){
            X[i][j]=parseFloat(data[i][j]);
        }
    }
    InputFromXLS.elt.value = '';
}
function DeleteEmptySpaces(data, NumberOfRows){
    for(let i=0; i < NumberOfRows; i++){
        if(data[i] == ''){data.splice(i,i)}
    }
}
function Check_If_The_Input_Is_Numerical(data) {
    function esNumerico(valor) {
        return !isNaN(valor) && Number.isFinite(Number(valor));
    }
    data = data.split("\n");
    let NumberOfRows = data.length;
    DeleteEmptySpaces(data, NumberOfRows);
    NumberOfRows = data.length;
    Everything_Is_Numeric = true; //First assumption
    for(let i=0; i < NumberOfRows; i++){
        if (esNumerico(data[i]) == false){
            Everything_Is_Numeric = false;
            return Everything_Is_Numeric;
        }
    }
    return Everything_Is_Numeric;
}
function generateTable2(data) {
    data = data.split("\n");
    let NumberOfRows = data.length;
    DeleteEmptySpaces(data, NumberOfRows);
    NumberOfRows = data.length;
    for(let i=0; i < NumberOfRows; i++){
        data[i] = data[i].split('\t');
    }
    Labels=Array(NumberOfRows);
    for(let i=0; i < NumberOfRows; i++){
        Labels[i]=data[i];
    }
    LabelsFromXLS.elt.value = '';
}
function generateTable3(data) {
    data = data.split("\n");
    let NumberOfRows = data.length;
    DeleteEmptySpaces(data, NumberOfRows);
    NumberOfRows = data.length;
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
function asignarColoresRGB(data) {
    const unicos = Array.from(new Set(data));
    const diccionario = {};
    for (let i = 0; i < unicos.length; i++) {
        const valor = unicos[i];
        const color = getColor(i,0,unicos.length);
        diccionario[valor] = color;
    }
    return diccionario;
}
function getColor(value, minimum_value, maximum_value) {
    function hsvToRgb(h, s, v) {
        let c = v * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = v - c;
        let r, g, b;

        if (h < 60)      [r, g, b] = [c, x, 0];
        else if (h < 120)[r, g, b] = [x, c, 0];
        else if (h < 180)[r, g, b] = [0, c, x];
        else if (h < 240)[r, g, b] = [0, x, c];
        else if (h < 300)[r, g, b] = [x, 0, c];
        else             [r, g, b] = [c, 0, x];

        return [
            Math.round((r + m) * 255),
            Math.round((g + m) * 255),
            Math.round((b + m) * 255)
        ];
    }
    const t = (value - minimum_value) / (maximum_value - minimum_value);
    const hue = (1 - t) * 240; // de azul (240°) a rojo (0°)
    return hsvToRgb(hue, 1, 1);
}
