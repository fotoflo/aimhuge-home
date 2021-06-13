class HeroTrapezoid{
  constructor(ctx, startPoint, topLength, bottomLength, height, color, scale=10, i){
    this.ctx = ctx;
    this.scale = scale;
    this.p = startPoint;
    this.height = height * scale;
    this.color = color;
    this.i = i
    this.topLength = topLength * scale;
    this.bottomLength = bottomLength * scale;
    this.bottomOffset = (topLength - bottomLength) / 2 * scale;

    this.points = {
      topLeft: {
        x: this.p.x,
        y: this.p.y
      },
      topRight: {
        x: this.p.x + this.topLength,
        y: this.p.y
      },
      bottomRight: {
        x: this.p.x + this.bottomLength + this.bottomOffset,
        y: this.p.y + this.height
      },
      bottomLeft: {
        x: this.p.x + this.bottomOffset,
        y: this.p.y + this.height
      }
    }
    
    this.drawTrapezoid(this.points, i);
    return this;
  }

  drawTrapezoid(points,i, color=this.color){
    this.ctx.fillStyle = color
    
    this.ctx.beginPath();
    this.ctx.moveTo(points.topLeft.x, points.topLeft.y); // start
    this.ctx.lineTo(points.topRight.x, points.topRight.y);
    this.ctx.lineTo(points.bottomRight.x, points.bottomRight.y);
    this.ctx.lineTo(points.bottomLeft.x, points.bottomLeft.y);
    this.ctx.lineTo(points.topLeft.x, points.topLeft.y);
    this.ctx.closePath();
    this.ctx.fill();

    const centerX = (points.topLeft.x + points.topRight.x) /2
    const centerY = (points.bottomLeft.y + points.topLeft.y) /2

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

  distTo(point = {x: 0, y:0}){
    const p = point2p(point); // return [point.x, point.y]

    const vertices = [
      point2p(this.points.topLeft),
      point2p(this.points.topRight),
      point2p(this.points.bottomRight),
      point2p(this.points.bottomLeft)
    ]
    
    const d = distanceToPolygon(p, vertices)

    if( d < this.height/2 ){
        return -1
    } 

    if (d === Infinity){
      return -1
    } 
    
    return d; 
  }

  // distToNearestEdge(point){
  //   let minDist = 10000;
  //   for( const i in this.rects){
  //     const rect = this.rects[i]
  //     const dist = this.distToEdge(point,rect)
  //     minDist = Math.min(dist, minDist)
  //   }
  //   return minDist
  // }

  // distToEdge(point, rect){
  //   rect = {
  //     min:{x: rect.x , y: rect.y},
  //     max:{x: rect.x + rect.width, y: rect.y + rect.height}
  //   }
  //   // check if it's in the rect
  //   if( ( rect.min.x < point.x && point.x < rect.max.x ) &&
  //       ( rect.min.y < point.y && point.y < rect.max.y )  ){
  //     return -1
  //   }

  //   // get the distance to edge
  //   // https://stackoverflow.com/questions/5254838/calculating-distance-between-a-point-and-a-rectangular-box-nearest-point
  //   let dx = Math.max(rect.min.x - point.x, 0, point.x - rect.max.x);
  //   let dy = Math.max(rect.min.y - point.y, 0, point.y - rect.max.y);
  //   return Math.sqrt(dx*dx + dy*dy);
  // }
}
