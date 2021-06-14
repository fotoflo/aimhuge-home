class HeroText {
  constructor(point, text, color="red", font, size,ctx){
    this.ctx = ctx;
    this.point = point;
    this.color = color;
    this.text = text;
    this.size = size;
    this.font = `${size}px ${font}`
    console.log("font: ", this.font)
    
    this.x = point["x"]
    this.y = point["y"]
    
    this.rects = []

    this.drawWrappedText(text)

    return this
  }

  distToNearestEdge(point){
    let minDist = 10000;
    for( const i in this.rects){
      const rect = this.rects[i]
      const dist = this.distToEdge(point,rect)
      minDist = Math.min(dist, minDist)
    }
    return minDist
  }

  distToEdge(point, rect){
    rect = {
      min:{x: rect.x , y: rect.y},
      max:{x: rect.x + rect.width, y: rect.y + rect.height}
    }
    // check if it's in the rect
    if( ( rect.min.x < point.x && point.x < rect.max.x ) &&
        ( rect.min.y < point.y && point.y < rect.max.y )  ){
      return -1
    }

    // get the distance to edge
    // https://stackoverflow.com/questions/5254838/calculating-distance-between-a-point-and-a-rectangular-box-nearest-point
    let dx = Math.max(rect.min.x - point.x, 0, point.x - rect.max.x);
    let dy = Math.max(rect.min.y - point.y, 0, point.y - rect.max.y);
    return Math.sqrt(dx*dx + dy*dy);
  }

  drawWrappedText(text = this.text, separator = '\n'){
    this.prepCtx(text)

    const lines = text.split(separator)
    for( let i in lines ){
      const line = lines[i].trim()
      const textMetrics = this.ctx.measureText(line);
      const fontHeight = this.getFontHeight(textMetrics);
      console.log(`${i} - fontHeight-  ${fontHeight}`)
      const yOffset = this.y + ( i * fontHeight ) // y, y + fontHeight, y + 2*fontHeight...
      this.drawText(line, this.x , yOffset)
      this.boundText(this.x, yOffset, textMetrics)
      this.drawCenterPoint(this.x, yOffset, textMetrics)
    }
  }

  boundText(x = this.x, y = this.y, textMetrics){
    const fontHeight = this.getFontHeight(textMetrics);
    const fontWidth = textMetrics.width;
    console.log(`bound text fontHeight-  ${fontHeight}`)
    const rect = { 
      x: x - 10,
      y: y - fontHeight * 5/7 ,
      width: fontWidth + 20,
      height: fontHeight * 4/5
    };

    this.rects.push(rect)

    this.drawRect(rect.x, rect.y, rect.width, rect.height);

    return rect;
  }


  drawText(text = this.text, x = this.x, y = this.y){
    this.prepCtx(text)
    this.ctx.fillText(text, x, y)
    return this.ctx.measureText(text)
  }

  prepCtx(text = this.text){
    this.ctx.font = this.font;
    this.ctx.fillStyle = this.color;
  }

  getFontHeight(textMetrics){
    return textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent
  }
  
  drawRect(x,y,width, height){
   // this.ctx.strokeRect(x, y, width, height)
  }

  drawCenterPoint(x = this.x, y = this.y, textMetrics){
    // const fontWidth = textMetrics.width;
    
    // const centerX = x + fontWidth/2;
    // const centerY = y - textMetrics.fontBoundingBoxAscent/2;

    // const textCenter = { 
    //   x: centerX,
    //   y: centerY
    // }

    // this.drawCircle(textCenter, 15)
  }

  drawCircle(point, radius=5, color="black"){
    this.ctx.beginPath();
    this.ctx.arc(point["x"], point["y"], radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill()
  }
}