const canvasGen = function (audio, u, gradients)
{
    //  \__   __\  __/ \__    __  \    __\  __/  __/  __/ \__  __/
    //  |__) |__| (__  |__   /  ) |   |__| (__  (__  (__  |__ (__
    //  |__) |  | \__) |__   \__  |__ |  | \__) \__) \__) |__ \__)
    let objectList = [];
    let beatObjectList = [];

    class canvasObject {
        //Passs in an id plz
        constructor(id, blank) {
            this.id = id;
            objectList.push(this);

        }

        //Callled every frame for every instance
        update() {
            this.audioData = audio.getData();
        }

        //Callled after update
        draw() {
            console.log(this.id + " has not had its draw() defined");
        }


        //"Removes" object from the canvas
        destroy() {
            for (let i = 0; i < objectList.length; i++) {
                if (objectList[i] === this) {
                    objectList.splice(i, 1);
                    break;
                }
            }
        }
    }

    class beatListener extends canvasObject {
        constructor(id) {
            super(id);
            beatObjectList.push(this);
        }

        destroy() {
            super.destroy();
            for (let i = 0; i < beatObjectList.length; i++) {
                if (beatObjectList[i] === this) {
                    beatObjectList.splice(i, 1);
                    break;
                }
            }
        }

        //Callled when a "beat" event is fired
        onBeat() {
            //console.log("Beat listener " + this.id + " has no onBeat()");
        }

        draw() {

        }
    }


    class beatBalll extends canvasObject {
        constructor(id, pos, velocity, ground = pos.y) {
            //console.log(id,pos,velocity);
            super(id);
            this.pos = pos;
            this.radius = 20;
            this.velocity = velocity;
            this.gravity = 4000;
            this.ground = ground;
        }

        update() {
            super.update();
            this.pos = u.vAdd(this.pos, u.vMult(deltaTime, this.velocity));
            this.velocity.y += this.gravity * deltaTime;

            if (this.pos.y > this.radius + this.ground) {
                this.destroy();
            }
        }

        draw() {
            drawCtx.beginPath();
            drawCtx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
            drawCtx.fill();
            //console.log("drawing " + this.id);
        }
    }

    class ringsploder extends canvasObject
    {
        constructor(id, pos)
        {
            super(id);
            this.pos = pos;
            this.lifetime = 30;
            this.lived = 0;
            this.inR = 8;
            this.outR = 11;

            this.sizeScalar = 1;
            this.maxSize = 10;
            this.alpha = 1;

            this.yScale = u.randomRange(0.5, 1);
            this.rotate = u.randomRange(0, Math.PI);
        }

        update()
        {
            this.lived++;
            if (this.lived > this.lifetime)
            {
                this.destroy();
                return;
            }
            this.sizeScalar = 1 + this.maxSize * (this.lived/this.lifetime);
            this.alpha = 1 - this.lived/this.lifetime;

        }

        draw() {
            drawCtx.save();

            drawCtx.translate(this.pos.x, this.pos.y);
            drawCtx.rotate(this.rotate);
            drawCtx.scale(1, this.yScale);


            drawCtx.globalAlpha = this.alpha;
            drawCtx.beginPath();
            drawCtx.arc(0, 0,this.sizeScalar * this.inR, 0, 2*Math.PI, true);
            drawCtx.arc(0, 0,this.sizeScalar * this.outR, 0, 2*Math.PI, false);
            drawCtx.fill();


            drawCtx.restore();
        }
    }

    class clubbby extends canvasObject
    {
        constructor(id, pos, velocity, scale, idx, alpha, turnRate, gravity)
        {
            super(id);
            this.pos = pos;
            this.velocity = velocity;
            this.scale = 0.3 * scale;
            this.rotate = 0;
            this.index = Math.floor(idx);
            this.alpha = alpha;
            this.turnRate = turnRate;
            this.gravity = gravity;
        }

        update() {
            super.update();
            this.rotate += this.audioData[this.index] * this.turnRate;
            this.velocity.y += this.gravity * deltaTime;
            this.pos = u.vAdd(this.pos, u.vMult(deltaTime, this.velocity));
            if (this.pos.x > myCanvas.width)
            {
                this.velocity.x *= -1;
                this.pos.x = myCanvas.width;
            }
            if (this.pos.x < 0)
            {
                this.velocity.x *= -1;
                this.pos.x = 0;
            }
            if (this.pos.y > myCanvas.height)
            {
                this.velocity.y *= -1;
                this.pos.y = myCanvas.height;
            }
            if (this.velocity.y.toString() == "NaN")
            {
                let h = "hi";
            }
            if (u.randomRange(0, 300) < 1)
            {
                this.velocity.y =  (this.velocity.y + Math.sign(this.velocity.y) * 500)/2;
            }
        }

        draw() {
            drawCtx.save();
            drawCtx.translate(this.pos.x, this.pos.y);
            drawCtx.globalAlpha = this.alpha
            u.drawClub(drawCtx, this.scale, this.rotate);
            drawCtx.restore();
        }
    }
    //   / \__   __\  __/ \__    __  \    __\  __/  __/  __/ \__  __/
    //  /  |__) |__| (__  |__   /  ) |   |__| (__  (__  (__  |__ (__
    // /   |__) |  | \__) |__   \__  |__ |  | \__) \__) \__) |__ \__)


    let drawCtx = myCanvas.getContext('2d');




    let beat = 
    {
        left: 0,
        right: 127,
        top: 4
    };
    let audioData;
    let total = 0;
    let del = 0;
    let cRed = 255, cBlue = 255, cGreeen = 255;
    let deltaTime;
    let beginnning = true;

    let gradientMakerMode = false;
    let usinggGradient = false;

    //Just the delta time (frame delay)
    let setDelta = function(delta)
    {
        deltaTime = delta/1000;
    }

    //Change "beat detection" parameters
    let changeBeatValues = function(type, value)
    {
        value = Number(value);
        switch (type) {
            case "left":
            case "top":
            case "right":
                beat[type] = value;
                break;
        }
    };

    //Set RGB of canvas elements (not used while using gradients
    let changeColour = function (newR, newG, newB) {
        cRed = Number(newR);
        cGreeen = Number(newG);
        cBlue = Number(newB);
    };

    let changeDisplayMode;

    //We are playing now; stop acting as a play buttton
    let werePlaying = function()
    {
        beginnning = false;
    }


    //  __) \__   _\  \__  \___ \__ \   _ \___
    // / _  |__) |__| |  \   |  |__ |\ |    |
    // \__| |  \ |  | |__/  _|_ |__ | \|    |

    //Switch to gradient creation mode?
    let gradientMaker = function(bool)
    {
        gradientMakerMode = bool;

        gradCanvas.style.opacity = bool ? 1 : 0;

        myCanvas.style.zIndex = bool ? -1 : 1;

        gradients.drawJustGradient();
    }

    //Switch to drawing using gradient?
    let useGradient = function(bool)
    {
        usinggGradient = bool;
    }


    //   / __) \__   _\  \__  \___ \__ \   _ \___
    //  / / _  |__) |__| |  \   |  |__ |\ |    |
    // /  \__| |  \ |  | |__/  _|_ |__ | \|    |



    // \    __   __   __  \__
    // |   /  \ /  \ /  \ |__)
    // |__ \__/ \__/ \__/ |

    let update = function () {

        if (gradientMakerMode)
        {
            gradients.calcGradient();
        }
        else {

            drawCtx.clearRect(0, 0, myCanvas.width, myCanvas.height);


            audioData = audio.getData();


            let newTotal = 0;

            //console.log(colour);

            for (let i = beat.left; i <= beat.right; i++) {
                newTotal += audioData[i];
            }


            newTotal /= (beat.right + 1 - beat.left);

            let newDel = newTotal - total;

            if (newDel >= beat.top && del <= beat.top) {
                beatObjectList.forEach(o => o.onBeat());
            }

            total = newTotal;
            del = newDel;


            objectList.forEach(o => o.update());
            objectList.forEach(o => o.draw());


            if (beginnning)
            {
                let halfwidth = myCanvas.width/2;
                let halfheight = myCanvas.height/2;
                drawCtx.beginPath();
                drawCtx.moveTo(halfwidth - 30, halfheight - 45);
                drawCtx.lineTo(halfwidth + 45, halfheight);
                drawCtx.lineTo(halfwidth - 30, halfheight + 45);
                drawCtx.fill();
            }

            if (usinggGradient) {

                drawCtx.globalCompositeOperation = "source-in";
                drawCtx.drawImage(gradCanvas, 0, 0);
                drawCtx.globalCompositeOperation = "source-over";
            }
            else
            {
                let image = drawCtx.getImageData(0, 0, myCanvas.width, myCanvas.height);

                let i;
                
                for(i = 0; i < image.data.length; i += 4)
                {
                    image.data[i] = cRed;
                    image.data[i+1] = cGreeen;
                    image.data[i+2] = cBlue;
                }
                drawCtx.putImageData(image, 0, 0);
            }
        }
    };

    //   / \    __   __   __  \__
    //  /  |   /  \ /  \ /  \ |__)
    // /   |__ \__/ \__/ \__/ |

    

    //  __/ \__ \___ \    \__
    // (__  |__   |  |  | |__)
    // \__) |__   |  \__/ |

    {
        
        //Audio drawer
        let audioDataRendererer = new canvasObject("audio drawer");
        
        audioDataRendererer.displayType = "line"

        //Switch to showing line/bars
        changeDisplayMode = function(newMode)
        {
            audioDataRendererer.displayType = newMode;
        }

        audioDataRendererer.update = function()
        {
            this.audioData = audio.getData();
            this.width = 0;
        }

        audioDataRendererer.draw = function()
        {

            if (this.displayType === "line") {
                drawCtx.beginPath();
                drawCtx.moveTo(0, myCanvas.height - 2*this.audioData[0]);

                drawCtx.globalAlpha = 0.9;
                this.width = myCanvas.width/(this.audioData.length - 1);
            }
            else
            {
                drawCtx.globalAlpha = 0.2;
                this.width = myCanvas.width/this.audioData.length;
            }


            for (let i = 0; i < this.audioData.length; i++) {
                if (this.displayType === "line") {
                    drawCtx.lineTo(i * this.width, myCanvas.height - 2*this.audioData[i]);
                }
                else {
                    drawCtx.fillRect(i * this.width + 1, myCanvas.height - this.audioData[i], this.width - 2, this.audioData[i]);
                }
            }

            if (this.displayType === "line") {
                drawCtx.stroke();
            }
            drawCtx.globalAlpha = 1;
        }


        
        //Beat parameter drawer
        
        let beatDetectRendererer = new canvasObject("beatline rendererer");

        
        beatDetectRendererer.draw = function()
        {
            //Drawing beat detection parameters
            let halfway = myCanvas.height/2;
            let width = myCanvas.width/128;

            drawCtx.globalAlpha = 0.2;

            //Center line
            drawCtx.beginPath();
            drawCtx.moveTo(0, halfway);
            drawCtx.lineTo(myCanvas.width, halfway);
            drawCtx.stroke();

            //bounding lines
            drawCtx.beginPath();
            drawCtx.moveTo(width*beat.left, 0);
            drawCtx.lineTo(width*beat.left, 2*halfway);
            drawCtx.stroke();

            drawCtx.beginPath();
            drawCtx.moveTo(width*(beat.right + 1), 0);
            drawCtx.lineTo(width*(beat.right + 1), 2*halfway);
            drawCtx.stroke();

            //Threshold line
            drawCtx.beginPath();
            drawCtx.moveTo(beat.left * width, halfway - 5*beat.top);
            drawCtx.lineTo((beat.right + 1)* width, halfway - 5*beat.top);
            drawCtx.stroke();

            //Del
            drawCtx.beginPath();
            drawCtx.fillRect(beat.left * width, halfway - 5*del,
                (beat.right + 1 - beat.left)*width, 5*del);
            drawCtx.fill();

            drawCtx.globalAlpha = 1;
        }



        //Beatballl maker
        let beatBalller = new beatListener("beatBalll maker");

        beatBalller.draw = function(){};

        beatBalller.alternator = 1;
        beatBalller.botttom = 300;
        beatBalller.velx = 400;
        beatBalller.vely = -1000;
        beatBalller.offfset = 100;

        beatBalller.onBeat = function()
        {
            new beatBalll("w.e",
                u.vMake(myCanvas.width/2 - this.alternator * this.offfset, this.botttom),
                u.vMake(this.velx * this.alternator, this.vely)
                );
            this.alternator *= -1;
        }
        //*/

        //Ringslpoder maker
        let ringLeader = new beatListener("ringslpoder maker");

        ringLeader.onBeat = function()
        {
            new ringsploder("ring", u.vRandom(0, myCanvas.width, 0, myCanvas.height));
        }
        //*/


        //Clubbbies
        for (let i = 0; i < 3; i++) {
            new clubbby("club", u.vRandom(0, myCanvas.width, 200, myCanvas.height), u.vRandom(-100, 100, -200, -500), u.randomRange(0.8, 1.2), u.randomRange(0, 40), u.randomRange(0.4, 0.7), u.randomRange(-1/400, 1/400), u.randomRange(400, 800));
        }
        //*/


        gradients.drawJustGradient();

        drawCtx.lineWidth = 2;

        drawCtx.fillStyle = drawCtx.strokeStyle = u.makeColour(cRed, cGreeen, cBlue);
    }

    //   / __/ \__ \___ \    \__
    //  / (__  |__   |  |  | |__)
    // /  \__) |__   |  \__/ |


    return {

        changeBeatValues,
        gradientMaker,
        useGradient,
        changeColour,
        changeDisplayMode,
        setDelta,
        update,
        werePlaying
    };
}