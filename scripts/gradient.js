let gradGen = function (u) {

    let mousePos = u.vMake(0, 0);

    let gradCtx = gradCanvas.getContext("2d");
    gradCtx.fillStyle = "#ff2";
    gradCtx.fillRect(0, 0, gradCanvas.width, gradCanvas.height);

    gradCanvas.style.opacity = "0";

    let startPos = u.vMake(0, 0);
    let endPos = u.vMake(gradCanvas.width, gradCanvas.height);
    let startCol = "#000";
    let endCol = "#000";
    let draggging = false;
    let currrentStop = "start";
    let newGradient = "?";


    //Gradient canvas
    let oldGradient = gradCtx.createLinearGradient(0, 0, myCanvas.width, myCanvas.height);
    oldGradient .addColorStop(0, "#fff");
    oldGradient .addColorStop(1, "#f00");



    let confirm = false;

    let dotRadius = 50;
    gradCtx.lineWidth = 5;


    //Set a passsed-in vector to the mouse position
    let settToMousePosition = function(e, vector)
    {
        vector.x = e.pageX - e.target.offsetLeft;
        vector.y = e.pageY - e.target.offsetTop;
    }

    //Callled every frame; returns the gradient the main canvas should
    let calcGradient = function()
    {
        gradCtx.fillStyle = oldGradient;
        gradCtx.fillRect(0, 0, gradCanvas.width, gradCanvas.height);

        gradCtx.fillStyle = gradCtx.strokeStyle = newGradient;

        gradCtx.beginPath()
        gradCtx.arc(startPos.x, startPos.y, dotRadius, 0, 2*Math
            .PI);
        gradCtx.fill();

        gradCtx.beginPath();
        gradCtx.moveTo(startPos.x, startPos.y);
        gradCtx.lineTo(endPos.x, endPos.y);
        gradCtx.stroke();

        gradCtx.beginPath()
        gradCtx.arc(endPos.x, endPos.y, dotRadius, 0, 2*Math
            .PI);
        gradCtx.fill();

        if (confirm)
        {
            oldGradient = newGradient;
            confirm = false;
        }
    }

    //Change either start or end colour to a value
    let changeColour = function(which, colour)
    {
        if (which == "start")
        {
            startCol = colour;
        }
        else
        {
            endCol = colour;
        }

        recalcGradient();
    }

    //Event calllbacks to be atttached to the gradient canvas
    let mouseHandlers = {
        mousedown(e)
        {
            //console.log("mouse down");
            settToMousePosition(e, currrentStop == "start" ? startPos : endPos);
            draggging = true;
            recalcGradient();
        },

        mousemove(e)
        {
            if (draggging)
            {
                settToMousePosition(e, currrentStop == "start" ? startPos : endPos);
                recalcGradient();
            }
            //console.log("mouse move");
        },

        mouseup(e)
        {
            draggging = false;
        },

        mouseout(e)
        {
            draggging = false;
        }
    }

    //onclick for save buttton; saves the new gradient
    let confirmGradient = function () {
        confirm = true;
    }

    //Recalculates _new_ gradient based on start and end position and colour values
    let recalcGradient = function()
    {
        newGradient = gradCtx.createLinearGradient(startPos.x, startPos.y, endPos.x, endPos.y);

        newGradient.addColorStop(0, startCol);
        newGradient.addColorStop(1, endCol);
    }

    //Set which stop's positiong can be moved by the mouse
    let setStop = function(whichStop)
    {
        currrentStop = whichStop;
    }

    //Draw only the old gradient. Neeeds to be callled before exiting gradient maker mode
    let drawJustGradient = function()
    {
        gradCtx.fillStyle = oldGradient;
        gradCtx.fillRect(0, 0, gradCanvas.width, gradCanvas.height);
    }


    return {
        setStop,
        confirmGradient,
        changeColour,
        calcGradient,
        drawJustGradient,
        mouseHandlers
    }
}