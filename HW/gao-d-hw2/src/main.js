import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './visualizer.js'
import * as game from './gameManager.js'
import { readAppData } from './dataReader.js';

export let dataType;
export let paused = false;
export let autoplay = false;

let songSelectionData = {};

let titleGone = false;
let titleAlpha = 1;

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

let textInfoBox;

const drawParams = {
  showLine : true,
  showBars : true,
  showCircle : true,
  showNotes : true,
  showCircleBars : true
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	bass  : "media/Taking What's Not Yours - TV Girl/bass.mp3",
  drums : "media/Taking What's Not Yours - TV Girl/drums.mp3",
  instrumental: "media/Taking What's Not Yours - TV Girl/instrumental.mp3",
  other: "media/Taking What's Not Yours - TV Girl/other.mp3",
  fullSong: "media/Taking What's Not Yours - TV Girl/original.mp3"
});

const init = () => {
  audio.setupWebaudio(DEFAULTS.bass,DEFAULTS.drums,DEFAULTS.intrumental,DEFAULTS.other, DEFAULTS.fullSong);
	let canvasElement = document.querySelector("canvas"); 
  const handleData = (data) => {  
    songSelectionData = data;
    textInfoBox = document.querySelector("#text-info");
    textInfoBox.firstElementChild.innerHTML = songSelectionData.title;
    textInfoBox.lastElementChild.innerHTML = songSelectionData.instructions;
    document.querySelector('title').textContent = songSelectionData.title;
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

    if(!titleGone){
      ridTitle();
    }
  };

  // C - hookup volume slider and label
  let volumeSlider = document.querySelector("#volume-slider");

  //add .oninput event to slider
  volumeSlider.oninput = e => {
    //set the gain
    audio.setVolume(e.target.value);
    //update value of label to match value of slider
    document.querySelector("#volume-label").innerHTML = `Volume: ${Math.round((e.target.value/2 * 100))}`;
  };

  //set value of label to match innitial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  //D - hookup track <select>
  let trackSelect = document.querySelector("#track-select");

  document.querySelector("#default-track").selected = true;

  //add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadBeatsAndSong(songSelectionData.songs[e.target.value]);
    canvas.clearAll();
    //pause the current track if it is playing
    if(playButton.dataset.playing == "yes"){
        playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  const dataTypeSelect = document.querySelector("#type-data-select");
  dataType = dataTypeSelect.value = "frequency";
  dataTypeSelect.onchange = () =>{
    dataType = dataTypeSelect.value;
    if(!titleGone){
      ridTitle();
    }
  }

  const lineCheckBox = document.querySelector("#line-CB");
  const barsCheckBox = document.querySelector("#bars-CB");
  const circleCheckBox = document.querySelector("#circle-CB");
  const notesCheckBox = document.querySelector("#notes-CB");
  const circleBarsCheckBox = document.querySelector("#circle-bars-CB");

  const autoplayCheckBox = document.querySelector("#autoplay-CB");

  lineCheckBox.checked = drawParams.showLine;
  barsCheckBox.checked = drawParams.showBars;
  circleCheckBox.checked = drawParams.showCircle;
  notesCheckBox.checked = drawParams.showNotes;
  circleBarsCheckBox.checked = drawParams.showCircleBars;
  autoplayCheckBox.checked = autoplay;

  lineCheckBox.onchange = () =>{
    drawParams.showLine = lineCheckBox.checked;
  }
  barsCheckBox.onchange = () =>{
    drawParams.showBars = barsCheckBox.checked;
  }
  circleCheckBox.onchange = () =>{
    drawParams.showCircle = circleCheckBox.checked;
  }
  notesCheckBox.onchange = () =>{
    drawParams.showNotes = notesCheckBox.checked;
  }
  circleBarsCheckBox.onchange = () =>{
    drawParams.showCircleBars = circleBarsCheckBox.checked;
  }

  autoplayCheckBox.onchange = () =>{
    autoplay = autoplayCheckBox.checked;
  }

  let boostSlider = document.querySelector("#bass-boost-slider");

  //add .oninput event to slider
  boostSlider.oninput = e => {
    //set the gain
    audio.bassBoost(e.target.value);
    //update value of label to match value of slider
    document.querySelector("#bass-label").innerHTML = `Bass Boost Level: ${e.target.value}`;
  };
  //set value of label to match innitial value of slider
  boostSlider.dispatchEvent(new Event("input"));

  let trebleSlider = document.querySelector("#treble-boost-slider");

  //add .oninput event to slider
  trebleSlider.oninput = e => {
    //set the gain
    audio.trebleBoost(e.target.value);
    //update value of label to match value of slider
    document.querySelector("#treble-label").innerHTML = `Treble Boost Level: ${e.target.value}`;
  };
  //set value of label to match innitial value of slider
  trebleSlider.dispatchEvent(new Event("input"));

  document.addEventListener('keydown', function(e){
    if(e.key == 's' || e.key == 'd' || e.key == 'j' || e.key == 'k')
    {
      isKeysPressed[e.key].pressed = true;
      if(isKeysPressed[e.key].released){
        isKeysPressed[e.key].justPressed = true;
        isKeysPressed[e.key].released = false;
        setTimeout(() => {
          isKeysPressed[e.key].justPressed = false;
        }, 25);        
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
  setTimeout(loop, 1000/60);
  if(!paused){
    game.update();
    canvas.draw(drawParams);
  }
}

const ridTitle = () =>{
  textInfoBox.style.color = `rgba(255,255,255,${titleAlpha})`;
  titleAlpha *= .9;
  if(titleAlpha > .001){
    setTimeout(() => {
      ridTitle();
    }, 1000/60);
  }
  else{
    textInfoBox.firstElementChild.innerHTML = "";
    textInfoBox.lastElementChild.innerHTML = "";
  }
}
