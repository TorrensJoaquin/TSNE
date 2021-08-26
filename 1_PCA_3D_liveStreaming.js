let DesiredPerplexity = 7;
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
let ColorMode;
let EarlyExaggeration ={
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
let projection = [
    [1, 0, 0],
    [0, 1, 0],
];
function setup() {
    LoadX(Math.floor(Math.random()*3));
    CreateTheInputsBoxes();
    let SizeOfCanvas = [700, 700];
    let PositonOfCanvas = [100, 425];
    createCanvas(SizeOfCanvas[0], SizeOfCanvas[1]).position(PositonOfCanvas[0], PositonOfCanvas[1]);
}
function draw(){
    background(0);
    if (shouldIStartAllOverAgain == true){
        y = PerformPCA(X, 3, 10);
        BiggestY = 0;
        for(let i = 0; i < y.length; i++){
            for(let j = 0; j < y[0].length; j++){
                if(Math.abs(y[i][j]) > BiggestY){
                    BiggestY = Math.abs(y[i][0]);
                }
            }
        }
        shouldIStartReInitializeY = false;
        shouldIStartAllOverAgain = false;
    }
    rotationZ[0][0]=cos(angle);
    rotationZ[1][0]=sin(angle);
    rotationZ[0][1]=-rotationZ[1][0];
    rotationZ[1][1]=rotationZ[0][0];
    rotationX[1][1]=rotationZ[0][0];
    rotationX[1][2]=rotationZ[0][1];
    rotationX[2][1]=rotationZ[1][0];
    rotationX[2][2]=rotationZ[0][0];
    rotationY[0][0]=rotationZ[0][0];
    rotationY[0][2]=rotationZ[1][0];
    rotationY[2][0]=rotationZ[0][1];
    rotationY[2][2]=rotationZ[0][0];
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
function zeros( DimensionA, DimensionB){
    let array = Array(DimensionA);
    for (let i = 0; i < DimensionA; ++i) {
        array[i] = Array(DimensionB).fill(0);
    }
    return array;
}
function matmul(a, b) {
    let rowsA = a.length;
    result = [];
    for (let j = 0; j < rowsA; j++){
      result[j] = [];
      for (let i = 0; i < 1; i++){
        let sum = 0;
        for (let n = 0; n < 3; n++){
          sum += a[j][n] * b[n];
        }
        result[j][i] = sum;
      }
    }
    return result;
}
