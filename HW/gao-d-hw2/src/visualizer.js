import * as utils from './utils.js';
import {dataType} from './main.js';
import {paused} from './main.js';
import { isKeysPressed } from './main.js';
import * as game from './gameManager.js';

let ctx,canvasWidth,canvasHeight,gradient, drumData,bassData,guitarData,vocalData;

let nodeRefList = [];

let audioData = [];

let fullSongAnalyser;
let fullSongData;

let column1 =[],column2 = [],column3 = [],column4 = [], hitQualityList = [];

let arrowsList = [ column1, column2, column3, column4];

let allCanSpawn = true;

let canvasStartX;

let notesManager = {
	drums:{
		canSpawn : true,
		upperLim : 100000,
		lowerLim : .15,
		number : 0
	},
	vocals:{
		canSpawn : true,
		upperLim : 100000,
		lowerLim : .2,
		number : 1
	},
	bass:{
		canSpawn : true,
		upperLim : .3,
		lowerLim : .05,
		number: 2
	},
	guitar:{
		canSpawn : true,
		upperLim : 10000,
		lowerLim : .15,
		number : 3
	}
}

let noteHitterOutline = [];

let timeBetweenNotes = 225;


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
	vocalData = new Uint8Array(nodeRefList[1].fftSize/2);
	bassData = new Uint8Array(nodeRefList[2].fftSize/2);
    guitarData = new Uint8Array(nodeRefList[3].fftSize/2);

	audioData[0] = drumData;
	audioData[1] = vocalData;
	audioData[2] = bassData;
	audioData[3] = guitarData;

	for(let i = 0; i < 4; i++){
		noteHitterOutline.push(new Arrow(ctx, canvasStartX + 65 + 125 * i , 700, Math.PI/2 * i, false));
	}
}

const draw = (params={}) =>{
	ctx.save();
	ctx.fillStyle = "black";
	ctx.rect(0,0, canvasWidth, canvasHeight);
	ctx.fill();
	ctx.restore();

  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
    if(dataType == "frequency"){
		nodeRefList[0].getByteFrequencyData(drumData);
		nodeRefList[1].getByteFrequencyData(vocalData);
		nodeRefList[2].getByteFrequencyData(bassData);
		nodeRefList[3].getByteFrequencyData(guitarData);

		fullSongAnalyser.getByteFrequencyData(fullSongData);
    }
    else if(dataType == "waveform"){
		nodeRefList[0].getByteTimeDomainData(drumData);
		nodeRefList[1].getByteTimeDomainData(vocalData);
		nodeRefList[2].getByteTimeDomainData(bassData);
		nodeRefList[3].getByteTimeDomainData(guitarData);

		fullSongAnalyser.getByteTimeDomainData(fullSongData);
    }
	
	// 2 - draw background
	ctx.save();
	ctx.globalAlpha = 1;
    ctx.fillStyle =  "white";
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
		
	if(params.showCircles){
		let maxRadius = canvasHeight/5;

		//draws the audio beat representation 
		for(let i = 0; i < fullSongData.length; i++){
			let percent = fullSongData[i] / 255;
			let circleRadius = percent * maxRadius;
		
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = utils.makeColor(i * 80, i * 80,i * 80,.34-percent/3.0);
			ctx.arc(800, 600,circleRadius, 0, 2 * Math.PI, false);			
			ctx.fill();
			ctx.closePath();
		}
		ctx.restore();
	}

	// Draw lines based on frequency data
	const barWidth = canvasWidth/fullSongData.length;
	let x = canvasWidth;

	ctx.save();
	ctx.lineWidth = 10;
	for (let i = fullSongData.length - 1; i > 0; i--) {
		const barHeight = fullSongData[i];
		const hue = i * 2; // Varying hue for color effect

		ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, (canvasHeight / 2) - barHeight);
		ctx.stroke();

		x -= barWidth;
	}	
	ctx.restore();

	let z = 0;
	// Draw a single line representing the frequency
    const sliceWidth = canvasWidth / fullSongData.length;
	ctx.save();
	ctx.beginPath();
    for (let i = 0; i < fullSongData.length; i++) {
        const value = fullSongData[i];
        let y = (canvasHeight / 2) - (value / 255) * canvasHeight / 2;

        if (i == 0) {
            ctx.moveTo(z, y);
        } else {
            ctx.lineTo(z, y);
        }

        z += sliceWidth;
    }

    ctx.strokeStyle = 'rgb(0, 255, 0)';
    ctx.lineWidth = 2;
    ctx.stroke();
	ctx.restore();
	
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
		for(let index in notesManager){
			if(notesManager[index].number == i && notesManager[index].canSpawn && allCanSpawn){
				if(x > notesManager[index].lowerLim && x < notesManager[index].upperLim){
					arrowsList[notesManager[index].number].push(new Arrow(ctx, canvasStartX + 65 + 125 * i , -50, Math.PI/2 * i,true, 15));
					notesManager[index].canSpawn = false;
					setTimeout(() =>{ notesManager[index].canSpawn = true}, timeBetweenNotes);
					break;
				}
			}
		}
	}

	ctx.save();
	ctx.fillStyle = "white";
	ctx.rect(30, 0, canvasWidth/3, canvasHeight);
	ctx.fill();
	ctx.restore();

	for(let index in arrowsList){
		for(let furtherIndex in arrowsList[index]){
			arrowsList[index][furtherIndex].update();
		}
		if(arrowsList[index].length > 0){ //code for deleting the notes 
			if(arrowsList[index][0].expired){
				arrowsList[index].splice(0, 1);
			}
			else if(arrowsList[index][0].missed){
				arrowsList[index].splice(0, 1);
				hitQualityList.push(new HitQualityDisplay(canvasStartX + 65 + 125 * index, 0));
			}
			else if (arrowsList[index][0].y >= 710) {
				arrowsList[index][0].noteRest();
			}

		}
	}

	if(hitQualityList.length > 0){
		for(let i = hitQualityList.length - 1; i >= 0; i--){
			hitQualityList[i].update();
			if(hitQualityList[i].expired){
				hitQualityList.splice(i,1);
			}
		}
	}
	
	//draws the arrow outline for when the player is supposed to hit
	for(let i = 0; i < noteHitterOutline.length;i++){
		noteHitterOutline[i].update();
	}

	//highlights the arrows when player presses the keys
	for(let index in isKeysPressed){
		noteHitterOutline[isKeysPressed[index].number].highlight = isKeysPressed[index].pressed;
		if(isKeysPressed[index].justPressed){
			const numberino = checkNoteHit(isKeysPressed[index].number);
			if(numberino != -1){
				hitQualityList.push(new HitQualityDisplay(canvasStartX + 65 + 125 * isKeysPressed[index].number, numberino));
			}
		}
	}
}

