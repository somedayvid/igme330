import * as utils from './utils.js';
import {dataType} from './main.js';
import {paused} from './main.js';
import { autoplay } from './main.js';
import { isKeysPressed } from './main.js';
import * as game from './gameManager.js';

let ctx,canvasWidth,canvasHeight, drumData,bassData,instrumentalData,otherData;

let nodeRefList = [];

let audioData = [];

let fullSongAnalyser;
let fullSongData;

let column1 =[],column2 = [],column3 = [],column4 = [], hitQualityList = [];

let arrowsList = [ column1, column2, column3, column4];

let allCanSpawn = true;

let canvasStartX;

let circleCenterX;
let circleCenterY;

let byteFreqNotesLim = [.2,.2,.05,.18];

let notesManager = {
	drums:{
		canSpawn : true,
		number : 0
	},
	other:{
		canSpawn : true,
		number : 1
	},
	bass:{
		canSpawn : true,
		number: 2
	},
	instrumental:{
		canSpawn : true,
		number : 3
	}
}

let noteHitterOutline = [];

let timeBetweenNotes = 225;

let rotation = 0;

const setupCanvas = (canvasElement,audioList, fullSong) =>{
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasElement.width = window.innerWidth;
	canvasElement.height = window.innerHeight + 10;
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;

	canvasStartX = 30;

	// keep a reference to the analyser node
	fullSongAnalyser = fullSong.audioAnalyser;
	// this is the array where the analyser data will be stored
	fullSongData = new Uint8Array(fullSongAnalyser.fftSize/2);

	for(let nodeIndex in audioList){
		nodeRefList[nodeIndex] = audioList[nodeIndex].audioAnalyser;
	}

	// this is the array where the analyser data will be stored
	drumData = new Uint8Array(nodeRefList[0].fftSize/2);
	otherData = new Uint8Array(nodeRefList[1].fftSize/2);
	bassData = new Uint8Array(nodeRefList[2].fftSize/2);
    instrumentalData = new Uint8Array(nodeRefList[3].fftSize/2);

	audioData[0] = drumData;
	audioData[1] = otherData;
	audioData[2] = bassData;
	audioData[3] = instrumentalData;

	for(let i = 0; i < 4; i++){
		noteHitterOutline.push(new Arrow(ctx, canvasStartX + 65 + 125 * i , 700, Math.PI/2 * i, false));
	}
	circleCenterX = canvasWidth / 2;
	circleCenterY = canvasHeight / 2 + 200;
}

