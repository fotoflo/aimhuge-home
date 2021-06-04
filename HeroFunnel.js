class HeroFunnel {
  constructor(ctx, startPoint = {x: 800, y:280}, scale = 5){
    this.ctx = ctx;
    this.startPoint = startPoint;
    this.topMargin = 17 * scale;
    this.scale = scale
    this.heights = .8 * scale
    this.colors = {
      YELLOW: "#FFFD0B",
      PINK: "#FB00C9",
      BLUE: "#0000FF"
    }
    this.trapezoids = [ // dimentions
      { 
        topLength: 33.0 * scale,
        bottomLength: 30.0 * scale,
        leftOffset: 0,
        height: this.heights * scale,
        color: this.colors.YELLOW
      },
      { 
        topLength: 29.0 * scale,
        bottomLength: 26.0 * scale,
        leftOffset: 10 * scale,
        height: this.heights * scale,
        color: this.colors.PINK
      },
      { 
        topLength: 25 * scale,
        bottomLength: 22 * scale,
        leftOffset: 19 * scale,
        height: this.heights * scale,
        color: this.colors.BLUE
      },
      { 
        topLength: 21 * scale,
        bottomLength: 18 * scale,
        leftOffset: 28 * scale,
        height: this.heights * scale,
        color: this.colors.PINK
      },
      { 
        topLength: 17 * scale,
        bottomLength: 14 * scale,
        leftOffset: 37 * scale,
        height: this.heights * scale,
        color: this.colors.YELLOW
      },
    ]
    this.heroZoids = [] // where to put the objects

    this.drawFunnel()

    return this
  }


  drawFunnel(){
    let topMargin = 0;

    for(let i in this.trapezoids){
      // handle each trapzoid & push into heroZoids array
      
      const t = this.trapezoids[i]

      topMargin = i * ( this.topMargin + t.height ) 
      
      const startPoint = {
        x: this.startPoint.x + t.leftOffset,
        y: this.startPoint.y + (t.height * i) + topMargin
      }
      
      this.heroZoids.push(new HeroTrapezoid(
        this.ctx, startPoint, t.topLength, t.bottomLength, t.height, t.color, this.scale, i) 
        )
      }
  }

}