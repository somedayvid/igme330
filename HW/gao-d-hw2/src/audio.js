let audioList = [];
let pastAudioList = [];

let drums = {};
let drums2 = {};
let vocals = {};
let vocals2 = {};
let bass = {};
let bass2 = {};
let guitar = {};
let guitar2 = {};

let firstPass = true;

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
    individualAudios(drumsPath, drums);
    individualAudios(vocalPath, vocals);
    individualAudios(bassPath, bass);
    individualAudios(guitarPath, guitar);

    individualAudios(drumsPath, drums2);
    individualAudios(vocalPath, vocals2);
    individualAudios(bassPath, bass2);
    individualAudios(guitarPath, guitar2);
    
    audioList[0] = drums;
    audioList[1] = vocals;
    audioList[2] = bass;
    audioList[3] = guitar;

    pastAudioList[0] = drums2;
    pastAudioList[1] = vocals2;
    pastAudioList[2] = bass2;
    pastAudioList[3] = guitar2;
}

const individualAudios = (audioPath, object) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = new AudioContext();

    // 2 - this creates an <audio> element
    let audioElement = new Audio();

    // 3 - have it point at a sound file
    loadSoundFile(audioPath, audioElement);

    // 4 - create an a source node that points at the <audio> element
    let audioNode = audioCtx.createMediaElementSource(audioElement);

    // 5 - create an analyser node
    // note the UK spelling of "Analyser"
    let audioAnalyser = audioCtx.createAnalyser();

    // fft stands for Fast Fourier Transform
    audioAnalyser.fftSize = DEFAULTS.numSamples;

    // 7 - create a gain (volume) node
    let audioGainNode = audioCtx.createGain();
    audioGainNode.gain.value = DEFAULTS.gain;

    const audioBiquadFilter = audioCtx.createBiquadFilter();

    const audioDistortion = audioCtx.createWaveShaper();

    // 8 - connect the nodes - we now have an audio graph
    audioNode.connect(audioAnalyser);
    audioAnalyser.connect(audioGainNode);
    audioGainNode.connect(audioBiquadFilter);
    audioBiquadFilter.connect(audioDistortion);
    audioDistortion.connect(audioCtx.destination);

    object.audioElement = audioElement;
    object.audioCtx = audioCtx;
    object.audioNode = audioNode;
    object.audioAnalyser = audioAnalyser;
    object.audioGainNode = audioGainNode;
    object.audioBiquadFilter = audioBiquadFilter;
    object.audioDistortion = audioDistortion;
    object.audioPath = audioPath;

    audioBiquadFilter.type  = "lowshelf";
    //audioBiquadFilter.frequency.value = 1000;
    //console.log(audioBiquadFilter);
}

const loadSoundFile = (filePath, audioElement) => audioElement.src = filePath;

const playCurrentSound = () => {
    for(let soundIndex in audioList){
        audioList[soundIndex].audioGainNode.gain.value = 0;
        audioList[soundIndex].audioElement.play();
        if(!firstPass){
            pastAudioList[soundIndex].audioElement.play();
        }
    }
    if(firstPass){
        setTimeout(function(){
            for(let soundIndex in pastAudioList){
                pastAudioList[soundIndex].audioElement.play();
            }
        }, 1500);
        firstPass = false;
    }
    console.log(pastAudioList);

}  

const pauseCurrentSound = () => {
    for(let soundIndex in audioList){
        audioList[soundIndex].audioElement.pause();
        pastAudioList[soundIndex].audioElement.pause();
    }
}

const setVolume = value => {
    // make sure that it's a Number rather than a String
    value = Number(value);
    for(let soundIndex in pastAudioList){
        pastAudioList[soundIndex].audioGainNode.gain.value = value;
    }
}

const bassBoost = value =>{
    pastAudioList[2].audioBiquadFilter.type = "lowshelf";
    pastAudioList[2].audioBiquadFilter.frequency.value = 1000;
    pastAudioList[2].audioBiquadFilter.gain.value = value;
}

const trebleBoost = value =>{
    pastAudioList[0].audioBiquadFilter.type = "highshelf";
    pastAudioList[0].audioBiquadFilter.frequency.value = 2000;
    pastAudioList[0].audioBiquadFilter.gain.value = value;
    pastAudioList[1].audioBiquadFilter.type = "highshelf";
    pastAudioList[1].audioBiquadFilter.frequency.value = 2000;
    pastAudioList[1].audioBiquadFilter.gain.value = value;
    pastAudioList[3].audioBiquadFilter.type = "highshelf";
    pastAudioList[3].audioBiquadFilter.frequency.value = 2000;
    pastAudioList[3].audioBiquadFilter.gain.value = value;
}

const doCurve = () =>{
    function makeDistortionCurve(amount) {
        const k = typeof amount === "number" ? amount : 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
      
        for (let i = 0; i < n_samples; i++) {
          const x = (i * 2) / n_samples - 1;
          curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
      }
      
      pastAudioList[3].audioDistortion.curve = makeDistortionCurve(100);
      pastAudioList[3].audioDistortion.oversample = "4x";
}

export {audioList,pastAudioList,setupWebaudio,playCurrentSound,pauseCurrentSound,loadSoundFile,setVolume, bassBoost,trebleBoost,doCurve};