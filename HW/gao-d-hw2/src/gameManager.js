let score = 0;
let combo = 1;
let scoreMultuplier = 1;

const increaseScore = () =>{
    score += 100 * scoreMultuplier;
    update();
}

const comboBroke = () =>{
    combo = 1;
}

const comboIncrease = () =>{
    combo++;
}

const update = () => {
    document.querySelector("#score-display").innerHTML = String(score);
    document.querySelector("#combo-display").innerHTML = String(combo);
    document.querySelector("#multiplier-display").innerHTML = String(scoreMultuplier);

}


export {increaseScore, update, comboBroke, comboIncrease};