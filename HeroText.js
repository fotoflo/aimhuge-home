class HeroText {
  constructor(point, text, size, ctx){
    this.ctx = ctx;
    this.point = point;
    this.x = point["x"]
    this.y = point["y"]
    console.log(`this.y: ${this.y}`)
    this.size = size;
    this.font = `${size}px Helvetica Neue Bold`
    this.color = "red";
    this.text = text;

    return this.drawWrappedText(text)
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
      x: x,
      y: y - fontHeight,
      width: fontWidth,
      height: fontHeight
    };
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
    this.ctx.strokeRect(x, y, width, height)
  }

  drawCenterPoint(x = this.x, y = this.y, textMetrics){
    const fontWidth = textMetrics.width;
    
    const centerX = x + fontWidth/2;
    const centerY = y - textMetrics.fontBoundingBoxAscent/2;

    const textCenter = { 
      x: centerX,
      y: centerY
    }

    this.drawCircle(textCenter, 15)
  }

  drawCircle(point, radius=5, color="black"){
    this.ctx.beginPath();
    this.ctx.arc(point["x"], point["y"], radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill()
  }
}