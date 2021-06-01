// canvas header by alex miller (fotoflo@gmail.com)

window.onload = function() {
  //dom not only ready, but everything is loaded

  console.log("window loaded")
  const myHeroCanvas = new HeroCanvas()
  myHeroCanvas.generateCanvas();
};


class HeroCanvas {
  constructor(height, width) {
    this.canvas = document.getElementById("headCanvas");
    this.ctx = this.canvas.getContext("2d")
    this.height = this.setCanvasHeight();
    this.width = this.setCanvasWidth();

    this.circles = []

    window.addEventListener('resize', e => this.resizeCanvas(e));
  }

  generateRandomCircles(xDistance=100, yDistance=100, radius=30, rigitity=1.5){
    const points = []
    const Xs = window.innerWidth / xDistance; // this many points
    const Ys = window.innerHeight / yDistance; 

    let xRand, yRand;
    for( let i = 0 ; i < Xs; i++){
      for( let j = 0; j < Ys; j++){
        xRand = xDistance * 1/rigitity * Math.random();
        yRand = yDistance * 1/rigitity * Math.random();
        points[i] = { 
          x: i * xDistance + xRand, 
          y: j * yDistance + yRand
        }
        if(this.checkPoint(points[i], radius)){
          this.circles.push( new HeroCircle( points[i], radius, this.ctx ) )
        }
      }  
    }
  }

  checkPoint(point, radius, maxDistCoefficient = 2){
    for(let i = 0; i < this.circles.length; i++){
      const circle = this.circles[i]
      const dist = circle.distToEdge(point)
      // console.log(`dist: ${dist}, radius * 3, ${radius * 3}`)
      if( dist === -1 || dist < radius * maxDistCoefficient){
        return false
      } 
    }
    return true
  }

  generateCanvas(){
    console.log("filling canvas")
    console.log("width", this.width)
    console.log("height", this.height)  
    
    this.generateRandomCircles(250,250, 40)
    this.generateRandomCircles(120,120, 10)
    this.generateRandomCircles(50, 50, 5)

    console.log("canvas filled")
  } 

  fillBackground(){
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "white" //"#" + randomColor();
    this.ctx.fill();
  }

  resetCanvas(){
    this.circles = []
    this.setCanvasWidth();
    this.setCanvasHeight();
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  resizeCanvas(){
    this.resetCanvas()
    this.generateCanvas()
  }

  setCanvasWidth(){    
    this.width = getViewportWidth();
    this.canvas.width  = this.width;
    return this.width;
  }
  setCanvasHeight() {    
    const viewportHeight = getViewportHeight();
    const bottomMargin = Math.max(viewportHeight * .1, 100);
    this.height = viewportHeight; // - bottomMargin;
    this.canvas.height  = this.height;
    return this.height;
  }
}

function getViewportWidth() {
  return window.innerWidth;
}

function getViewportHeight() {
  return window.innerHeight;
}

function randomColor(){
  return Math.floor(Math.random()*16777215).toString(16)
}

