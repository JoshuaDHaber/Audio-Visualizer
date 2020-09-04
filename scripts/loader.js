//import {audioGen} from 'audio.js';

window.onload = function () {

    let audio = audioGen();
    let util = utilGen();

    let gradStudent = gradGen(util);

    let canvas = canvasGen(audio, util, gradStudent);

    let UISetup = UIGen(canvas, audio, gradStudent, util);

    UISetup.setupUI();

    canvas.setDelta(30);
    setInterval(canvas.update, 30);
};