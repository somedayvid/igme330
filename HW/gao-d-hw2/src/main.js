import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './visualizer.js'
import * as game from './gameManager.js'
import { readAppData } from './dataReader.js';

export let dataType;
export let paused = false;
let songSelectionData = {};

let isKeysPressed = {
  s: {
    justPressed: false,
    pressed: false,
    released: true,
    number: 0
  },
  d: {
    justPressed: false,
    pressed: false,
    released: true,
    number: 1
  },
  j: {
    justPressed: false,
    pressed: false,
    released: true,
    number: 2
  },
  k: {
    justPressed: false,
    pressed: false,
    released: true,
    number: 3
  }
};

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
	bass  : "media/Taking What's Not Yours - TV Girl/bass.mp3",
  drums : "media/Taking What's Not Yours - TV Girl/drums.mp3",
  guitar: "media/Taking What's Not Yours - TV Girl/instrumental.mp3",
  vocals: "media/Taking What's Not Yours - TV Girl/other.mp3",
  fullSong: "media/Taking What's Not Yours - TV Girl/original.mp3"
});

const init = () => {
  audio.setupWebaudio(DEFAULTS.bass,DEFAULTS.drums,DEFAULTS.guitar,DEFAULTS.vocals, DEFAULTS.fullSong);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  // Load all app & shape data once when the page loads
  // Define a callback function to handle the data
const handleData = (data) => {
  console.log('Data loaded:', data);
  
  songSelectionData = data;

  console.log('Some property:', songSelectionData.songs);
};

// Call `readAppData` and pass the callback function
  readAppData(handleData);
	setupUI(canvasElement);
  canvas.setupCanvas(canvasElement,audio.audioList, audio.fullSong);
  loop();
}

const setupUI = canvasElement =>{
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fs-button");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    utils.goFullscreen(canvasElement);
  };
	
  //HERE IS A SPOT TO MAKE WORK WITH OTHER SPOTS
  //add .onclick even to button
  const playButton = document.querySelector("#play-button");
  playButton.onclick = e => {
    //check if context is in suspended state (autoplay policy)
    if(audio.audioList[0].audioCtx.state == "suspended"){
        audio.audioList[0].audioCtx.resume();
        audio.fullSong.audioCtx.resume();
    }
    if(e.target.dataset.playing == "no"){
        // if track is currently paused, play it
        audio.playCurrentSound();
        e.target.dataset.playing = "yes"; //our css will set the text to "Pause"
        paused = false;
    }
    //if track IS playing, pause it
    else{
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no";// our CSS will set the text to "Play"
        paused = true;
    }
  };

  // C - hookup volume slider and label
  let volumeSlider = document.querySelector("#volume-slider");
  let volumeLabel = document.querySelector("#volume-label");

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
  let trackSelect = document.querySelector("#track-select");
  //add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadBeatsAndSong(e.target.value);
    //pause the current track if it is playing
    if(playButton.dataset.playing == "yes"){
        playButton.dispatchEvent(new MouseEvent("click"));
        canvas.clearAll();
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

  let boostSlider = document.querySelector("#bass-boost-slider");
  let boostLabel = document.querySelector("#bass-boost-label");

  //add .oninput event to slider
  boostSlider.oninput = e => {
    //set the gain
    audio.bassBoost(e.target.value);
    //update value of label to match value of slider
    boostLabel.innerHTML = Math.round(e.target.value);
  };
  //set value of label to match innitial value of slider
  boostSlider.dispatchEvent(new Event("input"));

  let trebleSlider = document.querySelector("#treble-boost-slider");
  let trebleLabel = document.querySelector("#treble-boost-label");

  //add .oninput event to slider
  trebleSlider.oninput = e => {
    //set the gain
    audio.trebleBoost(e.target.value);
    //update value of label to match value of slider
    trebleLabel.innerHTML = e.target.value;
  };
  //set value of label to match innitial value of slider
  trebleSlider.dispatchEvent(new Event("input"));

  document.querySelector("#wave").onclick = () =>{
    audio.doCurve();
  }


  document.addEventListener('keydown', function(e){
    if(e.key == 's' || e.key == 'd' || e.key == 'j' || e.key == 'k')
    {
      isKeysPressed[e.key].pressed = true;
      if(isKeysPressed[e.key].released){
        isKeysPressed[e.key].justPressed = true;
        isKeysPressed[e.key].released = false;
        setTimeout(() => {
          isKeysPressed[e.key].justPressed = false;
        }, 100);        
      }
    }
  })

  document.addEventListener('keyup', function(e){
    if(e.key == 's' || e.key == 'd' || e.key == 'j' || e.key == 'k'){
      isKeysPressed[e.key].pressed = false;
      isKeysPressed[e.key].released = true;
    } 
  })
} // end setupUI
export {init, isKeysPressed};

const loop = () =>{
  if(dataType == "frequency"){
      setTimeout(loop, 1000/60);
  }

  game.update();
  
  canvas.draw(drawParams);
}
