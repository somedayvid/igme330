// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioDrums;
let audioVocals;
let audioBass;
let audioGuitar;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let drumElement;
let vocalElement;
let bassElement;
let guitarElement;

let drumNode;
let vocalNode;
let bassNode;
let guitarNode;

let drumAnalyser;
let vocalAnalyser;
let bassAnalyser;
let guitarAnalyser;

let drumGainNode;
let vocalGainNode;
let bassGainNode;
let guitarGainNode;

let audioList = [];

let drums = {};
let vocals = {};
let bass = {};
let guitar = {};

// 3 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 256
});

// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
let audioData = new Uint8Array(DEFAULTS.numSamples/2);

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
const setupWebaudio = (bassPath, drumsPath, guitarPath, vocalPath) =>{


    individualAudios(drumElement, audioDrums, drumNode, drumAnalyser, drumGainNode, drumsPath, drums);
    individualAudios(vocalElement, audioVocals, vocalNode, vocalAnalyser, vocalGainNode, vocalPath, vocals);
    individualAudios(bassElement, audioBass, bassNode, bassAnalyser, bassGainNode, bassPath, bass);
    individualAudios(guitarElement, audioGuitar, guitarNode, guitarAnalyser, guitarGainNode, guitarPath, guitar);
    
    audioList[0] = drums;
    audioList[1] = vocals;
    audioList[2] = bass;
    audioList[3] = guitar;

    console.log(audioList);

}

const individualAudios = (audioElement, audioCtx, audioNode, audioAnalyser, audioGainNode, audioPath, object) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // 2 - this creates an <audio> element
    audioElement = new Audio();

    // 3 - have it point at a sound file
    loadSoundFile(audioPath, audioElement);

    // 4 - create an a source node that points at the <audio> element
    audioNode = audioCtx.createMediaElementSource(audioElement);

    // 5 - create an analyser node
    // note the UK spelling of "Analyser"
    audioAnalyser = audioCtx.createAnalyser();

    // fft stands for Fast Fourier Transform
    audioAnalyser.fftSize = DEFAULTS.numSamples;

    // 7 - create a gain (volume) node
    audioGainNode = audioCtx.createGain();
    audioGainNode.gain.value = DEFAULTS.gain;

    // 8 - connect the nodes - we now have an audio graph
    audioNode.connect(audioAnalyser);
    audioAnalyser.connect(audioGainNode);
    audioGainNode.connect(audioCtx.destination);

    object.audioElement = audioElement;
    object.audioCtx = audioCtx;
    object.audioNode = audioNode;
    object.audioAnalyser = audioAnalyser;
    object.audioGainNode = audioGainNode;
    object.audioPath = audioPath;
}
// make sure that it's a Number rather than a String

const loadSoundFile = (filePath, audioElement) => audioElement.src = filePath;

const playCurrentSound = () => {
    for(let soundIndex in audioList){
        audioList[soundIndex].audioElement.play();
    }
};  

const pauseCurrentSound = () => {
    for(let soundIndex in audioList){
        audioList[soundIndex].audioElement.pause();
    }
}

const setVolume = (value) => {
    value = Number(value);
    for(let soundIndex in audioList){
        audioList[soundIndex].audioGainNode.gain.value = value;
    }
}

export {audioList,setupWebaudio,playCurrentSound,pauseCurrentSound,loadSoundFile,setVolume};