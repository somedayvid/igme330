import * as utils from './utils.js';
import {dataType} from './main.js';
import {paused} from './main.js';
import { isKeysPressed } from './main.js';

let ctx,canvasWidth,canvasHeight,gradient, drumData,bassData,guitarData,vocalData;

let drumData2, bassData2, guitarData2, vocalData2;

let nodeRefList = [];
let pastNodeRefList = [];

let audioData = [];
let pastAudioData = [];

let circlesList = [];

let drumCanSpawn = true;
let vocalCanSpawn = true;
let bassCanSpawn = true;
let guitarCanSpawn = true;

let timeBetweenNotes = 225;

const setupCanvas = (canvasElement,audioList, pastAudioList) =>{
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasElement.width = window.innerWidth;
	canvasElement.height = window.innerHeight + 10;
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	//gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#61ff69"},{percent:.5,color:"#ff6961"},{percent:1,color:"#6961ff"}]);
	// keep a reference to the analyser node

	for(let nodeIndex in audioList){
		nodeRefList[nodeIndex] = audioList[nodeIndex].audioAnalyser;
	}
	for(let nodeIndex in pastAudioList){
		pastNodeRefList[nodeIndex] = pastAudioList[nodeIndex].audioAnalyser;
	}

	// this is the array where the analyser data will be stored
	drumData = new Uint8Array(nodeRefList[0].fftSize/2);
	vocalData = new Uint8Array(nodeRefList[1].fftSize/2);
	bassData = new Uint8Array(nodeRefList[2].fftSize/2);
    guitarData = new Uint8Array(nodeRefList[3].fftSize/2);

	drumData2 = new Uint8Array(pastNodeRefList[0].fftSize/2);
	vocalData2 = new Uint8Array(pastNodeRefList[1].fftSize/2);
	bassData2 = new Uint8Array(pastNodeRefList[2].fftSize/2);
    guitarData2 = new Uint8Array(pastNodeRefList[3].fftSize/2);


	audioData[0] = drumData;
	audioData[1] = vocalData;
	audioData[2] = bassData;
	audioData[3] = guitarData;

	pastAudioData[0] = drumData2;
	pastAudioData[1] = vocalData;
	pastAudioData[2] = bassData;
	pastAudioData[3] = guitarData;
}

