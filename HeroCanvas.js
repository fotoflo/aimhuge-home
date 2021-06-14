// canvas header by alex miller (fotoflo@gmail.com)

const TEXTMARGIN = 20;
const TRAPEZOID_MARGIN = 20;
const FUNNEL_STARTPOINT = { x: 700, y: 400 }
const TEXT_STARTPOINT = { x: 300, y: 400}
const HERO_COPY = `AimHuge \n Growth \n Consulting`
//const HERO_COPY = `Dion \n Lisl \n Mommy \n Daddy`

window.onload = function() {
  //dom not only ready, but everything is loaded

  console.log("window loaded")
  const myHeroCanvas = new HeroCanvas()
  myHeroCanvas.generateCanvas()
};


class HeroCanvas {
  constructor(height, width) {
    this.canvas = document.getElementById("headCanvas");
    
    this.ctx = this.canvas.getContext("2d")
    this.height = this.setCanvasHeight();
    this.width = this.setCanvasWidth();

    this.rects = []
    this.circles = []

    window.addEventListener('resize', e => this.resizeCanvas(e));
    this.canvas.addEventListener('mousedown', e => {this.resetCanvas(e); this.generateCanvas() })
    this.generateCanvas()
    // this.backoffRepeat( 500 )
  }

  generateCanvas(){
    //this.resetCanvas()
    console.log("filling canvas")
    console.log("width", this.width)
    console.log("height", this.height)  

    
    this.heroText = new HeroText( TEXT_STARTPOINT, HERO_COPY, 100, this.ctx)
    this.heroFunnel = new HeroFunnel(this.ctx)
    
    this.generateRandomCircles(250,250, 40)
    this.generateRandomCircles(180,180, 10)
    this.generateRandomCircles(80, 80, 5)

    console.log("canvas filled")
  } 
  
  async backoffRepeat(ms, fn){
    for(let i = 0; i < 20 ;i++){
      await wait(ms * i)
      this.generateCanvas()
    }
  }

  fillBackground(){
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "white" //"#" + randomColor();
    this.ctx.fill();
  }

  generateRandomCircles(xDistance=100, yDistance=100, radius=30){
    const points = []
    const Xs = window.innerWidth / xDistance; // this many points
    const Ys = window.innerHeight / yDistance; 

    let xRand, yRand;
    for( let i = 0 ; i < Xs; i++){
      for( let j = 0; j < Ys; j++){
        xRand = xDistance * Math.random();
        yRand = yDistance * Math.random();
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

    //check trapazoids
    for( let i = 0; i < this.heroFunnel.heroZoids.length; i++){
      const zoid = this.heroFunnel.heroZoids[i]
      const distToZoid = zoid.distTo(point)
      if(distToZoid == -1 || distToZoid < TRAPEZOID_MARGIN + radius + 2 ){
        return false
      }  
    }

    //check squares
    const distToText = this.heroText.distToNearestEdge(point)
    if(distToText == -1 || distToText < TEXTMARGIN + radius + 2 ){
      return false
    }

    // check bottom
    const distToBottom = this.height - point.y ;
    const distToRight = this.width - point.x ;
    const RadiusPlusMargin = radius + 5
    if( RadiusPlusMargin > distToBottom  ) return false; // Check Bottom
    if( RadiusPlusMargin > point.y) return false; // Top
    if( RadiusPlusMargin > point.x ) return false;  // Left
    if( RadiusPlusMargin > distToRight) return false // Right

    //check cirlces
    for(let i in this.circles){
      const circle = this.circles[i]
      const dist = circle.distToEdge(point)
      // console.log(`dist: ${dist}, radius * 3, ${radius * 3}`)
      if( dist === -1 || dist < radius * maxDistCoefficient){
        return false
      } 
    }
    return true
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

function wait(ms){
  return new Promise((res) => setTimeout(res, ms));
} 

