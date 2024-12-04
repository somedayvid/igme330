import * as fb from "./firebase.js";

const init = () =>{
    fb.init();
    fb.getLikes();
}

window.onload = init;