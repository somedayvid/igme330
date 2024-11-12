import * as utils from './utils.js';
import { paused } from './main.js';
import { autoplay } from './main.js';
import { addToHitQualityList } from './visualizer.js';
import { canvasStartX } from './visualizer.js';
import { continueCombo } from './visualizer.js';
import HitQualityDisplay from './HitQualityDisplay.js';
import * as game from './gameManager.js';

class Arrow {
	constructor(ctx, x, y, rotation, active = true, width = 5){
		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.width = width;
		this.speed = 13;
		this.rotation = rotation
		this.active = active;
		this.highlight = false;
		this.expired = false;
		this.missed = false;
		this.waiting = false;
	}
	
	draw = (ctx) => {
		let color;
		if(this.highlight && !autoplay){
			color = "red";
		}
		else if(!this.active){
			color = "purple";
		}
		else{
			color = "black";
		}
		utils.drawArrow(this.ctx,this.x,this.y, this.rotation, color, this.width);
	};

	noteRest = (index) =>{
		if(!this.waiting && !this.expired && !autoplay){
			this.waiting = true;
			setTimeout(() => {

				addToHitQualityList(new HitQualityDisplay(canvasStartX + 65 + 125 * index, 0));
				game.comboBroke();
				this.expired = true;
			}, 100);
		}
		else if(autoplay){
			addToHitQualityList(new HitQualityDisplay(canvasStartX + 65 + 125 * index, 3));
			continueCombo();
			this.expired = true;
		}
	}

	makeExpired = () =>{
		this.expired = true;
	}

	update = () => {
		if(!paused && this.active && !this.waiting){
			this.y += this.speed;
		}
	};
}

export default Arrow;