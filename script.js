let currentGrid = [];
let nextGenGrid = [];
let currentParticleMode = 1;

const particlePlacementDiameter = 100;

const gridWidth = 800;
const gridLength = 800;

// 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 16, 20, 24, 30, 32, 40, 48, 60, 64, 80, 96, 120, 128, 160, 192, 240, 320, 384, 480, 640, 960, and 1920
const gridRows = 100;

// 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 27, 30, 36, 40, 45, 54, 60, 72, 90, 108, 120, 135, 180, 216, 270, 360, 540, 1080
const gridCols = 100;
class SandParticle{
    constructor(){
        this.flammable = false;
        this.color = "#FAF2C3";
        this.acceleration = 1;
    }

    particleUpdate(x, y){
        for(let expectedLocation = this.acceleration + y; expectedLocation > y; expectedLocation--){
            if(expectedLocation < currentGrid[x].length){
                if(currentGrid[x][expectedLocation] == null){
                    nextGenGrid[x][expectedLocation] = currentGrid[x][y];
                    this.acceleration++;
                    return;
                }else{
                    let flipACoin = floor(random(0,2));
                    if(x < currentGrid.length -1 && currentGrid[x + 1][expectedLocation] == null && flipACoin == 0){
                        nextGenGrid[x + 1][expectedLocation] = currentGrid[x][y];
                        this.acceleration++;
                        return;
                    }else if(x > 0 && currentGrid[x - 1][expectedLocation] == null && flipACoin == 1){
                        nextGenGrid[x - 1][expectedLocation] = currentGrid[x][y];
                        this.acceleration++;
                        return;
                    }
                    
                }
            }
        }
        
        nextGenGrid[x][y] = currentGrid[x][y];
        this.acceleration = 1;
    }

}

class StoneParticle{
    constructor(){
        this.flammable = false;
        this.color = "#b1b1b1";
        this.acceleration = 0;
    }

    particleUpdate(x, y){
        nextGenGrid[x][y] = currentGrid[x][y];
    }

}

class SmokeParticle{
    constructor(){
        this.flammable = false;
        this.color = "#474747";
        this.acceleration = 1;
    }

    particleUpdate(x, y){
        let expectedLocation = y - this.acceleration;
        if(expectedLocation >= 0){
            let flipACoin = floor(random(0,2));
            if(currentGrid[x][expectedLocation] == null){
                nextGenGrid[x][expectedLocation] = currentGrid[x][y];
                return;
            }else if(x < currentGrid.length -1 && currentGrid[x + 1][expectedLocation] == null && flipACoin == 0){
                nextGenGrid[x + 1][expectedLocation] = currentGrid[x][y];
                return;
            }else if(x < currentGrid.length -1 && nextGenGrid[x + 1][expectedLocation + 1] == null && currentGrid[x + 1][expectedLocation + 1] == null && flipACoin == 0){
                nextGenGrid[x + 1][expectedLocation + 1] = currentGrid[x][y];
                return;
            }else if(x > 0 && currentGrid[x - 1][expectedLocation] == null && flipACoin == 1){
                nextGenGrid[x - 1][expectedLocation] = currentGrid[x][y];
                return;
            }else if(x > 0 && nextGenGrid[x - 1][expectedLocation + 1] == null && currentGrid[x - 1][expectedLocation + 1] == null && flipACoin == 1){
                nextGenGrid[x - 1][expectedLocation + 1] = currentGrid[x][y];
                return;
            }
        }
        
        nextGenGrid[x][y] = currentGrid[x][y];
    }

}


class WaterParticle{
    constructor(){
        this.flammable = false;
        this.color = "#4682B4";
        this.acceleration = 1;
    }

    particleUpdate(x, y){
        for(let expectedLocation = this.acceleration + y; expectedLocation > y; expectedLocation--){
            if(expectedLocation < currentGrid[x].length){
                let flipACoin = floor(random(0,2));
                if(currentGrid[x][expectedLocation] == null){
                    nextGenGrid[x][expectedLocation] = currentGrid[x][y];
                    this.acceleration++;
                    return;
                }else if(x < currentGrid.length -1 && currentGrid[x + 1][expectedLocation] == null && flipACoin == 0){
                    nextGenGrid[x + 1][expectedLocation] = currentGrid[x][y];
                    this.acceleration++;
                    return;
                }else if(x < currentGrid.length -1 && nextGenGrid[x + 1][expectedLocation - 1] == null && currentGrid[x + 1][expectedLocation - 1] == null && flipACoin == 0){
                    nextGenGrid[x + 1][expectedLocation - 1] = currentGrid[x][y];
                    this.acceleration++;
                    return;
                }else if(x > 0 && currentGrid[x - 1][expectedLocation] == null && flipACoin == 1){
                    nextGenGrid[x - 1][expectedLocation] = currentGrid[x][y];
                    this.acceleration++;
                    return;
                }else if(x > 0 && nextGenGrid[x - 1][expectedLocation - 1] == null && currentGrid[x - 1][expectedLocation - 1] == null && flipACoin == 1){
                    nextGenGrid[x - 1][expectedLocation - 1] = currentGrid[x][y];
                    this.acceleration++;
                    return;
                }
            }
        }
        
        nextGenGrid[x][y] = currentGrid[x][y];
        this.acceleration = 1;
    }

}

function generateEmptyGrid(){
    let newGrid = [];
    for(let i = 0; i < gridRows; i++){
        let temp = [];
        for(let j = 0; j < gridCols; j++){
            temp.push(null);
        }
        newGrid.push(temp);
    }
    return newGrid;
}

function gridLoop(){
    nextGenGrid = generateEmptyGrid();
    for(let i = 0; i < currentGrid.length; i++){
        for(let j = 0; j < currentGrid[i].length; j++){
            placeParticles(i,j);
            if(currentGrid[i][j] != null){
                currentGrid[i][j].particleUpdate(i, j);
                noStroke();
                fill(currentGrid[i][j].color);
                rect(i * (gridWidth / gridRows),j * (gridLength / gridCols),gridWidth / gridRows,gridLength / gridCols);
            }
        }
    }
    currentGrid = nextGenGrid;
}

function placeParticles(i, j){
    if(dist(mouseX,mouseY,i * (gridWidth / gridRows),j * (gridLength / gridCols)) <= particlePlacementDiameter && mouseIsPressed){
        if(currentParticleMode == 0){
            currentGrid[i][j] = checkParticleMode();
        }else if(currentGrid[i][j] == null){
            currentGrid[i][j] = checkParticleMode();
        }
    }
}

function checkParticleMode(){
    switch(currentParticleMode){
        case 1:
            return new SandParticle();
        case 2:
            return new WaterParticle();
        case 3:
            return new SmokeParticle();
        case 4:
            return new StoneParticle();
        case 0:
            return null;
    }
}

function keyPressed(){
    switch(key){
        case '1':
            currentParticleMode = 1;
        break;
        case '2':
            currentParticleMode = 2;
        break;
        case '3':
            currentParticleMode = 3;
        break;
        case '4':
            currentParticleMode = 4;
        break;
        case '0':
            currentParticleMode = 0;
        break;
    }
}

function setup(){
    let currentCanvas = createCanvas(gridWidth,gridLength);
    currentCanvas.parent("canvasContainer");
    currentGrid = generateEmptyGrid();
}

function draw(){
    background("#000")
    gridLoop();
    


    noFill();
    stroke("#ffffff")
    circle(mouseX,mouseY,particlePlacementDiameter);
}
