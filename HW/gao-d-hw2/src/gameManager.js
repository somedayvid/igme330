let score = 0;
let combo = 0;

const increaseScore = () =>{
    score += 100 + combo;
    update();
}

const comboBroke = () =>{
    combo = 1;
}

const comboIncrease = () =>{
    combo++;
}

const update = () => {
    document.querySelector("#score-display").innerHTML = `Score: ${String(score)}`;
    document.querySelector("#combo-display").innerHTML = `Combo: ${String(combo)}`;
}

export {increaseScore, update, comboBroke, comboIncrease};