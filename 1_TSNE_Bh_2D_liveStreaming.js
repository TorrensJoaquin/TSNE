let DesiredPerplexity = 3;
let LearningRatio = 3;
let Momentum = 0.3;
let TradeOff = 0.5;
let p = [];
let y = [];
let oldy = [];
let numberOfSamplesInX;
let BiggestY = 2;
let shouldIStartAllOverAgain = true;
let shouldIStartReInitializeY = true;
let ColorMode;
let EarlyExaggeration ={
    DidIFinish : false,
    Counter : 0,
    Iterations : 250,
    Factor : 4,
}
function setup() {
    LoadX(Math.floor(Math.random()*3));
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
        p = []; //pj|i upper
        let p2 = [];
        let aux;
        //
        let IndexElements=[];
        for(let i = 0; i < X.length; i++){
            IndexElements[i] = i;
        }
        let VantagePoint = new VantagePointElement();
        VantagePoint.SelectASeedAndFindMu(X, IndexElements);
        VantagePoint.SearchKNeighbors(X, numberOfSamplesInX, DesiredPerplexity);
        delete VantagePoint;
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
        p2 = Array(numberOfSamplesInX).fill(0);
        for(let i = 0; i < numberOfSamplesInX; i++){
            p2[i] = Array(VantagePointQueryArray[i].length).fill(0);
            for(let z = 0; z < VantagePointQueryArray[i].length; z++){
                j = VantagePointQueryArray[i][z];
                if(j != i){
                    for(let k = 0; k < VantagePointQueryArray[j].length; k++){
                        if(VantagePointQueryArray[j][k]==i){
                            p2[i][z] = (p[i][z] + p[j][k]) / (numberOfSamplesInX);
                            k = VantagePointQueryArray[j].length;
                        }
                    }
                }
            }
        }
        p = p2;
        delete p2;
        //Sample Initial Solution Y
        if(shouldIStartReInitializeY){
            y=zeros2(numberOfSamplesInX);
            oldy=zeros2(numberOfSamplesInX);
            for(let i = 0; i <= numberOfSamplesInX - 2; i++){
                for(let n = 0; n < 2; n++){
                    y[i][n] = (Math.random()-0.5);
                }
            }
        }
        shouldIStartReInitializeY = false;
        shouldIStartAllOverAgain = false;
    }
    YUpload(p, y, oldy, numberOfSamplesInX, 1, Momentum, LearningRatio, VantagePointQueryArray, TradeOff);
    strokeWeight(5);
    noFill();
    if (ColorMode == 0){
        stroke(255);
        for (let i = 0; i < y.length; i++) {
            point((y[i][0]*300/BiggestY+350), (y[i][1]*300/BiggestY+350));
        }
    }else if(ColorMode == 1){
        for (let i = 0; i < y.length; i++) {
            stroke(Colors[i]);
            point((y[i][0]*300/BiggestY+350), (y[i][1]*300/BiggestY+350));
        }
    }else{
        for (let i = 0; i < y.length; i++) {
            stroke(Colors[i][0],Colors[i][1],Colors[i][2]);
            point((y[i][0]*300/BiggestY+350), (y[i][1]*300/BiggestY+350));
        }
    }
    if (mouseX > 0 && mouseX < 700 && mouseY > 0 && mouseY < 700){
        let iPressed = null;
        for (let i = 0; i < y.length; i++) {
            if(Math.abs(y[i][0]*300/BiggestY+350 - mouseX) < 5 && Math.abs(y[i][1]*300/BiggestY+350 - mouseY) < 5){
                iPressed = i;
                i = y.length;
            }
        }
        if (iPressed != null){
            push();
            stroke(255,0,90);
            strokeWeight(10);
            point(y[iPressed][0], y[iPressed][1]);
            push();
            textSize(30);
            strokeWeight(1);
            stroke(255);
            if (typeof Labels != 'undefined'){
                text(Labels[iPressed], 50, 50, 50, 50);
            }else{text(iPressed,50, 50, 50, 50)}
            pop();
        }
    }
}
function getMeThePairWiseAffinities1(X, numberOfSamplesInX, numberOfDimentions){
    //This is the part of the code that is independant of minusTwoSigmaSquared.
    //I can play this part of the code only once during the sigma search.
    let p = Array(numberOfSamplesInX).fill(0); //pj|i
    for(let i = 0; i < numberOfSamplesInX; i++){
        p[i] = Array(VantagePointQueryArray[i].length).fill(0);
        for(let z = 0; z < VantagePointQueryArray[i].length; z++){
            j = VantagePointQueryArray[i][z];
            if(j != i){
                for(let n = 0; n < numberOfDimentions; n++){
                    p[i][z] = p[i][z] + Math.pow(X[i][n] - X[j][n], 2);
                }
            }
        }
    }
    return p;
}
function getMeThePairWiseAffinities2(auxiliar, numberOfSamplesInX, minusTwoSigmaSquared){
    // get the sum of pair wise affinities and the non normilized pair wise affinities
    let sumOfPairWiseAffinities = Array(numberOfSamplesInX).fill(0);
    let p = Array(numberOfSamplesInX).fill(0); //pj|i upper
    for(let i = 0; i < numberOfSamplesInX; i++){
        p[i] = Array(VantagePointQueryArray[i].length).fill(0);
        for(let z = 0; z <= VantagePointQueryArray[i].length - 1; z++){
            j = VantagePointQueryArray[i][z];
            if(j != i){
                p[i][z] = Math.exp(auxiliar[i][z] / (minusTwoSigmaSquared[i] + 0.000001));
                sumOfPairWiseAffinities[i] = sumOfPairWiseAffinities[i] + p[i][z];
            }
        }
    }
    // get the normilized pair wise affinities
    for(let i = 0; i < numberOfSamplesInX; i++){
        for(let z = 0; z <= VantagePointQueryArray[i].length - 1; z++){
            j = VantagePointQueryArray[i][z];
            if(j != i){
                p[i][z] = p[i][z] / (sumOfPairWiseAffinities[j] + 0.000001);            
            }
        }
    }
    return p;
}
function GetMeThePerplexity(p, numberOfSamplesInX){
    let Perplexities=Array(numberOfSamplesInX).fill(0);
    for(i = 0; i <= numberOfSamplesInX - 2; i++){
        for(let z = 0; z < VantagePointQueryArray[i].length; z++){
            j = VantagePointQueryArray[i][z];
            let aux = 0;
            if(j != i){
                aux = p[i][z] * Math.log2(p[i][z] + 0.001);
                Perplexities[i] = Perplexities[i] + aux;
            }
        }
    }
    for(i = 0; i < numberOfSamplesInX; i++){
        Perplexities[i] = Math.pow( 2, -Perplexities[i]);
    }
    return Perplexities;
}
function YUpload(p, y, oldy, numberOfSamplesInX, numberOfIterations, Momentum, LearningRatio, VantagePointQueryArray, TradeOff){
    let aux;
    let aux1;
    let j;
    let IndexElements=[];
    let ResultQT = new QuadTreeResults();
    for(let i = 0; i < y.length; i++){
        IndexElements[i] = i;
    }
    for(let iter = 0; iter <= numberOfIterations; iter++){
        let Fattr = zeros2(numberOfSamplesInX);
        let Frep = zeros2(numberOfSamplesInX);
        let Sumq = 0;
        QuadTree = new QuadtreeElement([0,0,0], BiggestY);
        QuadTree.InsertInBoxes(y, IndexElements);
        BiggestY = 0;
        if (EarlyExaggeration.DidIFinish){
            for(let i = 0; i <= numberOfSamplesInX - 2; i++){
                for(let z = 0; z <= VantagePointQueryArray[i].length - 1; z++){
                    j = VantagePointQueryArray[i][z];
                    if(j != i){
                        aux1=p[i][z] * CalculateZQij( i, j);
                        aux = aux1 * (y[i][0] - y[j][0]);
                        Fattr[i][0] = Fattr[i][0] + aux;
                        aux = aux1 * (y[i][1] - y[j][1]);
                        Fattr[i][1] = Fattr[i][1] + aux;
                    }
                }
            }
        }else{
            for(let i = 0; i <= numberOfSamplesInX - 2; i++){
                for(let z = 0; z <= VantagePointQueryArray[i].length - 1; z++){
                    j = VantagePointQueryArray[i][z];
                    if(j != i){
                        aux1= EarlyExaggeration.Factor * p[i][z] * CalculateZQij( i, j);
                        aux = aux1 * (y[i][0] - y[j][0]);
                        Fattr[i][0] = Fattr[i][0] + aux;
                        aux = aux1 * (y[i][1] - y[j][1]);
                        Fattr[i][1] = Fattr[i][1] + aux;
                    }
                }
            }
            push();
            stroke(150);
            textSize(20);
            strokeWeight(1);
            text('Early Exaggeration Active', 470, 10, 250, 50);
            pop();
            EarlyExaggeration.Counter = EarlyExaggeration.Counter + 1;
            if (EarlyExaggeration.Counter > EarlyExaggeration.Iterations){EarlyExaggeration.DidIFinish = true}
        }
        for(let i = 0; i <= numberOfSamplesInX - 2; i++){
            QuadTree.ListOfEquivalentBodiesOfI(y, i, TradeOff, ResultQT);
            for(let z = 0; z < ResultQT.ResultOfTheQueryQT1.length; z++){
                aux = CalculateZQij2( i, ResultQT.ResultOfTheQueryQT1[z]);
                Sumq = Sumq + ResultQT.ResultOfTheQueryQT2[z] / aux;
                aux1 = Math.pow(aux, 2);
                aux = aux1 * (y[i][0] - ResultQT.ResultOfTheQueryQT1[z][0] * ResultQT.ResultOfTheQueryQT2[z])
                Frep[i][0] = Frep[i][0] - aux;
                aux = aux1 * (y[i][1] - ResultQT.ResultOfTheQueryQT1[z][1] * ResultQT.ResultOfTheQueryQT2[z])
                Frep[i][1] = Frep[i][1] - aux;
            }
            for(let z = 0; z < ResultQT.ResultOfTheQueryQT3.length; z++){
                aux = CalculateZQij( i, ResultQT.ResultOfTheQueryQT3[z]);
                Sumq = Sumq +  1 / aux;
                aux1 = Math.pow(aux, 2);
                aux = aux1 * (y[i][0] - y[ResultQT.ResultOfTheQueryQT3[z]][0]);
                Frep[i][0] = Frep[i][0] - aux;
                aux = aux1 * (y[i][1] - y[ResultQT.ResultOfTheQueryQT3[z]][1]);
                Frep[i][1] = Frep[i][1] - aux;
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
        }
    }
    function CalculateZQij( i, j){
        let aux=0;
        aux = aux + Math.pow(y[i][0] - y[j][0], 2);
        aux = aux + Math.pow(y[i][1] - y[j][1], 2);
        return Math.pow(1 + aux, -1);
    }
    function CalculateZQij2( i, CenterOfMass){
        let aux=0;
        aux = aux + Math.pow(y[i][0] - CenterOfMass[0], 2);
        aux = aux + Math.pow(y[i][1] - CenterOfMass[1], 2);
        return Math.pow(1 + aux, -1);
    }
    function CalculateZQijL1( i, j){
        let aux=0;
        aux = aux + Math.abs(y[i][0] - y[j][0]);
        aux = aux + Math.abs(y[i][1] - y[j][1]);
        return Math.pow(1 + aux, -1);
    }
    function CalculateZQij2L1( i, CenterOfMass){
        let aux=0;
        aux = aux + Math.abs(y[i][0] - CenterOfMass[0]);
        aux = aux + Math.abs(y[i][1] - CenterOfMass[1]);
        return aux;
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
        array[i] = Array(2).fill(0);
    }
    return array;
}
