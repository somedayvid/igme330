import { getRand } from "./utils.js";

let words1 = [];
let words2 = [];
let words3 = [];

const generateBabble = (num) => {
    let text = "";
    for(let i = 0; i < num; i++){
        text += `${getRand(words1)} ${getRand(words2)} ${getRand(words3)}<br>`;
    }
    document.querySelector("#output").innerHTML = text;
}

const init = () => {
    const oneBabbleBtn = document.querySelector("#btn-1-technobabble");
    oneBabbleBtn.onclick = () => generateBabble(1);
    const fiveBabbleBtn = document.querySelector("#btn-5-technobabble");
    fiveBabbleBtn.onclick = () => generateBabble(5);
    generateBabble(1);
}

const babbleLoaded = (e) => {
    const json = JSON.parse(e.target.responseText);
    words1 = json.words1;
    words2 = json.words2;
    words3 = json.words3;
    init();
}

const loadBabble = () => {
    const url = "data/babble-data.json";
    const xhr = new XMLHttpRequest();

    xhr.onload = (e) => {
        babbleLoaded(e);
    }

    xhr.open("GET", url);
    xhr.send();
}

window.onload = loadBabble;
