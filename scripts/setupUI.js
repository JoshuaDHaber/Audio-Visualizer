const UIGen = function (canvas, audio, gradients, util) {
    //Set up alll the controls elements
    function setupUI() {

        // \   \___     __/ \__\___ \    \__
        // |  |  |     (__  |__  |  |  | |__)
        // \__/ _|_    \__) |__  |  \__/ |

        //Main canvas onclick
        myCanvas.style.cursor = "pointer";
        myCanvas.onclick = e => {
            canvas.werePlaying();
            myCanvas.onclick = 0;
            myCanvas.style.cursor = "default";
            playButton.dispatchEvent(new InputEvent("click"));
        };


        //Gradient canvas onclick
        Object.keys(gradients.mouseHandlers).forEach(
            function(key){
                gradCanvas.addEventListener(key, gradients.mouseHandlers[key]);
            }
        )


        //Track select and duration slider
        let tSelect = document.querySelector("#trackSelect");
        audio.audioElement.src = tSelect.selectedOptions[0].value;


        //helping set up the custom controls
        function setAudioDurationSlider() {
            audio.audioElement.onloadedmetadata = e => {
                //grabbing the audio duration
                let duration = Math.floor(audio.audioElement.duration);
                trackDurationSlider.max = duration;
            };
            //set the current time
            trackDurationSlider.value = Math.floor(audio.audioElement.currentTime);

            //making the track slider work
            audio.audioElement.ontimeupdate = e => {
                trackDurationSlider.value = Math.floor(audio.audioElement.currentTime);
            };
        }

        trackDurationSlider.onchange = e => {
            audio.audioElement.currentTime = e.target.value;
        };

        setAudioDurationSlider();


        function playAudio() {
            //a simple helper function to play the audio as we need it in different places for a custom file
            if (myCanvas.onclick)
            {
                myCanvas.dispatchEvent(new InputEvent("click"));
            }
            else
            {
                setAudioDurationSlider();
                audio.audioElement.play();
                playButton.textContent = 'Pause';
            }
        }


        tSelect.onchange = e => {
            if (e.target.value === "custom") {
                //open up the file element
                document.querySelector('#audioFile').click();
                //capturing the change
                audioFile.onchange = e => {
                    //convert the src into an object url
                    audio.audioElement.src = URL.createObjectURL(e.currentTarget.files[0]);
                    //play it
                    playAudio();
                    //destroy the url when it complete
                    audio.audioElement.onended = e => {
                        URL.revokeObjectURL(e.src);
                    };
                    //show the now playing label and update the text
                    customSongTitle.style.display = "block";
                    nowPlayingText.textContent = "Now Playing: " + e.currentTarget.files[0].name;
                };
            } else {
                audio.audioElement.src = e.target.value;
                playAudio();
                //hide the now playing tag
                customSongTitle.style.display = "none";
            }


        };
        //making sure we have proper audio on load, otherwise default ot the first option
        if (audio.audioElement.src == "" || audio.audioElement.src.includes("custom")) {
            audio.audioElement.src = trackSelect[0].value;
            trackSelect[0].selected = true;
        }


        tSelect.dispatchEvent(new InputEvent("input"));



        //Play and fulll-screeen butttons

        fsButton.onclick = _ => {
            util.requestFullscreen(myCanvas);
        };



        //playButton = document.querySelector("#playButton");
        playButton.onclick = e => {


            // check if context is in suspended state (autoplay policy)
            if (audio.audioContext.state === "suspended") {
                audio.audioContext.resume();
            }

            if (audio.audioElement.duration > 0 && !audio.audioElement.paused) {
                //the audio is playing.
                audio.audioElement.pause();
                playButton.textContent = 'Play';
            } else {
                //let's play some audio
                playAudio();
            }

        };




        //Volume

        volumeSlider.oninput = e => {
            audio.gainNode.gain.value = e.target.value;
            volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
        };
        volumeSlider.dispatchEvent(new InputEvent("input"));




        //Waveform vs frequency

        frequency.onchange = e => audio.changeDataType("frequency");
        waveform.onchange = e => audio.changeDataType("waveform");




        //Frequency booosters

        bassAmt.onchange = e => {
            audio.changeAudioFilter(e.target.value, 'bass');
            basssValue.innerHTML = e.target.value;
        };
        bassAmt.dispatchEvent(new InputEvent("change"));

        trebleAmt.onchange = e => {
            audio.changeAudioFilter(e.target.value, 'treble');
            trebleValue.innerHTML = e.target.value;
        };
        trebleAmt.dispatchEvent(new InputEvent("change"));

        midRangeAmt.onchange = e => {
            audio.changeAudioFilter(e.target.value, 'mid');
            midValue.innerHTML = e.target.value;
        };
        midRangeAmt.dispatchEvent(new InputEvent("change"));
        //initially we want them all to be 0
        midRangeAmt.value = "0";
        trebleAmt.value = "0";
        bassAmt.value = "0";




        //Colours

        let globalColour;
        let textImmunityBool;

        let textChangers = document.querySelectorAll(".text");
        let borderChangers = [...document.querySelectorAll(".controlBox"),
            ...document.querySelectorAll("button")];
        let butttons = document.querySelectorAll("button");
        let bgChangers = document.querySelectorAll(".slider");


        //Just reset canvas and DOM element colour based on the threee sliders
        function resetColour() {
            //check for text Immunity
            globalColour = util.makeColour(redSlider.value, greenSlider.value, blueSlider.value);

            canvas.changeColour(redSlider.value, greenSlider.value, blueSlider.value);
            immmune.style.color = "#fff";

            let actualColour = textImmunityBool ? "#fff" : globalColour;

            textChangers.forEach(e => {e.style.color = actualColour});
            borderChangers.forEach(e => {e.style.borderColor = actualColour});
            bgChangers.forEach(e => {e.style.backgroundColor = actualColour});



            //Thank You Stack Overflow for allowing us to have a dynamically color changing slider

            let sliderStyle = document.querySelector('#sliderThumbChange');
            sliderStyle.innerHTML = ".slider::-webkit-slider-thumb {background:"+globalColour+"} " +
                ".slider::-moz-range-thumb {background:"+actualColour+"} ";


            actualColour = util.changeColour(actualColour, 'a', 0.5);
            butttons.forEach(e => e.style.borderBottomColor = e.style.borderRightColor = actualColour);
        }

        redSlider.oninput = e => {
            resetColour();
            redValue.innerHTML = e.target.value;
        };

        greenSlider.oninput = e => {
            resetColour();
            greenValue.innerHTML = e.target.value;
        };

        blueSlider.oninput = e => {
            resetColour();
            blueValue.innerHTML = e.target.value;
        };
        redSlider.dispatchEvent(new InputEvent("input"));
        greenSlider.dispatchEvent(new InputEvent("input"));
        blueSlider.dispatchEvent(new InputEvent("input"));


        //textImmunity
        textImmunity.onchange = e => {
            textImmunityBool = e.target.checked;
            resetColour();
        };
        textImmunity.dispatchEvent(new InputEvent("input"));




        //Gradient

        gradientCB.onchange = e => {
            canvas.useGradient(e.target.checked);
        }

        gradientButtton.onclick = e => {
            canvas.gradientMaker(true);

            gradienttToools.style.display = "block";
            canvasEfffects.style.display = "none";
        }






        // "Beat detection" controls

        pSlider.oninput = e => {
            canvas.changeBeatValues("top", e.target.value);
            pLabel.innerHTML = e.target.value;

        };
        pSlider.dispatchEvent(new InputEvent("input"));



        aSlider.oninput = e => {
            canvas.changeBeatValues("left", aLabel.innerHTML = e.target.value);

            bSlider.min = Number(e.target.value) + 1;
        };
        aSlider.dispatchEvent(new InputEvent("input"));



        bSlider.oninput = e => {
            canvas.changeBeatValues("right", bLabel.innerHTML = e.target.value);

            aSlider.max = Number(e.target.value) - 1;
        };
        bSlider.dispatchEvent(new InputEvent("input"));



        //Display mode
        barButtton.onchange = lineButtton.onchange = e => canvas.changeDisplayMode(e.target.value);

        barButtton.dispatchEvent(new InputEvent("input"));
        lineButtton.dispatchEvent(new InputEvent("input"));





        //Gradient controls

        //Start things
        startColourStop.onchange = e =>
        {
            gradients.setStop("start");
        }
        let starttTextChanger = document.querySelector(".startCol");
        let startBgChangers = document.querySelectorAll(".startCol .slider");


        //Same as reset colour, but for gradient start
        let setStartColour = function()
        {
            let startColour = util.makeColour(startRedSlider.value, startGreeenSlider.value, startBlueSlider.value);

            gradients.changeColour("start", startColour);

            startColour = textImmunityBool ? "#fff" : startColour;

            starttTextChanger.style.color = startColour;
            startBgChangers.forEach(e => {e.style.backgroundColor = startColour});

            let sliderStyle = document.querySelector('#starttThumbChange');
            sliderStyle.innerHTML = ".startCol .slider::-webkit-slider-thumb {background:"+globalColour+"} " +
                ".startCol .slider::-moz-range-thumb {background:"+startColour+"} ";


        }

        startRedSlider.oninput = e => {
            startRed.innerHTML = e.target.value;
            setStartColour();
        };

        startGreeenSlider.oninput = e => {
            startGreeen.innerHTML = e.target.value;
            setStartColour();
        };

        startBlueSlider.oninput = e => {
            startBlue.innerHTML = e.target.value;
            setStartColour();
         };
        startRedSlider.dispatchEvent(new InputEvent("input"));
        startGreeenSlider.dispatchEvent(new InputEvent("input"));
        startBlueSlider.dispatchEvent(new InputEvent("input"));



        //End things
        endColourStop.onchange = e =>
        {
            gradients.setStop("end");
        }

        let endTextChanger = document.querySelector(".endCol");
        let endBgChangers = document.querySelectorAll(".endCol .slider");


        //Same as reset colour, but for gradient end
        let setEndColour = function()
        {
            let endColour = util.makeColour(endRedSlider.value, endGreeenSlider.value, endBlueSlider.value);

            gradients.changeColour("end", endColour);

            endColour = textImmunityBool ? "#fff" : endColour;

            endTextChanger.style.color = endColour;
            endBgChangers.forEach(e => {e.style.backgroundColor = endColour});

            let sliderStyle = document.querySelector('#endThumbChange');
            sliderStyle.innerHTML = ".endCol .slider::-webkit-slider-thumb {background:"+globalColour+"} " +
                ".endCol .slider::-moz-range-thumb {background:"+endColour+"} ";


        }

        endRedSlider.oninput = e => {
            endRed.innerHTML = e.target.value;
            setEndColour();
        };

        endGreeenSlider.oninput = e => {
            endGreeen.innerHTML = e.target.value;
            setEndColour();
        };

        endBlueSlider.oninput = e => {
            endBlue.innerHTML = e.target.value;
            setEndColour();
        };
        endRedSlider.dispatchEvent(new InputEvent("input"));
        endGreeenSlider.dispatchEvent(new InputEvent("input"));
        endBlueSlider.dispatchEvent(new InputEvent("input"));


        saveButtton.onclick = e => gradients.confirmGradient(e);

        backButtton.onclick = e => {
            canvas.gradientMaker(false);
            gradienttToools.style.display = "none";
            canvasEfffects.style.display = "block";
        }

        //   /\   \___     __/ \__\___ \    \__
        //  / |  |  |     (__  |__  |  |  | |__)
        // /  \__/ _|_    \__) |__  |  \__/ |
    }

    return {
        setupUI
    };
}