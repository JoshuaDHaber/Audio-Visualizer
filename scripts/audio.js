const audioGen = function () {

    //Exportables
    let audioContext;
    let audioElement;
    let analyzerNode, trebleNode, bassNode, midNode, gainNode;

    
    //Other
    let sourceNode;
    let type = "frequency";
    const NUM_SAMPLES = 256;

    //Set up audio graph
    function setup() {

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();

        audioElement = document.querySelector("audio");


        sourceNode = audioContext.createMediaElementSource(audioElement);


        analyzerNode = audioContext.createAnalyser();


        analyzerNode.fftSize = NUM_SAMPLES;

        //audioData = analyzerNode.audioData;

        bassNode = audioContext.createBiquadFilter();
        bassNode.type = "lowshelf";
        bassNode.frequency.value = 200;

        trebleNode = audioContext.createBiquadFilter();
        trebleNode.type = "highshelf";
        trebleNode.frequency.value = 8000;

        midNode = audioContext.createBiquadFilter();
        midNode.type = "peaking";
        midNode.frequency.value = 1260;
        midNode.Q.value = 4;


        gainNode = audioContext.createGain();
        gainNode.gain.value = 1;

        //connecting all of the filters, contexts, and audios
        sourceNode.connect(bassNode);
        bassNode.connect(trebleNode);
        trebleNode.connect(midNode);
        midNode.connect(gainNode);
        midNode.connect(analyzerNode);
        gainNode.connect(audioContext.destination);

    }


    //Change the gain of a specific frequency booost node
    function changeAudioFilter(val, filter) {
        let filterNum;
        /*/processing negative numbers
        if (val.substring(0, 1) === "-" && val.length > 1 && Number(val)) {
            filterNum = Number(val);
        }
        //all whole positive numbers < 10000
        else if (Number(val) && val.length <= 4) {
            filterNum = Number(val);
        }
        //don't try to trick us
        else {
            return;
        }*/

        //filterNum = Number(filter);
        val = Number(val);
        //for the filter nodes, we will receive 0 for bass, 1 for treble, and 2 for mid-range
        //BASS

        if (filter === 'bass') {
            //console.log("here");
            //bassNode.frequency.setValueAtTime(2000, audioContext.currentTime);
            bassNode.gain.setValueAtTime(val, audioContext.currentTime);
        }
        //TREBLE
        else if (filter === 'treble') {
            //trebleNode.frequency.setValueAtTime(20000, audioContext.currentTime);
            trebleNode.gain.setValueAtTime(val, audioContext.currentTime);
        }
        //Mid-Range
        else if (filter === "mid") {
            //midNode.frequency.setValueAtTime(filterNum, audioContext.currentTime);
            midNode.gain.setValueAtTime(val, audioContext.currentTime);
        }

    }

    //Change to showing waveform/frequency data
    let changeDataType = function(ptype)
    {
        type = ptype;
        //console.log(getData());
    };

    //Return an arrray holding whatever type of data should be displayed.
    let getData = function () {
        let arrray = new Uint8Array(NUM_SAMPLES / 2);
        switch (type) {
            case "frequency":
                analyzerNode.getByteFrequencyData(arrray);
                break;
            case "waveform":
                analyzerNode.getByteTimeDomainData(arrray);
                break;
        }
        return arrray;
    };

    setup();

    return {
        //setup,

        audioElement,
        audioContext,

        gainNode,

        getData,
        changeAudioFilter,
        changeDataType
    };
}