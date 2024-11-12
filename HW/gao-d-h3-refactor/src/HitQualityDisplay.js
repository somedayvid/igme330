import { canvasHeight } from './visualizer.js';

class HitQualityDisplay{
	constructor(x, hitQuality){
		this.x = x;
		this.y = canvasHeight - canvasHeight/8;
		this.speed = 1;
		this.expired = false;
		this.alpha = 1;
		this.fillStyle = "rgba(0,0,0,1)";
		this.text = "";

		switch(hitQuality){
			case 3:
				this.text = "PERFECT!";
				this.fillStyle = `rgba(97, 255, 126, ${this.alpha})`;
				break;
			case 2:
				this.text = "GREAT!";
				this.fillStyle = `rgba(138, 205, 234, ${this.alpha})`;
				break;
			case 1: 
				this.text = "GOOD!";
				this.fillStyle = `rgba(213, 185, 66, ${this.alpha})`;
				break;
			case 0:
				this.text = "MISS!";
				this.fillStyle = `rgba(211, 82, 105, ${this.alpha})`;
				break;
			case -1:
				break;
		}

		setTimeout(() =>{
			this.expired = true;
		}, 250);
	}

	draw = (ctx) =>{
		ctx.save();
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(this.x, this.y, 150, 50); 

		ctx.font = "30px Arial"
		ctx.fillStyle = "black";
		ctx.fillText(this.text,this.x + 10,this.y + 35);
		ctx.restore();
	}
	update = () =>{
		this.y += this.speed;
		this.x += this.speed;
		this.alpha *= .9;
	}
}

export default HitQualityDisplay;