const draw = (params={}) =>{
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
    if(dataType == "frequency"){
		nodeRefList[0].getByteFrequencyData(drumData);
		nodeRefList[1].getByteFrequencyData(otherData);
		nodeRefList[2].getByteFrequencyData(bassData);
		nodeRefList[3].getByteFrequencyData(instrumentalData);

		fullSongAnalyser.getByteFrequencyData(fullSongData);

		for(let index in notesManager){
			notesManager[index].lowerLim = byteFreqNotesLim[notesManager[index].number];
		}
    }
    else if(dataType == "waveform"){
		nodeRefList[0].getByteTimeDomainData(drumData);
		nodeRefList[1].getByteTimeDomainData(otherData);
		nodeRefList[2].getByteTimeDomainData(bassData);
		nodeRefList[3].getByteTimeDomainData(instrumentalData);

		fullSongAnalyser.getByteTimeDomainData(fullSongData);

		for(let index in notesManager){
			notesManager[index].lowerLim = 0.5019607843137255;
		}
    }

	ctx.save();
	ctx.fillStyle = "black";
	ctx.rect(0,0, canvasWidth, canvasHeight);
	ctx.fill();
	ctx.restore();

	// Draw lines based on frequency data
	if(params.showBars){
		const barWidth = (canvasWidth - canvasStartX)/fullSongData.length;
		let x = canvasWidth;

		ctx.save();
		ctx.lineWidth = 10;
		for (let i = 0; i < fullSongData.length; i++) {
			const barHeight = fullSongData[i];
			const hue = i * 2; 

			ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, (canvasHeight / 2) - barHeight);
			ctx.stroke();	

			x -= barWidth;
		}	
		ctx.restore();
	}

	//draws a white background for the notes to move on
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.rect(canvasStartX, 0, canvasWidth/3, canvasHeight);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
		
	if(params.showCircleBars){
		const pulseRadius = 120;

		// Rotate the bars
		rotation += 0.01;
		ctx.save();
		ctx.translate(circleCenterX, circleCenterY);
		ctx.rotate(rotation);
		
		// Draw frequency bars
		for (let i = 0; i < fullSongData.length; i++) {
			const angle = (i / fullSongData.length) * Math.PI * 2;
			const barHeight = fullSongData[i] / 2;
			const hue = i * 2; 
			const barWidth = 4;
			
			ctx.save();
			ctx.rotate(angle);
			ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
			ctx.fillRect(pulseRadius, -barWidth / 2, barHeight, barWidth);
			ctx.restore();
		}
		ctx.restore();
	}

	//draws the circular beat thing 
	if(params.showCircle){
		let maxRadius = canvasHeight/4;
	
		ctx.save();
		for(let i = 0; i < fullSongData.length; i++){
			let percent = fullSongData[i] / 255;
			let circleRadius = percent * maxRadius;
		
			ctx.beginPath();
			ctx.fillStyle = utils.rainbow(rotation, .34-percent/3.0);
			ctx.arc(circleCenterX, circleCenterY,circleRadius, 0, 2 * Math.PI, false);			
			ctx.fill();
			ctx.closePath();	
		}
		ctx.restore();
	}

	//draws the line that goes crazy that is next to the bars
	if(params.showLine){
		let x = canvasStartX + canvasWidth/3;
		// Draw a single line representing the frequency
		const sliceWidth = canvasWidth / fullSongData.length;
		ctx.save();
		ctx.beginPath();
		for (let i = 0; i < fullSongData.length; i++) {
			const value = fullSongData[i];
			let y = (canvasHeight / 2) - (value / 255) * canvasHeight / 2;

			if (i == 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		ctx.strokeStyle = utils.rainbow(rotation);
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.restore();
	}
	
	//draws the notes that move
	for(let i = 0; i < audioData.length; i++){
		let percentList = [];
		for(let j = 0; j < audioData[i].length; j++){
			let percent = audioData[i][j] / 255;
			percentList.push(percent);
		}

		let x = 0;
		for(let index in percentList){
			x += percentList[index];
		}
		x/=percentList.length;
		if(!paused){
			for(let index in notesManager){
				if(notesManager[index].number == i && notesManager[index].canSpawn && allCanSpawn){
					if(x > notesManager[index].lowerLim){
						arrowsList[notesManager[index].number].push(new Arrow(ctx, canvasStartX + 65 + 125 * i , -50, Math.PI/2 * i,true, 15));
						notesManager[index].canSpawn = false;
						setTimeout(() =>{ notesManager[index].canSpawn = true}, timeBetweenNotes);
						break;
					}
				}
			}
		}
	}

	//draws the notes and moves them along
	for(let index in arrowsList){
		for(let furtherIndex in arrowsList[index]){
			arrowsList[index][furtherIndex].update();
			if(params.showNotes){
				arrowsList[index][furtherIndex].draw();
			}
		}
	}

	//deletes the note from the noteslist 
	for(let index in arrowsList){
		if(arrowsList[index].length > 0 && !paused){ 
			if(arrowsList[index][0].expired){ //means the note has been hit
				arrowsList[index].splice(0, 1);
			}
			else if (arrowsList[index][0].y >= 705) {
				//marks the note to be deleted if not hit within next couple milliseconds
				arrowsList[index][0].noteRest(index);
			}

		}
	}

	//updates every hit quality marker to move and draw, and removes older markers from the list
	if(hitQualityList.length > 0 && !paused){
		for(let i = hitQualityList.length - 1; i >= 0; i--){
			hitQualityList[i].update();
			if(params.showNotes){
				hitQualityList[i].draw();
			}
			if(hitQualityList[i].expired){
				hitQualityList.splice(i,1);
			}
		}
	}
	
	//draws the arrow outline for when the player is supposed to hit
	for(let i = 0; i < noteHitterOutline.length;i++){
		noteHitterOutline[i].draw();
	}

	//highlights the arrows when player presses the keys
	for(let index in isKeysPressed){
		noteHitterOutline[isKeysPressed[index].number].highlight = isKeysPressed[index].pressed;
		if(isKeysPressed[index].justPressed && !autoplay){
			//playHitSound();
			const hitQualityNumber = checkNoteHit(isKeysPressed[index].number);
			if(hitQualityNumber != -1){
				hitQualityList.push(new HitQualityDisplay(canvasStartX + 65 + 125 * isKeysPressed[index].number, hitQualityNumber));
			}
		}
	}
}

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
	
	draw = () => {
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
				hitQualityList.push(new HitQualityDisplay(canvasStartX + 65 + 125 * index, 0));
				game.comboBroke();
				this.expired = true;
			}, 100);
		}
		else if(autoplay){
			hitQualityList.push(new HitQualityDisplay(canvasStartX + 65 + 125 * index, 3));
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

class HitQualityDisplay{
	constructor(x, hitQuality){
		this.x = x;
		this.y = 750;
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

	draw = () =>{
		ctx.save();
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(this.x, this.y, 150, 50); 

		ctx.font = "30px Arial"
		ctx.fillStyle = "black";
		ctx.fillText(this.text,this.x + 10,this.y + 35);
		ctx.restore();
	}
	update = () =>{
		this.y -= this.speed;
		this.x += this.speed;
		this.alpha *= .9;
	}
}

const checkNoteHit = (number) =>{
	if(arrowsList[number].length > 0){
		const x = hitQualityCheck(arrowsList[number][0].y);
		switch(x){
			case 0: 
				arrowsList[number][0].makeExpired();
			case -1:
				game.comboBroke();
				break;
			case 1:
			case 2:
			case 3:
				arrowsList[number][0].makeExpired();
				continueCombo();
				break;
			default:
				break;
		}
		return x;
	}
	else{ return -1; }
}

const continueCombo = () =>{
	game.increaseScore();
	game.comboIncrease();
}

const hitQualityCheck = (y1) =>{
	const difference = Math.abs(y1 - 700);
	if(difference < 30 ){
		return 3;
	}
	else if(difference < 40){
		return 2;
	}
	else if(difference < 50){
		return 1;
	}
	else if(difference < 65){
		return 0;
	}
	else {return -1;}
}

const clearAll = () =>{
	for(let index in arrowsList){
		arrowsList[index] = [];
	}
}


export {setupCanvas,draw, clearAll};