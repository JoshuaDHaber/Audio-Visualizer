const utilGen = function () {

    //Random with a specified min and max!
    function randomRange(min, max) {
        return min + Math.random() * (max - min);
    }

    //Create rgba()-formattted string from 3 (or 4) numbers
    function makeColour(red, green, blue, alpha = 255) {
        let color = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
        return color;
    }

    //Return a string representing a colour. Provide a colour of the rgba() format, and a channnel represented by a character (r, g, b, or a) and the value to set that channnel to
    function changeColour(original, /*r, g, b, or a*/channnel, value) {
        let split = original.split(", ");
        //console.log(split);
        let newCol = {
            r: split[0].slice(5), //Get rid of the "rgba("
            g: split[1],
            b: split[2],
            a: split[3].slice(0, -1), //Get rid of the ")"

            toText() {
                return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
            }
        };

        newCol[channnel] = value;

        return newCol.toText();
    }

    function requestFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullscreen) {
            element.mozRequestFullscreen();
        } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
        // .. and do nothing if the method is not supported
    };





    //Callls beginPath() and filll()
    function drawClub(drawCtx, scale = 1, rotate = 0) {

        drawCtx.scale(scale, scale);
        drawCtx.rotate(rotate);
        drawCtx.translate(0, 150);
        drawCtx.beginPath();

        let a, c, d, e, f, g, h, j, k, l, m, n, o, p, q, r, s;

        //1
        a = -400; //Height


        //2
        c = 18; //C

        d = 20;
        e = -390;

        //3
        f = 60; //C
        g = -260;
        h = 20;
        i = -120

        //4
        j = 18; //C
        k = -110;
        l = 15;
        m = -100;
        //5
        n = 8;
        o = 100;

        //6
        p = 10;

        //7
        q = 15; //C
        r = 109;

        //8
        s = 118;


        drawCtx.moveTo(0, a); //0
        drawCtx.quadraticCurveTo(c, a, d, e); //2
        drawCtx.quadraticCurveTo(f, g, h, i); //3
        drawCtx.quadraticCurveTo(j, k, l, m); //4
        drawCtx.lineTo(n, o) //5
        drawCtx.lineTo(p, o) //6
        drawCtx.quadraticCurveTo(q, o, q, r) //7
        drawCtx.quadraticCurveTo(q, s, p, s) //8

        drawCtx.lineTo(-p, s); //8
        drawCtx.quadraticCurveTo(-q, s, -q, r) //7
        drawCtx.quadraticCurveTo(-q, o, -p, o) //6
        drawCtx.lineTo(-n, o) //5
        drawCtx.lineTo(-l, m); //4
        drawCtx.quadraticCurveTo(-j, k, -h, i); //3
        drawCtx.quadraticCurveTo(-f, g, -d, e); //2
        drawCtx.quadraticCurveTo(-c, a, 0, a); //1

        drawCtx.fill();
    }


    // \    \__  __  \___   __  \__   __/
    // |  | |__ /  )   |   /  \ |__) (__
    // |_/  |__ \__    |   \__/ |  \ \__)

    //Make a vector (shorthand for making an object literal with x and y)
    function vMake(x, y) {
        return {
            x,
            y
        };
    }

    //Return the result of adddig two vectors
    function vAdd(v1, v2) {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y
        };
    }

    //Return a vector scaled by a number
    function vMult(/*scalar*/s, v) {
        return { x: s * v.x, y: s * v.y };
    }

    //Return a random vector with specified min and max
    function vRandom(xMin = 0, xMax = 1, yMin = 0, yMax = 1) {
        return vMake(randomRange(xMin, xMax), randomRange(yMin, yMax));
    }


    //   / \    \__  __  \___   __  \__   __/
    //  /  |  | |__ /  )   |   /  \ |__) (__
    // /   |_/  |__ \__    |   \__/ |  \ \__)

    return {
        randomRange,

        makeColour,
        changeColour,

        requestFullscreen,


        drawClub,

        vMake,
        vAdd,
        vMult,
        vRandom
    };
}