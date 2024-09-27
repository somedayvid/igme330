import { getRandomColor } from "./utils.js";
import { getRandomInt } from "./utils.js";
import { drawArc } from "./canvas-utils.js";
import { drawLine } from "./canvas-utils.js";
import { drawRectangle } from "./canvas-utils.js";

let ctx;
let paused = false;
let canvas;
let createRectangles = true;
let createArcs = true;
let createLines = true;

const init = () =>{
    console.log("page loaded!");    

    canvas = document.querySelector("canvas");
    
    ctx = canvas.getContext("2d");
    
    drawRectangle(ctx,20,20,600,440,'red');

    drawRectangle(ctx,120,120,400,300,'yellow',10,'magenta');

    drawLine(ctx,20,20,620,460,5,'magenta');
    drawLine(ctx,620,20,20,460,5,'magenta');

    drawArc(ctx,320,240,50,'green',5,'purple',0,Math.PI * 2);

    drawArc(ctx,320,250,25,'gray',5,'yellow',0,Math.PI);

    drawArc(ctx,340,220,10,'black',5,'purple',0,Math.PI*2); 

    drawArc(ctx,300,220,10,'black',5,'purple',0,Math.PI*2); 

    drawLine(ctx,25,400,625,400,20,'orange');

    setupUI();
    update();
}

const update = () =>{
    if(paused) return;
    requestAnimationFrame(update);
    if(createRectangles) drawRandomRect(ctx);
    if(createArcs) drawRandomArc(ctx);
    if(createLines) drawRandomLine(ctx);
}

const drawRandomRect = ctx =>{
    drawRectangle(ctx,getRandomInt(0,640), getRandomInt(0,480), getRandomInt(10,90),getRandomInt(0,90),
        getRandomColor(),getRandomInt(2,12),getRandomColor());  
}

const drawRandomArc = ctx =>{
    drawArc(ctx,getRandomInt(0,640), getRandomInt(0,480), getRandomInt(5,75),getRandomColor(),
        getRandomInt(2,12), getRandomColor(), getRandomInt(0,Math.PI * 2),getRandomInt(0,Math.PI * 2));  
}

const drawRandomLine = ctx =>{
    drawLine(ctx, getRandomInt(0,640),getRandomInt(0,480),getRandomInt(0,640),getRandomInt(0,480),getRandomInt(1,12),getRandomColor());  
}

const canvasClicked = e =>{
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log(mouseX,mouseY);
    for(let i =0; i < 10; i++){
        let x = getRandomInt(-60,60) + mouseX;
        let y = getRandomInt(-60,60) + mouseY;
        let color = getRandomColor();
        let radius = getRandomInt(1,25);
        drawArc(ctx,x,y,radius,color,1,color);
    }
}

const setupUI = () =>{
    document.querySelector("#btn-pause").onclick = () =>{
        paused = true;
    };
    document.querySelector("#btn-play").onclick = () =>{
        if(paused == true){
            paused = false;
            update();
        }
    };
    document.querySelector("#btn-clear").onclick = () =>{
        ctx.clearRect(0,0, 640,480);
    };

    canvas.onclick = canvasClicked;

    document.querySelector("#cb-Rectangles").onclick = e =>{
        createRectangles = e.target.checked;
    }
    document.querySelector("#cb-Arcs").onclick = e =>{
        createArcs = e.target.checked;
    }
    document.querySelector("#cb-Lines").onclick = e =>{
        createLines = e.target.checked;
    }
}

init();