function Arrow(ctx, x, y, rotation, active = true, width = 5) {
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
	
	this.draw = () => {
		let color;
		if(this.highlight){
			color = "red";
		}
		else if(!this.active){
			color = "purple";
		}
		else{
			color = "black";
		}
		utils.drawArrow(ctx,this.x,this.y, rotation, color, this.width);
	};

	this.noteRest = () =>{
		if(!this.waiting){
			this.waiting = true;
			setTimeout(() => {
				this.missed = true;
			}, 150);
		}
	}

	this.makeExpired = () =>{
		this.expired = true;
	}

	this.update = () => {
		if(!paused && active && !this.waiting){
			this.y += this.speed;
		}
		this.draw();
	};
}

function HitQualityDisplay(x, hitQuality){
	this.x = x;
	this.y = 750;
	this.speed = 1;
	this.expired = false;
	this.alpha = 1;

	switch(hitQuality){
		case 3:
			this.text = "PERFECT!";
			break;
		case 2:
			this.text = "GREAT!";
			break;
		case 1: 
			this.text = "GOOD!";
			break;
		case 0:
			this.text = "MISS!";
			break;
		case -1:
			break;
	}

	this.init = () =>{
		setTimeout(() =>{
			this.expired = true;
		}, 250);
	}
	this.draw = () =>{
		ctx.save();
		ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`;
		ctx.rect(this.x, this.y, 100,100);
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.fillText(this.text,this.x + 25,this.y + 50);
		ctx.restore();
	}
	this.update = () =>{
		this.y -= this.speed;
		this.x += this.speed;
		this.draw();
		this.alpha *= .9;
	}
	this.init();
}

const checkNoteHit = (number) =>{
	for(let index in arrowsList){
		if(arrowsList[index].length > 0){
			const x = hitQualityCheck(arrowsList[index][0].y,noteHitterOutline[number].y);
			switch(x){
				case 0: 
					arrowsList[index][0].makeExpired();
				case -1:
					game.comboBroke();
					break;
				case 1:
				case 2:
				case 3:
					arrowsList[index][0].makeExpired();
					continueCombo(index);
					break;
				default:
					break;
			}
			return x;
		}
		else{ return -1; }
	}
}

const continueCombo = (index) =>{
	arrowsList[index].splice(0,1);
	game.increaseScore();
	game.comboIncrease();
}

const hitQualityCheck = (y1, y2) =>{
	const difference = Math.abs(y1 - y2);
	if(difference < 50 ){
		return 3;
	}
	else if(difference < 60){
		return 2;
	}
	else if(difference < 75){
		return 1;
	}
	else if(difference < 90){
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