(function () {
    var dataArray = new Uint8Array(1);
    var audioCtx, analyser, audioElement, source;

    function plugAnal() {
        audioCtx = new window.AudioContext();
        analyser = audioCtx.createAnalyser();
        audioElement = document.getElementById('track');
        source = audioCtx.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 256;
        analyser.getByteTimeDomainData(dataArray);
    }
    plugAnal();

    var w = document.body.clientWidth,
        h = document.body.clientHeight;
 

    var majorColor ="rgb(0,0,0)";

    function amplitude(){
        analyser.getByteTimeDomainData(dataArray);
        return dataArray[0];
    }

    function rand(range) {
        return Math.floor(range * Math.random())
    }

    var field = document.getElementById('canvas'),
        canvas = field.getContext("2d"),
        cx = 0, cy = h / 2,
        inc = rand(100),
        c = h / 2, modOp = 'inc',
        iterations = ampstage  = iterationLen = 0,
        iteration = 1,
        D = 2 * Math.PI, DOTS = [];

    for (var i = 0; i < 10; i++) {
        DOTS[i] = {
            x: Math.floor(cx),
            y: Math.floor(cy),
            r: rand(5)+1,
            ang: rand(10) * rand(10),
            its: 0,
            modX: Math.random(),
            modY: Math.random()
        }
    }

    function update_dot(index) {
        DOTS[index].r =  rand(5) + 1;

    }

    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        w = document.body.clientWidth;
        h = document.body.clientHeight;
        field.width = w;
        field.height = h;
    }


    function modify(d, modx) {
        x = modx + ((d.modX + d.modY * d.ang) * Math.cos(d.ang));
        y = cy + ((d.modX + d.modY * d.ang) * Math.sin(d.ang));
        d.ang = rand(10) * rand(10);
        d.its++;
        return {x: x, y: y, r: d.r}
    }

    function road(x, y, modx) {
        canvas.moveTo(x, y);
        canvas.lineTo(modx, cy);
        canvas.lineWidth = .5;
        canvas.strokeStyle = "rgba(255, 255, 255, .3)";
        canvas.stroke();
    }

    function put_dot(dot, modx) {
        var d = modify(dot, modx);
        canvas.beginPath();
        canvas.arc(d.x, d.y, (opvar - 0.2)*10, 0, D, !0);
        canvas.closePath();
        canvas.fill();
        road(d.x, d.y, modx)
    }
    var opvar = 1;
    var grow = true;
    function draw() {
        canvas.clearRect(0, 0, w, h);
        canvas.fillStyle = 'rgba(255,255,255,'+opvar+')'
        //amp =  Math.abs(128 - amplitude())*5;
        for(var modx = 0; modx < w; modx += 20){
            cy = (Math.sin((modx * Math.PI / 180)) * amp ) + c;
            for (j = 0; j < 10; j++) {
               if(DOTS[j].its < 600){
                   put_dot(DOTS[j], modx)
               } else {
                   update_dot(j)
                   put_dot(DOTS[j], modx)
               }
            }
        }
        if (grow){
            opvar-=.1;
        } 
        else {
            opvar+=.1;
        }
        if(opvar < 0.2){ opvar = 0.2; grow=false } else if (opvar > .7){opvar = .7; grow=true;}
        
        frame++;
        if(frame > 15) {
            amp--;
        }else {
            amp++;
        }
        if(frame == 30) {
            frame = 0;
            amp =  Math.abs(128 - amplitude()) * 5;
        }
    }
    resizeCanvas();
    frame = 0;
    amp =  Math.abs(128 - amplitude())*5;
    setInterval(draw, 16);
})();
