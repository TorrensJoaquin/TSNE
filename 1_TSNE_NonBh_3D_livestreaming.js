let DesiredPerplexity = 6;
let numberOfIterations = 1;
let LearningRatio = 1;
let Momentum = 0.8;
let p = [];
let y = [];
let oldy = [];
let numberOfSamplesInX;
let Maximum = -100;
let Minimum = 100;
let RangeX = 0;
let BiggestY = 2;
let numberOfDimentionsInLowDimensionalSpace = 3;
let angle = 0;
let points = [];
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
    LoadX(Math.floor(Math.random()*3));
    CreateTheInputsBoxes();
    CreateTheInputs();
    let SizeOfCanvas = [700, 700];
    let PositonOfCanvas = [100, 425];
    createCanvas(SizeOfCanvas[0], SizeOfCanvas[1]).position(PositonOfCanvas[0], PositonOfCanvas[1]);
    LearningRatio = LearningRatio * 4; //By definition of dydt ... It doesn't make sense using the *4 inside the loop
    numberOfSamplesInX = X.length;
    let numberOfDimentions = X[1].length;
    y=zeros([numberOfSamplesInX-1,numberOfDimentionsInLowDimensionalSpace-1]);
    oldy=zeros([numberOfSamplesInX-1,numberOfDimentionsInLowDimensionalSpace-1]);
    //Compute Non Symetric Pair Wise Affinities [pj|i] with perplexity [Per]
    //pj|i=exp(-||xi-xj||^2/2Sigma^2)/Sum(exp(-||xi-xk||^2/2Sigma^2))
    //Perp(Pi)=2^H(Pi)
    //H(Pi)=-Sum(pj|i)*log2(pj|i)
    //pj|i and later will be pji
    p = SearchMeForFixedPerpexity(X, numberOfSamplesInX, numberOfDimentions, DesiredPerplexity);
    //Set pij= ( pj|i + pi|j ) / 2 * n
    for(let i = 0; i <= numberOfSamplesInX - 2; i++){
        for(let j = 0; j <= numberOfSamplesInX - i - 2; j++){
            p[i][j] = p[i][j] / numberOfSamplesInX;
        }
    }
    //Sample Initial Solution Y
    for(let i = 0; i <= numberOfSamplesInX - 2; i++){
        for(let n = 0; n <= numberOfDimentionsInLowDimensionalSpace - 1; n++){
            y[i][n] = Math.random()-0.5;
        }
    }
    //for t=1 to T do
    //compute low-dimensional affinities qij
    //qij = (1+||yi-yj||^2)^-1) / Sum((1+||yk-yl||^2)^-1)
    //Compute gradient dCdY
    //dCdY=4*Sum((pij-qij)*(yi-yj)*(1+||yi-yj||^2))^-1
    //Set y(t)=y(t-1) + n dCdy + a(t) * (y(t-1)-y(t-2))
    //end
}
function draw() {
    background(0);
    YUpload(p, y, oldy, numberOfSamplesInX, numberOfDimentionsInLowDimensionalSpace, numberOfIterations, Momentum, LearningRatio);
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
    let p = GenerateHalfAMatrix(numberOfSamplesInX); //pj|i
    for(let i = 0; i <= numberOfSamplesInX - 2; i++){
        for(let j = 0; j <= numberOfSamplesInX - i - 2; j++){
            for(let n = 0; n <= numberOfDimentions - 1; n++){
                p[i][j] = p[i][j] + Math.pow(X[i][n] - X[j + i + 1][n], 2);
            }
        }
    }
    return p;
}
function getMeThePairWiseAffinities2(auxiliar, numberOfSamplesInX, minusTwoSigmaSquared){
    // get the sum of pair wise affinities and the non normilized pair wise affinities
    let sumOfPairWiseAffinities = Array(numberOfSamplesInX).fill(0);
    let p = GenerateHalfAMatrix(numberOfSamplesInX);
    for(let i = 0; i <= numberOfSamplesInX - 2; i++){
        for(let j = 0; j <= numberOfSamplesInX - i - 2; j++){
            p[i][j] = Math.exp(auxiliar[i][j] / (minusTwoSigmaSquared[i] + 0.000001));
            sumOfPairWiseAffinities[i] = sumOfPairWiseAffinities[i] + p[i][j];
            sumOfPairWiseAffinities[j + i + 1] = sumOfPairWiseAffinities[j + i + 1] + p[i][j];
        }
    }
    // get the normilized pair wise affinities
    for(let i = 0; i <= numberOfSamplesInX - 2; i++){
        for(let j = 0; j <= numberOfSamplesInX - i - 2; j++){
            p[i][j] = p[i][j] / (sumOfPairWiseAffinities[j + i + 1] + 0.000001);
        }
    }
    return p;
}
function SearchMeForFixedPerpexity(X, numberOfSamplesInX, numberOfDimentions, DesiredPerplexity){
    let top1 = Array(numberOfSamplesInX).fill(0);
    let top2 = Array(numberOfSamplesInX).fill(0);
    let middle1 = Array(numberOfSamplesInX).fill(0);
    let middle2 = Array(numberOfSamplesInX).fill(0);
    let bottom1 = Array(numberOfSamplesInX).fill(0);
    let bottom2 = Array(numberOfSamplesInX).fill(0);
    let p = []; //pj|i
    let aux = getMeThePairWiseAffinities1(X, numberOfSamplesInX, numberOfDimentions);
    for(let i = 0; i <= numberOfSamplesInX - 1; i++){
        top1[i] = -50;
        bottom1[i] = -0.001;
    }
    let IShouldStay = true;
    for(let iter = 1; iter <= 50; iter++){
        IShouldStay = true;
        p = getMeThePairWiseAffinities2(aux, numberOfSamplesInX, top1);
        top2 = GetMeThePerplexity(p, numberOfSamplesInX);
        for(let i = 0; i <= numberOfSamplesInX - 1; i++){
            if(top2[i] < DesiredPerplexity){
                IShouldStay = false;
                top1[i] = top1[i] * 2;
            }
        }
        if(IShouldStay){iter = 51};
    }
    for(let iter = 1; iter <= 50; iter++){
        IShouldStay = true;
        p = getMeThePairWiseAffinities2(aux, numberOfSamplesInX, bottom1);
        bottom2 = GetMeThePerplexity(p, numberOfSamplesInX);
        for(let i = 0; i <= numberOfSamplesInX - 1; i++){
            if(bottom2[i] > DesiredPerplexity){
                IShouldStay = false;
                bottom1[i] = bottom1[i] * 0.5;
            }
        }
        if(IShouldStay){iter = 51};
    }
    for(let i = 0; i <= numberOfSamplesInX - 1; i++){
        middle1[i] = (top1[i] + bottom1[i]) / 2;
    }
    p = getMeThePairWiseAffinities2(aux, numberOfSamplesInX, middle1);
    middle2 = GetMeThePerplexity(p, numberOfSamplesInX);
    for(let iter = 1; iter <= 100; iter++){
        //Decision Maker (you can do better than this, see it later)
        for(let i = 0; i <= numberOfSamplesInX - 1; i++){
            if(Math.abs(middle2[i] - DesiredPerplexity) < 0.01 || iter == 500){
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
    return p;
}
function GetMeThePerplexity(p, numberOfSamplesInX){
    let Perplexities=Array(numberOfSamplesInX).fill(0);
    for(i = 0; i <= numberOfSamplesInX - 2; i++){
        for(j = 0; j <= numberOfSamplesInX - i - 2; j++){
            let aux = p[i][j] * Math.log2(p[i][j] + 0.001);
            Perplexities[i] = Perplexities[i] + aux;
            Perplexities[j + i + 1] = Perplexities[j + i + 1] + aux;
        }
    }
    for(i = 0; i <= numberOfSamplesInX - 1; i++){
        Perplexities[i] = Math.pow( 2, -Perplexities[i]);
    }
    return Perplexities;
}
function YUpload(p, y, oldy, numberOfSamplesInX, numberOfDimentionsInLowDimensionalSpace, numberOfIterations, Momentum, LearningRatio){
    let aux;
    let aux1;
    for(let iter = 0; iter <= numberOfIterations; iter++){
        let Zq = GenerateHalfAMatrix(numberOfSamplesInX);
        let Sumq = 0;
        let dCdYi = zeros([numberOfSamplesInX-1,numberOfDimentionsInLowDimensionalSpace-1]);
        for(let i = 0; i <= numberOfSamplesInX - 2; i++){
            for(let j = 0; j <= numberOfSamplesInX - i - 2; j++){
                for(let n = 0; n <= numberOfDimentionsInLowDimensionalSpace - 1; n++){
                    Zq[i][j] = Zq[i][j] + Math.pow(y[i][n] - y[j + i + 1][n], 2);
                }
                Zq[i][j] = Math.pow(1 + Zq[i][j], -1);
                Sumq = Sumq + 2 * Zq[i][j];
            }
        }
        for(let i = 0; i <= numberOfSamplesInX - 2; i++){
            for(let j = 0; j <= numberOfSamplesInX - i - 2; j++){
                aux1 = (p[i][j] - Zq[i][j] / Sumq) * Zq[i][j];
                for(let n = 0; n <= numberOfDimentionsInLowDimensionalSpace - 1; n++){
                    aux = aux1 * (y[i][n] - y[j+ i + 1][n]);
                    dCdYi[i][n] = dCdYi[i][n] + aux;
                    dCdYi[j + i + 1][n] = dCdYi[j + i + 1][n] - aux;
                }
            }
        }
        //y adjustment
        for(let i = 0; i <= numberOfSamplesInX - 1; i++){
            for(let n = 0; n <= numberOfDimentionsInLowDimensionalSpace - 1; n++){
                aux = y[i][n];
                y[i][n] = y[i][n] - LearningRatio * dCdYi[i][n] + Momentum * (y[i][n] - oldy[i][n]);
                oldy[i][n] = aux;
                if(BiggestY < Math.abs(y[i][n])){BiggestY = Math.abs(y[i][n])}
            }
        }
    }
}
function GenerateHalfAMatrix(dimensions){
    let aux = Array(dimensions - 1).fill(0);
    let aux1 = [];
    for(let i=0; i <= dimensions - 2; i++){
        aux1=Array(dimensions - i - 1).fill(0);
        aux[i]=aux1;
    }
    return aux;
}
function zeros(dimensions){
    var array = [];
    for (var i = 0; i <= dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
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
