// canvas header by alex miller (fotoflo@gmail.com)


class HeroCircle {
  constructor(point, radius, ctx) {
    this.canvas = document.getElementById("headCanvas");
    this.ctx = ctx;
    this.radius = radius;
    this.center = point;
    this.x = point["x"];
    this.y = point["y"];

    this.drawCircle(this.center, this.radius)
    
    window.addEventListener('resize', e => this.resizeCanvas(e));
    return this
  }
  
  drawCircle(point, radius, color="red"){
    color = this.getRandomColor()
    // console.log(`drawing cricle ${x}, ${y}, ${radius}, ${color}`)
    this.ctx.beginPath();
    this.ctx.arc(point["x"], point["y"], radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill()
    console.log("drawing circle ", this.ctx.fillStyle)
  }

  onResizeCanvas(){
    console.log("resizing cricle")
  }

  distToEdge(point){
    const x1 = point["x"];
    const y1 = point["y"];
    // h = sqrt(a^2 + b^2)
    const a = x1 - this.x
    const b = y1 - this.y
    const dist = Math.sqrt(a*a + b*b)
    if(dist < this.radius){
      return -1
    } 
    return dist - this.radius
  }

  getRandomColor(){
    const colors = [
      "#FFFD0B",
      "#0000FF",
      "#FB00C9",
      "#FDA8EF",
      "#A5AAFF",
      "#35E52D",
      "#45D5A4",
    ]

    const rand = Math.floor(Math.random() * (colors.length + 1));
    return colors[rand]
  }
}