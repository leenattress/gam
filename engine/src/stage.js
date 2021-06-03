import { rgbpal, vertexShader, fragmentShader } from './tv'
import { Utils } from './utils'

class Stage {

  constructor({ target, width, height, refreshRate, onMouseClick, onMouseMove }) {

    this.vs = vertexShader;
    this.fs = fragmentShader;

    this.width = width;
    this.height = height;
    this.refreshRate = refreshRate;
    this.elapsed;
    this.now;
    this.frameCount = 0;

    this.frame = () => { }

    this.target = target;
    this.canvas = document.getElementById(target);
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.canvas.addEventListener('mousedown', (event) => {
      // console.log('mousedown')
      if (typeof onMouseClick === 'function')
        onMouseClick(this.canvasMousePosition(event));
    });

    this.canvas.addEventListener('mousemove', (event) => {
      if (typeof onMouseMove === 'function')
        onMouseMove(this.canvasMousePosition(event));
    });

    // no right click context on the canvas please
    this.canvas.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    }, false);


    this.gl = this.initGL();
    //this.gl.enable(this.gl.BLEND);
    //this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    //this.program = this.gl.createProgram();
    //this.clearViewport();
    this.createShaders();

    this.aspect = this.canvas.width / this.canvas.height;

    // if (typeof update === 'function') {
    //   init();
    // }

    this.sprites = [];

    this.fpsInterval = 1000 / (this.refreshRate || 60);
    this.then = Date.now();
    this.startTime = this.then;

    this.rgbpal = rgbpal;

    this.pixels = this.canvas.width * this.canvas.height;
    this.framebuffer = new Array(this.pixels);
    this.framebufferInternal = new Float32Array(this.pixels * 5);

    let index = 0;
    for (var i = 0; i < this.canvas.width; i++) {
      for (var j = 0; j < this.canvas.height; j++) {
        this.framebuffer[index] = 0; // black framebuffer

        var k = index * 5;
        this.framebufferInternal[k + 0] = i + 0.5; // x
        this.framebufferInternal[k + 1] = j + 0.5; // y
        this.framebufferInternal[k + 2] = 0; // r
        this.framebufferInternal[k + 3] = 0; // g
        this.framebufferInternal[k + 4] = 0; // b      

        index += 1;
      }
    }

    window.requestAnimationFrame((ts) => this.draw(ts));
  }

  canvasMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((event.clientX / rect.width) * this.width) - ((rect.left / rect.width) * this.width);
    const y = ((event.clientY / rect.height) * this.height) - ((rect.top / rect.height) * this.height);
    return { x, y, button: event.button, event, rect };
  }

  initGL() {
    let gl;
    try {
      gl = canvas.getContext("webgl");
      gl.viewportWidth = this.width;
      gl.viewportHeight = this.height;
    } catch (e) {
    }
    if (!gl) {
      alert("Could not initialise WebGL, sorry :-(");
    }
    return gl;
  }

  cls(color) {
    this.framebuffer = new Array(this.pixels).fill(color);
  }

  createShaders() {

    this.program = this.gl.createProgram();
    this.vShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.fShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.attachShader(this.program, this.vShader);
    this.gl.attachShader(this.program, this.fShader);
    this.gl.shaderSource(this.vShader, this.vs);
    this.gl.compileShader(this.vShader);
    this.gl.shaderSource(this.fShader, this.fs);
    this.gl.compileShader(this.fShader);
    this.gl.linkProgram(this.program);

    this.gl.viewport(0, 0, this.width, this.height);

    this.gl.useProgram(this.program);

    if (!this.gl.getShaderParameter(this.vShader, this.gl.COMPILE_STATUS))
      console.log(this.gl.getShaderInfoLog(this.vShader));

    if (!this.gl.getShaderParameter(this.fShader, this.gl.COMPILE_STATUS))
      console.log(this.gl.getShaderInfoLog(this.fShader));

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS))
      console.log(this.gl.getProgramInfoLog(this.program));

  }

  // getVertex(x, y) {
  //   const x_ndc = (2 * (x + 0.5) / this.width - 1);
  //   const y_ndc = (2 * (y + 0.5) / this.height - 1);
  //   return [x_ndc, y_ndc];
  // }

  zoneCopy(source, sourcewidth, destination, destwidth, sx, sy, dx, dy, w, h) {

    let cloneSource = [...source];
    let cloneDest = [...destination];

    // lets make sure we dont try to modify our framebuffer outside its size
    if (sx + w > this.width) { w = this.fastInt(this.width - sx) }
    if (dx + w > this.width) { w = this.fastInt(this.width - dx) }
    if (sy + h > this.height) { h = this.fastInt(this.height - sy) }
    if (dy + h > this.height) { h = this.fastInt(this.height - dy) }

    let sourceAddress = Utils.xyToMemory(this.fastInt(sx), this.fastInt(sy), sourcewidth);
    let destAddress = Utils.xyToMemory(this.fastInt(dx), this.fastInt(dy), destwidth);
    let scanlineData = []

    for (let i = 0; i < h; i++) {
      // cloneSource = [...source];
      // cloneDest = [...destination];      
      scanlineData = cloneSource.slice(sourceAddress, sourceAddress + w)
      this.framebuffer.splice(destAddress, w, ...scanlineData)
      sourceAddress += sourcewidth
      destAddress += destwidth
    }
  }

  fastInt(float) {
    return (float) << 0;
  }

  pset(colour, x, y) {
    const memLoc = Utils.xyToMemory(x, y, this.width);
    this.framebuffer[memLoc] = colour;
  }
  pget(x, y) {
    const memLoc = Utils.xyToMemory(x, y, this.width);
    return this.framebuffer[memLoc];
  }

  rectFill(col, x1, y1, width, height) {
    const x1int = this.fastInt(x1);
    const y1int = this.fastInt(y1);
    const widthInt = this.fastInt(width);
    const hegihtInt = this.fastInt(height);

    const x2 = x1int + widthInt;
    const y2 = y1int + hegihtInt;
    for (var x = x1int; x < x2; x++) {
      for (var y = y1int; y < y2; y++) {
        this.pset(col, x, y);
      }
    }
  }

  framebufferToScreen() {

    // Send framebuffer to gl buffer
    // ===================

    let colour;
    let fragCol;

    let index = 0;
    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        colour = this.framebuffer[Utils.xyToMemory(i, j, this.width)];
        if (colour === 0 || colour > 0) {
          fragCol = this.rgbpal[colour];

          var k = index * 5;
          this.framebufferInternal[k + 2] = fragCol[0]; // r
          this.framebufferInternal[k + 3] = fragCol[1]; // g
          this.framebufferInternal[k + 4] = fragCol[2]; // b     
        }

        index += 1;
      }
    }

    var buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.framebufferInternal, this.gl.STATIC_DRAW);

    this.program.uResolution = this.gl.getUniformLocation(this.program, "uResolution");
    this.gl.uniform2f(this.program.uResolution, this.width, this.height);

    this.program.aVertexPosition = this.gl.getAttribLocation(this.program, "aPosition");
    this.gl.enableVertexAttribArray(this.program.aVertexPosition);
    this.gl.vertexAttribPointer(this.program.aVertexPosition, 4, this.gl.FLOAT, false, 5 * 4, 0);

    var aCol = this.gl.getAttribLocation(this.program, 'aColor');
    this.gl.enableVertexAttribArray(aCol);
    this.gl.vertexAttribPointer(aCol, 3, this.gl.FLOAT, false, 5 * 4, 2 * 4);


    // Draw pixels to canvas
    // ===================

    this.gl.drawArrays(this.gl.POINTS, 0, this.pixels);

  }

  draw(timeStamp) {

    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame((ts) => this.draw(ts));

    // Calculate the number of seconds passed since the last frame
    const secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
    this.oldTimeStamp = timeStamp;

    // Calculate fps
    this.fps = Math.round(1 / secondsPassed);

    this.now = Date.now();
    this.elapsed = this.now - this.then;

    // if enough time has elapsed, draw the next frame

    if (this.elapsed > this.fpsInterval) {

      this.then = this.now - (this.elapsed % this.fpsInterval);

      // Perform the drawing operation
      this.frame();
      this.framebufferToScreen();


    }

  }

}

export { Stage };