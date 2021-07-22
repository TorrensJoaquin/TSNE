let DesiredPerplexity = 3;
let numberOfIterations = 1;
let LearningRatio = 3;
let Momentum = 0.3;
let TradeOff = 0.5;
let p = [];
let y = [];
let oldy = [];
let numberOfSamplesInX;
let angle = 0;
let BiggestY = 2;
let shouldIStartAllOverAgain = true;
let shouldIStartReInitializeY = true;
let ColorMode = 2;
let EarlyExageration ={
    DidIFinish : false,
    Counter : 0,
    Iterations : 250,
    Factor : 4,
}
let rotationZ = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 1],
];
let rotationX = [
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];
let rotationY = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
];
const projection = [
    [1, 0, 0],
    [0, 1, 0],
];
function setup() {
    LoadX();
    CreateTheInputsBoxes();
    CreateTheInputs();
    let SizeOfCanvas = [700, 700];
    let PositonOfCanvas = [100, 425];
    createCanvas(SizeOfCanvas[0], SizeOfCanvas[1]).position(PositonOfCanvas[0], PositonOfCanvas[1]);
}
function draw(){
    background(0);
    if (shouldIStartAllOverAgain == true){
        LearningRatio = LearningRatio * 4; //By definition of dydt ... It doesn't make sense having it inside the loop.
        TradeOff = TradeOff * 1.73; //sqrt of 3. Relationship between de side lenght and the diagonal of the octtree ... It doesn't make sense having it inside the loop.
        numberOfSamplesInX = X.length;
        let numberOfDimentions = X[1].length;
        let top1 = Array(numberOfSamplesInX).fill(0);
        let top2 = Array(numberOfSamplesInX).fill(0);
        let middle1 = Array(numberOfSamplesInX).fill(0);
        let middle2 = Array(numberOfSamplesInX).fill(0);
        let bottom1 = Array(numberOfSamplesInX).fill(0);
        let bottom2 = Array(numberOfSamplesInX).fill(0);
        p = []; //pj|i
        let aux;
        //
        let IndexElements=[];
        for(let i = 0; i < X.length; i++){
            IndexElements[i] = i;
        }
        let VantagePoint = new VantagePointElement();
        VantagePoint.SelectASeedAndFindMu(X, IndexElements);
        VantagePoint.SearchKNeighbors(X, numberOfSamplesInX, DesiredPerplexity);
        //
        for(let i = 0; i < numberOfSamplesInX; i++){
            top1[i] = -0.0001;
            bottom1[i] = -0.0001;
        }
        let IShouldStay;
        aux = getMeThePairWiseAffinities1(X, numberOfSamplesInX, numberOfDimentions);
        for(let iter = 0; iter <= 100; iter++){
            IShouldStay = true;
            p = getMeThePairWiseAffinities2(aux, numberOfSamplesInX, top1);
            top2 = GetMeThePerplexity(p, numberOfSamplesInX);
            for(let i = 0; i <= numberOfSamplesInX - 1; i++){
                if(top2[i] < DesiredPerplexity){
                    IShouldStay = false;
                    bottom1[i] = top1[i];
                    top1[i] = (top1[i] - 1) * 2;
                }
            }
            if(IShouldStay){iter = 101};
        }
        for(let i = 0; i <= numberOfSamplesInX - 1; i++){
            middle1[i] = (top1[i] + bottom1[i]) / 2;
        }
        p = getMeThePairWiseAffinities2(aux, numberOfSamplesInX, middle1);
        middle2 = GetMeThePerplexity(p, numberOfSamplesInX);
        for(let iter = 0; iter <= 100; iter++){
        //Decision Maker (you can do better than this, see it later)
            for(let i = 0; i <= numberOfSamplesInX - 1; i++){
                if(Math.abs(middle2[i] - DesiredPerplexity) < 0.01){
                }else if(middle2[i] > DesiredPerplexity){
                    top1[i] = middle1[i];
                    top2[i] = middle2[i];
                    middle1[i] = (top1[i] + bottom1[i]) / 2;
                }else{
                    bottom1[i] = middle1[i];
                    bottom2[i] = middle2[i];
                    middle1[i] = (top1[i] + bottom1[i]) / 2;
                }
            }
            p = getMeThePairWiseAffinities2(aux, numberOfSamplesInX, middle1);
            middle2 = GetMeThePerplexity(p, numberOfSamplesInX);
        }
        //Set pij= ( pj|i + pi|j ) / 2 * n
        for(let i = 0; i <= numberOfSamplesInX - 2; i++){
            for(let z = 0; z <= VantagePointQueryArray[i].length - 1; z++){
                j = VantagePointQueryArray[i][z] - i - 1;
                if(j <= numberOfSamplesInX - i - 2 && j > 0){
                    p[i][z] = p[i][z] / numberOfSamplesInX;
                }
            }
        }
        //Sample Initial Solution Y
        if(shouldIStartReInitializeY){
            y=zeros2(numberOfSamplesInX);
            oldy=zeros2(numberOfSamplesInX);
            for(let i = 0; i <= numberOfSamplesInX - 2; i++){
                for(let n = 0; n <= 2; n++){
                    y[i][n] = Math.random()-0.5;
                }
            }
        }
        shouldIStartReInitializeY = false;
        shouldIStartAllOverAgain = false;
    }
    YUpload(p, y, oldy, numberOfSamplesInX, numberOfIterations, Momentum, LearningRatio, VantagePointQueryArray, TradeOff);
    rotationZ[0][0]=cos(angle);
    rotationZ[1][0]=sin(angle);
    rotationZ[0][1]=-rotationZ[1][0];
    rotationZ[1][1]=rotationZ[0][0];
    rotationX[1][1]=rotationZ[0][0];
    rotationX[1][2]=rotationZ[0][1];
    rotationX[2][1]=rotationZ[1][0];
    rotationX[2][2]=rotationZ[0][0];
    rotationY[0][0] = rotationZ[0][0];
    rotationY[0][2] = rotationZ[1][0];
    rotationY[2][0] = rotationZ[0][1];
    rotationY[2][2] = rotationZ[0][0];
    strokeWeight(5);
    noFill();
    let projected = [];
    let compensation = 300 / BiggestY;
    if (ColorMode == 0){
        stroke(255);
        for (let i = 0; i < y.length; i++) {
            let rotated = matmul(rotationY, y[i]);
            rotated = matmul(rotationX, rotated);
            rotated = matmul(rotationZ, rotated);
            let projected2d = matmul(projection, rotated);
            projected[i] = [];
            projected[i][0] = projected2d[0] * compensation + 350;
            projected[i][1] = projected2d[1] * compensation + 350;
            point((projected[i][0]), (projected[i][1]));
        }
    }else if(ColorMode == 1){
        for (let i = 0; i < y.length; i++) {
            let rotated = matmul(rotationY, y[i]);
            rotated = matmul(rotationX, rotated);
            rotated = matmul(rotationZ, rotated);
            let projected2d = matmul(projection, rotated);
            projected[i] = [];
            projected[i][0] = projected2d[0] * compensation + 350;
            projected[i][1] = projected2d[1] * compensation + 350;
            stroke(Colors[i]);
            point((projected[i][0]), (projected[i][1]));
        }
    }else{
        for (let i = 0; i < y.length; i++) {
            let rotated = matmul(rotationY, y[i]);
            rotated = matmul(rotationX, rotated);
            rotated = matmul(rotationZ, rotated);
            let projected2d = matmul(projection, rotated);
            projected[i] = [];
            projected[i][0] = projected2d[0] * compensation + 350;
            projected[i][1] = projected2d[1] * compensation + 350;
            stroke(Colors[i][0],Colors[i][1],Colors[i][2]);
            point((projected[i][0]), (projected[i][1]));
        }
    }
    if (mouseX > 0 && mouseX < 700 && mouseY > 0 && mouseY < 700){
        let iPressed = null;
        for (let i = 0; i < projected.length; i++) {
            if(Math.abs(projected[i][0] - mouseX) < 5 && Math.abs(projected[i][1] - mouseY) < 5){
                iPressed = i;
                i = projected.length;
            }
        }
        if (iPressed != null){
            push();
            stroke(255,0,90);
            strokeWeight(10);
            point(projected[iPressed][0], projected[iPressed][1]);
            push();
            textSize(30);
            strokeWeight(1);
            stroke(255);
            if (typeof Labels != 'undefined'){
                text(Labels[iPressed], 50, 50, 50, 50);
            }else{text(iPressed,50, 50, 50, 50)}
            pop();
        }
        angle += 0.0005;
    }else{angle += 0.005;}
}
function getMeThePairWiseAffinities1(X, numberOfSamplesInX, numberOfDimentions){
    //This is the part of the code that is independant of minusTwoSigmaSquared.
    //I can play this part of the code only once during the sigma search.
    let p = Array(numberOfSamplesInX).fill(0); //pj|i
    for(let i = 0; i <= numberOfSamplesInX - 2; i++){
        p[i] = Array(VantagePointQueryArray[i].length).fill(0);
        for(let z = 0; z <= VantagePointQueryArray[i].length - 1; z++){
            j = VantagePointQueryArray[i][z] - i - 1;
            if(j <= numberOfSamplesInX - i - 2 && j > 0){
                for(let n = 0; n <= numberOfDimentions - 1; n++){
                    p[i][z] = p[i][z] + Math.pow(X[i][n] - X[j + i + 1][n], 2);
                }
            }
        }
    }
    return p;
}
function getMeThePairWiseAffinities2(auxiliar, numberOfSamplesInX, minusTwoSigmaSquared){
    // get the sum of pair wise affinities and the non normilized pair wise affinities
    let sumOfPairWiseAffinities = Array(numberOfSamplesInX).fill(0);
    let p = Array(numberOfSamplesInX).fill(0); //pj|i
    for(let i = 0; i <= numberOfSamplesInX - 2; i++){
        p[i] = Array(VantagePointQueryArray[i].length).fill(0);
        for(let z = 0; z <= VantagePointQueryArray[i].length - 1; z++){
            j = VantagePointQueryArray[i][z] - i - 1;
            if(j <= numberOfSamplesInX - i - 2 && j > 0){
                p[i][z] = Math.exp(auxiliar[i][z] / (minusTwoSigmaSquared[i] + 0.000001));
                sumOfPairWiseAffinities[i] = sumOfPairWiseAffinities[i] + p[i][z];
                sumOfPairWiseAffinities[j + i + 1] = sumOfPairWiseAffinities[j + i + 1] + p[i][z];
            }
        }
    }
    // get the normilized pair wise affinities
    for(let i = 0; i <= numberOfSamplesInX - 2; i++){
        for(let z = 0; z <= VantagePointQueryArray[i].length - 1; z++){
            j = VantagePointQueryArray[i][z] - i - 1;
            if(j <= numberOfSamplesInX - i - 2 && j > 0){
                p[i][z] = p[i][z] / (sumOfPairWiseAffinities[j + i + 1] + 0.000001);
            }
        }
    }
    return p;
}
function GetMeThePerplexity(p, numberOfSamplesInX){
    let Perplexities=Array(numberOfSamplesInX).fill(0);
    for(i = 0; i <= numberOfSamplesInX - 2; i++){
        for(let z = 0; z <= VantagePointQueryArray[i].length - 1; z++){
            j = VantagePointQueryArray[i][z] - i - 1;
            if(j <= numberOfSamplesInX - i - 2 && j > 0){
                let aux = p[i][z] * Math.log2(p[i][z] + 0.001);
                Perplexities[i] = Perplexities[i] + aux;
                Perplexities[j + i + 1] = Perplexities[j + i + 1] + aux;
            }
        }
    }
    for(i = 0; i <= numberOfSamplesInX - 1; i++){
        Perplexities[i] = Math.pow( 2, -Perplexities[i]);
    }
    return Perplexities;
}
function YUpload(p, y, oldy, numberOfSamplesInX, numberOfIterations, Momentum, LearningRatio, VantagePointQueryArray, TradeOff){
    let aux;
    let aux1;
    let j;
    let IndexElements=[];
    let ResultOT = new OctTreeResults();
    for(let i = 0; i < y.length; i++){
        IndexElements[i] = i;
    }
    for(let iter = 0; iter <= numberOfIterations; iter++){
        let Fattr = zeros2(numberOfSamplesInX);
        let Frep = zeros2(numberOfSamplesInX);
        let Sumq = 0;
        OctTree = new OctTreeElement([0,0,0], BiggestY);
        OctTree.InsertInBoxes(y, IndexElements);
        BiggestY = 0;
        if (EarlyExageration.DidIFinish){
            for(let i = 0; i <= numberOfSamplesInX - 2; i++){
                for(let z = 0; z <= VantagePointQueryArray[i].length - 1; z++){
                    j = VantagePointQueryArray[i][z] - i - 1;
                    if(j <= numberOfSamplesInX - i - 2 && j > 0){
                        aux1=p[i][z] * CalculateZQij( i, j + i + 1);
                        aux = aux1 * (y[i][0] - y[j+ i + 1][0]);
                        Fattr[i][0] = Fattr[i][0] + aux;
                        Fattr[j + i + 1][0] = Fattr[j + i + 1][0] - aux;
                        aux = aux1 * (y[i][1] - y[j+ i + 1][1]);
                        Fattr[i][1] = Fattr[i][1] + aux;
                        Fattr[j + i + 1][1] = Fattr[j + i + 1][1] - aux;
                        aux = aux1 * (y[i][2] - y[j+ i + 1][2]);
                        Fattr[i][2] = Fattr[i][2] + aux;
                        Fattr[j + i + 1][2] = Fattr[j + i + 1][2] - aux;
                    }
                }
            }
        }else{
            for(let i = 0; i <= numberOfSamplesInX - 2; i++){
                for(let z = 0; z <= VantagePointQueryArray[i].length - 1; z++){
                    j = VantagePointQueryArray[i][z] - i - 1;
                    if(j <= numberOfSamplesInX - i - 2 && j > 0){
                        aux1= EarlyExageration.Factor * p[i][z] * CalculateZQij( i, j + i + 1);
                        aux = aux1 * (y[i][0] - y[j+ i + 1][0]);
                        Fattr[i][0] = Fattr[i][0] + aux;
                        Fattr[j + i + 1][0] = Fattr[j + i + 1][0] - aux;
                        aux = aux1 * (y[i][1] - y[j+ i + 1][1]);
                        Fattr[i][1] = Fattr[i][1] + aux;
                        Fattr[j + i + 1][1] = Fattr[j + i + 1][1] - aux;
                        aux = aux1 * (y[i][2] - y[j+ i + 1][2]);
                        Fattr[i][2] = Fattr[i][2] + aux;
                        Fattr[j + i + 1][2] = Fattr[j + i + 1][2] - aux;
                    }
                }
            }
            push();
            stroke(150);
            textSize(20);
            strokeWeight(1);
            text('Early Exageration Active', 470, 10, 250, 50);
            pop();
            EarlyExageration.Counter = EarlyExageration.Counter + 1;
            if (EarlyExageration.Counter > EarlyExageration.Iterations){EarlyExageration.DidIFinish = true}
        }
        for(let i = 0; i <= numberOfSamplesInX - 2; i++){
            OctTree.ListOfEquivalentBodiesOfI(y, i, TradeOff, ResultOT);
            for(let z = 0; z <= ResultOT.ResultOfTheQueryOT1.length - 1; z++){
                aux = CalculateZQij2( i, ResultOT.ResultOfTheQueryOT1[z]);
                Sumq = Sumq + ResultOT.ResultOfTheQueryOT2[z] * 2 / aux;
                aux1 = Math.pow(aux, 2);
                aux = aux1 * (y[i][0] - ResultOT.ResultOfTheQueryOT1[z][0] * ResultOT.ResultOfTheQueryOT2[z])
                Frep[i][0] = Frep[i][0] - aux;
                aux = aux1 * (y[i][1] - ResultOT.ResultOfTheQueryOT1[z][1] * ResultOT.ResultOfTheQueryOT2[z])
                Frep[i][1] = Frep[i][1] - aux;
                aux = aux1 * (y[i][2] - ResultOT.ResultOfTheQueryOT1[z][2] * ResultOT.ResultOfTheQueryOT2[z])
                Frep[i][2] = Frep[i][2] - aux;
            }
            for(let z = 0; z <= ResultOT.ResultOfTheQueryOT3.length - 1; z++){
                aux = CalculateZQij( i, ResultOT.ResultOfTheQueryOT3[z]);
                Sumq = Sumq +  2 / aux;
                aux1 = Math.pow(aux, 2);
                aux = aux1 * (y[i][0] - y[ResultOT.ResultOfTheQueryOT3[z]][0]);
                Frep[i][0] = Frep[i][0] - aux;
                aux = aux1 * (y[i][1] - y[ResultOT.ResultOfTheQueryOT3[z]][1]);
                Frep[i][1] = Frep[i][1] - aux;
                aux = aux1 * (y[i][2] - y[ResultOT.ResultOfTheQueryOT3[z]][2]);
                Frep[i][2] = Frep[i][2] - aux;
            }
        }
        //y adjustment
        for(let i = 0; i <= numberOfSamplesInX - 1; i++){
            aux = y[i][0];
            y[i][0] = y[i][0] - LearningRatio * (Fattr[i][0] + Frep[i][0] / Sumq) + Momentum * (y[i][0] - oldy[i][0]);
            oldy[i][0] = aux;
            if(BiggestY < Math.abs(y[i][0])){BiggestY = Math.abs(y[i][0])}
            aux = y[i][1];
            y[i][1] = y[i][1] - LearningRatio * (Fattr[i][1] + Frep[i][1] / Sumq) + Momentum * (y[i][1] - oldy[i][1]);
            oldy[i][1] = aux;
            if(BiggestY < Math.abs(y[i][1])){BiggestY = Math.abs(y[i][1])}
            aux = y[i][2];
            y[i][2] = y[i][2] - LearningRatio * (Fattr[i][2] + Frep[i][2] / Sumq) + Momentum * (y[i][2] - oldy[i][2]);
            oldy[i][2] = aux;
            if(BiggestY < Math.abs(y[i][2])){BiggestY = Math.abs(y[i][2])}
        }
    }
    function CalculateZQij( i, j){
        let aux=0;
        aux = aux + Math.pow(y[i][0] - y[j][0], 2);
        aux = aux + Math.pow(y[i][1] - y[j][1], 2);
        aux = aux + Math.pow(y[i][2] - y[j][2], 2);
        return Math.pow(1 + aux, -1);
    }
    function CalculateZQij2( i, CenterOfMass){
        let aux=0;
        aux = aux + Math.pow(y[i][0] - CenterOfMass[0], 2);
        aux = aux + Math.pow(y[i][1] - CenterOfMass[1], 2);
        aux = aux + Math.pow(y[i][2] - CenterOfMass[2], 2);
        return Math.pow(1 + aux, -1);
    }
}
function zeros(dimensions){
    var array = [];
    for (var i = 0; i <= dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }
    return array;
}
function zeros2(dimensions){
    var array = Array(dimensions);
    for (var i = 0; i < dimensions; ++i) {
        array[i] = Array(3).fill(0);
    }
    return array;
}
function matmul(a, b) {
    let m = [];
    m[0] = [];
    m[1] = [];
    m[2] = [];
    m[0][0] = b[0];
    m[1][0] = b[1];
    m[2][0] = b[2];
  
    let colsA = a[0].length;
    let rowsA = a.length;
    let colsB = m[0].length;
  
    result = [];
    for (let j = 0; j < rowsA; j++) {
      result[j] = [];
      for (let i = 0; i < colsB; i++) {
        let sum = 0;
        for (let n = 0; n < colsA; n++) {
          sum += a[j][n] * m[n][i];
        }
        result[j][i] = sum;
      }
    }
    return result;
}