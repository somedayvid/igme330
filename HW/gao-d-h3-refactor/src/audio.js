let audioList = [];

let drums = {};
let other = {};
let bass = {};
let instrumental = {};

let fullSong = {};

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
const setupWebaudio = (bassPath, drumsPath, instrumentalPath, otherPath, fullSongPath) =>{
    individualAudios(drumsPath, drums);
    individualAudios(otherPath, other);
    individualAudios(bassPath, bass);
    individualAudios(instrumentalPath, instrumental);

    individualAudios(fullSongPath, fullSong);
    
    audioList[0] = drums;
    audioList[1] = other;
    audioList[2] = bass;
    audioList[3] = instrumental;
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
}

const loadSoundFile = (filePath, audioElement) => audioElement.src = filePath;

const loadBeatsAndSong = (filepath) =>{
    loadSoundFile(`media/${filepath}/drums.mp3`,audioList[0].audioElement)
    loadSoundFile(`media/${filepath}/other.mp3`,audioList[1].audioElement)
    loadSoundFile(`media/${filepath}/bass.mp3`,audioList[2].audioElement)
    loadSoundFile(`media/${filepath}/instrumental.mp3`,audioList[3].audioElement)

    loadSoundFile(`media/${filepath}/original.mp3`,fullSong.audioElement);
    firstPass = true;
}

const playCurrentSound = () => {
    for(let soundIndex in audioList){
        audioList[soundIndex].audioGainNode.gain.value = 0;
        audioList[soundIndex].audioElement.play();
        if(!firstPass){
            fullSong.audioElement.play();
        }
    }
    if(firstPass){
        setTimeout(() =>{
                fullSong.audioElement.play();
        }, 1500);
        firstPass = false;
    }
}  

const pauseCurrentSound = () => {
    for(let soundIndex in audioList){
        audioList[soundIndex].audioElement.pause();
    }
    fullSong.audioElement.pause();
}

const setVolume = value => {
    // make sure that it's a Number rather than a String
    value = Number(value);
    fullSong.audioGainNode.gain.value = value;
}

const bassBoost = value =>{
    for(let index in audioList){
        audioList[index].audioBiquadFilter.type = "lowshelf";
        audioList[index].audioBiquadFilter.frequency.value = 1000;
        audioList[index].audioBiquadFilter.gain.value = value;
    }

    fullSong.audioBiquadFilter.type = "lowshelf";
    fullSong.audioBiquadFilter.frequency.value = 2000;
    fullSong.audioBiquadFilter.gain.value = value;

}

const trebleBoost = value =>{
    for(let index in audioList){
        audioList[index].audioBiquadFilter.type = "highshelf";
        audioList[index].audioBiquadFilter.frequency.value = 2000;
        audioList[index].audioBiquadFilter.gain.value = value;
    }

    fullSong.audioBiquadFilter.type = "highshelf";
    fullSong.audioBiquadFilter.frequency.value = 2000;
    fullSong.audioBiquadFilter.gain.value = value;
}

export {audioList,fullSong,setupWebaudio,playCurrentSound,pauseCurrentSound,loadSoundFile,setVolume, bassBoost,trebleBoost, loadBeatsAndSong};