const draw = (params={}) =>{
	ctx.save();
	ctx.fillStyle = "red";
	ctx.rect(canvasWidth/3, 0, canvasWidth/3, canvasHeight);
	ctx.fill();
	ctx.restore();

  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
    if(dataType == "frequency"){
		nodeRefList[0].getByteFrequencyData(drumData);
		nodeRefList[1].getByteFrequencyData(vocalData);
		nodeRefList[2].getByteFrequencyData(bassData);
		nodeRefList[3].getByteFrequencyData(guitarData);

		pastNodeRefList[0].getByteFrequencyData(drumData2);
		pastNodeRefList[1].getByteFrequencyData(vocalData2);
		pastNodeRefList[2].getByteFrequencyData(bassData2);
		pastNodeRefList[3].getByteFrequencyData(guitarData2);
    }
    else if(dataType == "waveform"){
		nodeRefList[0].getByteTimeDomainData(drumData);
		nodeRefList[1].getByteTimeDomainData(vocalData);
		nodeRefList[2].getByteTimeDomainData(bassData);
		nodeRefList[3].getByteTimeDomainData(guitarData);

		pastNodeRefList[0].getByteTimeDomainData(drumData2);
		pastNodeRefList[1].getByteTimeDomainData(vocalData2);
		pastNodeRefList[2].getByteTimeDomainData(bassData2);
		pastNodeRefList[3].getByteTimeDomainData(guitarData2);
    }
	
	// 2 - draw background
	ctx.save();
	ctx.globalAlpha = 1;
    ctx.fillStyle =  "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
		
	// 3 - draw gradient
	// if(params.showGradient){
    //     ctx.save();
    //     ctx.fillStyle = gradient;
    //     ctx.globalAlpha = .8;
    //     ctx.fillRect(0,0,canvasWidth,canvasHeight);
    //     ctx.restore();
    // }
	// // 5 - draw circles
	if(params.showCircles){
		let maxRadius = canvasHeight/5;

		//draws the audio beat representation 
		for(let i = 0; i < pastAudioData.length; i++){
			for(let j = 0; j < pastAudioData[i].length; j++){
				let percent = pastAudioData[i][j] / 255;
				
				let circleRadius = percent * maxRadius;
				ctx.save();
				ctx.beginPath();
				ctx.fillStyle = utils.makeColor(i * 80, i * 80,i * 80,.34-percent/3.0);
				if(i > 1){
					ctx.arc(250 + (i % 2) * 1000, 600,circleRadius, 0, 2 * Math.PI, false);
				}
				else{
					ctx.arc(250 + (i % 2) * 1000, 300,circleRadius, 0, 2 * Math.PI, false);
				}
				ctx.fill();
				ctx.closePath();
				ctx.restore();
			}
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
			switch(i){
				case 0:
					if(drumCanSpawn){
						if(x > .3){
							pushNewCircle(i);
						}
						drumCanSpawn = false;
						setTimeout(function(){ drumCanSpawn = true}, timeBetweenNotes);
					}
					break;
				case 1:
					if(vocalCanSpawn){
						if(x > .2){
							pushNewCircle(i);
						}
						vocalCanSpawn = false;
						setTimeout(function(){ vocalCanSpawn = true}, timeBetweenNotes);
					}
					break;
				case 2:
					if(bassCanSpawn){
						if(x < .3 && x > .05){
							pushNewCircle(i);
						}
						bassCanSpawn = false;
						setTimeout(function(){ bassCanSpawn = true}, timeBetweenNotes);
					}
					break;
				case 3:
					if(guitarCanSpawn){
						if(x > .15){
							pushNewCircle(i);
						}
						guitarCanSpawn = false;
						setTimeout(function(){ guitarCanSpawn = true}, timeBetweenNotes);
					}
					break;
			}
		}
    }

	for(let index in circlesList){
		circlesList[index].update();
		if (circlesList[index].x + circlesList[index].radius < 0) {
			circlesList.splice(index, 1);
		  }
	}

	ctx.save();
	ctx.beginPath();
	ctx.moveTo(canvasWidth/3,700);
	ctx.lineTo(canvasWidth/3 + canvasWidth/3,700);
	ctx.strokeStyle = "yellow";
	ctx.lineWidth = 15;
	ctx.stroke();
	ctx.restore();

	circlePress();

}

function Circle(x, y, radius, speed) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.speed = speed;
	
	this.draw = function() {
	  ctx.beginPath();
	  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
	  ctx.fillStyle = 'blue';
	  ctx.fill();
	  ctx.closePath();
	};
  
	this.update = function() {
		if(!paused){
			this.y += this.speed;
		}
		this.draw();
	};
}

const pushNewCircle = (i) =>{
	circlesList.push(new Circle(canvasWidth/3 + 100 + 100 * i , -50, 50, 15));
}

const circlePress = () =>{
	if(isKeysPressed.s){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(canvasWidth/3 + 50,700);
		ctx.lineTo(canvasWidth/3 + 150,700);
		ctx.strokeStyle = "red";
		ctx.lineWidth = 15;
		ctx.stroke();
		ctx.restore();
	}
	if(isKeysPressed.d){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(canvasWidth/3 + 150,700);
		ctx.lineTo(canvasWidth/3 + 250,700);
		ctx.strokeStyle = "red";
		ctx.lineWidth = 15;
		ctx.stroke();
		ctx.restore();
	}
	if(isKeysPressed.j){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(canvasWidth/3 + 250,700);
		ctx.lineTo(canvasWidth/3 + 350,700);
		ctx.strokeStyle = "red";
		ctx.lineWidth = 15;
		ctx.stroke();
		ctx.restore();
	}
	if(isKeysPressed.k){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(canvasWidth/3 + 350,700);
		ctx.lineTo(canvasWidth/3 + 450,700);
		ctx.strokeStyle = "red";
		ctx.lineWidth = 15;
		ctx.stroke();
		ctx.restore();
	}
}

export {setupCanvas,draw};