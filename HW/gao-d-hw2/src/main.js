import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './visualizer.js'

export let dataType;

let bassFile;
let drumFile;
let guitarFile;
let vocalFile;

const drawParams = {
  showGradient : true,
  showBars : true,
  showCircles : true,
  showNoise : false,
  showInvert : false,
  showEmboss : false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	bass  : "media/Bass.mp3",
  drums : "media/Drums.mp3",
  guitar: "media/Guitar.mp3",
  vocals: "media/Vocals.mp3"
});

const init = () => {
  audio.setupWebaudio(DEFAULTS.bass,DEFAULTS.drums,DEFAULTS.guitar,DEFAULTS.vocals);
  //console.log(audio);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
  //canvas.setupCanvas(canvasElement,audio.drumNode);
  loop();
}

const setupUI = canvasElement =>{
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    utils.goFullscreen(canvasElement);
  };
	
  //HERE IS A SPOT TO MAKE WORK WITH OTHER SPOTS
  //add .onclick even to button
  playButton.onclick = e => {
    //check if context is in suspended state (autoplay policy)
    if(audio.audioList[0].audioCtx.state == "suspended"){
        audio.audioList[0].audioCtx.resume();
    }
    if(e.target.dataset.playing == "no"){
        // if track is currently paused, play it
        audio.playCurrentSound();
        e.target.dataset.playing = "yes"; //our css will set the text to "Pause"
    }
    //if track IS playing, pause it
    else{
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no";// our CSS will set the text to "Play"
    }
  };

  // C - hookup volume slider and label
  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel = document.querySelector("#volumeLabel");

  //add .oninput event to slider
  volumeSlider.oninput = e => {
    //set the gain
    audio.setVolume(e.target.value);
    //update value of label to match value of slider
    volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  };

  //set value of label to match innitial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  //D - hookup track <select>
  let trackSelect = document.querySelector("#trackSelect");
  //add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    //pause the current track if it is playing
    if(playButton.dataset.playing == "yes"){
        playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  const dataTypeSelect = document.querySelector("#type-data-select");
  dataType = dataTypeSelect.value = "frequency";
  dataTypeSelect.onchange = () =>{
    dataType = dataTypeSelect.value;
  }

  const gradiantCheckBox = document.querySelector("#gradient-CB");
  const barsCheckBox = document.querySelector("#bars-CB");
  const circlesCheckBox = document.querySelector("#circles-CB");
  const noiseCheckBox = document.querySelector("#noise-CB");
  const invertCheckBox = document.querySelector("#invert-CB");
  const embossCheckBox = document.querySelector("#emboss-CB");

  gradiantCheckBox.checked = drawParams.showGradient;
  barsCheckBox.checked = drawParams.showBars;
  circlesCheckBox.checked = drawParams.showCircles;
  noiseCheckBox.checked = drawParams.showNoise;
  invertCheckBox.checked = drawParams.showInvert;
  embossCheckBox.checked = drawParams.showEmboss;

  gradiantCheckBox.onchange = () =>{
    drawParams.showGradient = gradiantCheckBox.checked;
  }
  barsCheckBox.onchange = () =>{
    drawParams.showBars = barsCheckBox.checked;
  }
  circlesCheckBox.onchange = () =>{
    drawParams.showCircles = circlesCheckBox.checked;
  }
  noiseCheckBox.onchange = () =>{
    drawParams.showNoise = noiseCheckBox.checked;
  }
  invertCheckBox.onchange = () =>{
    drawParams.showInvert = invertCheckBox.checked;
  }
  embossCheckBox.onchange = () =>{
    drawParams.showEmboss = embossCheckBox.checked;
  }
} // end setupUI
export {init};

const loop = () =>{
      setTimeout(loop, 17);
      canvas.draw(drawParams);
          // 1) create a byte array (values of 0-255) to hold the audio data
        //normally, we do this once when the program starts up, NOT every frame
        // let audioData = new Uint8Array(audio.drumNode.fftSize/2);
        
        // // 2) populate the array of audio data *by reference* (i.e. by its address)
        // audio.analyserNode.getByteFrequencyData(audioData);
        
        // // 3) log out the array and the average loudness (amplitude) of all of the frequency bins
        //     console.log(audioData);
            
        //     console.log("-----Audio Stats-----");
        //     let totalLoudness =  audioData.reduce((total,num) => total + num);
        //     let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
        //     let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
        //     let maxLoudness =  Math.max(...audioData); // ditto!
        //     // Now look at loudness in a specific bin
        //     // 22050 kHz divided by 128 bins = 172.23 kHz per bin
        //     // the 12th element in array represents loudness at 2.067 kHz
        //     let loudnessAt2K = audioData[11]; 
        //     console.log(`averageLoudness = ${averageLoudness}`);
        //     console.log(`minLoudness = ${minLoudness}`);
        //     console.log(`maxLoudness = ${maxLoudness}`);
        //     console.log(`loudnessAt2K = ${loudnessAt2K}`);
        //     console.log("---------------------");
    }

