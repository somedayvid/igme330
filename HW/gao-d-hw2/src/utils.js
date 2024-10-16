const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
};
  
const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
};
  
const getRandomColor = () => {
    const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor,255-floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};
  
const getLinearGradient = (ctx,startX,startY,endX,endY,colorStops) => {
    let lg = ctx.createLinearGradient(startX,startY,endX,endY);
    for(let stop of colorStops){
      lg.addColorStop(stop.percent,stop.color);
    }
    return lg;
};

const scoreLineHighlight = (ctx, startX) =>{
  drawLine(ctx, ctx.canvas.width/3 + startX, 700, ctx.canvas.width/3 + startX + 100, 700, "red", 15);
}
  
const drawLine = (ctx, x1, y1,x2,y2, strokeStyle, lineWidth) =>{
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.restore();
}

  // https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
const goFullscreen = (element) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
      element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};
  
export {makeColor, getRandomColor, getLinearGradient, goFullscreen, scoreLineHighlight};