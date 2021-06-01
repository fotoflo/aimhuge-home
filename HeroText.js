class HeroLetter extends HeroCircle{
  constructor(letter, point, radius, ctx){
    super(point, radius, ctx)
    this.font = `${this.radius*2}px Helvetica Neue Bold`
    this.circle = new HeroCircle(this.letter)
    this.color = red;

    this.drawCircles(this.point, this.radius, color)
  }
  
  drawCircles(point, radius, color){
    for(let i = 0; i < text.length; i++){
      this.drawCricle(point, radius, color)
    }
  }
}