(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.howLongUntilLunch = {}));
}(this, (function (exports) { 'use strict';

  const hexToGlRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16) / 256,
      parseInt(result[2], 16) / 256,
      parseInt(result[3], 16) / 256,
      1
    ] : null;
  };

  const TV = {
    width: 320,
    height: 240,
    refreshRate: 60
  };

  // DB-32 - Thankyou DawnBringer!
  // https://github.com/geoffb/dawnbringer-palettes
  const hexpal = [
    '#000000', //  0 black
    '#222034', //  1 steel_grey
    '#45283c', //  2 livid_purple
    '#663931', //  3 buccanneer_brown
    '#8f563b', //  4 bronze
    '#df7126', //  5 cinnamon
    '#d9a066', //  6 gold
    '#eec39a', //  7 sand
    '#fbf236', //  8 sunshine
    '#99e550', //  9 mint
    '#6abe30', // 10 lawn
    '#37946e', // 11 teal
    '#4b692f', // 12 olive
    '#524b24', // 13 woodland
    '#323c39', // 14 deep_ocean
    '#3f3f74', // 15 storm_blue
    '#306082', // 16 calypso_blue
    '#5b6ee1', // 17 royal_blue
    '#639bff', // 18 malibu_blue
    '#5fcde4', // 19 turquoise_blue
    '#cbdbfc', // 20 baby_blue
    '#ffffff', // 21 white
    '#9badb7', // 22 gull_gray
    '#847e87', // 23 purple_gray
    '#696a6a', // 24 corduroy_gray
    '#595652', // 25 chicago_gray
    '#76428a', // 26 deluxe_purple
    '#ac3232', // 27 mojo_red
    '#d95763', // 28 roman_pink
    '#d77bba', // 29 orchid_pink
    '#8f974a', // 30 sycamore_green
    '#8a6f30'  // 31 pesto_green
  ];

  const rgbpal = hexpal.map((hex) => {
    return hexToGlRgb(hex);
  });

  const PAL = 
  {
    'BLACK': 0,
    'WHITE': 21,
    'RED': 27
  };

  const vertexShader = `
attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 vColor;
uniform vec2 uResolution;

void main() {
  vec2 zeroToOne = aPosition / uResolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  // x and y position in screen space
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  vColor = aColor;
  gl_PointSize = 1.0;
}
`;

  const fragmentShader = `
precision mediump float;

varying vec3 vColor;

void main() {
  gl_FragColor = vec4( vColor, 1.0 );
}
`;

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function vector(angle, length) {
    length = typeof length !== 'undefined' ? length : 10;
    angle = angle * Math.PI / 180; // if you're using degrees instead of radians
    return [length * Math.cos(angle), length * Math.sin(angle)];
  }
  function ld_x(len, dir) { return Math.cos(dir) * len; }
  function ld_y(len, dir) { return Math.sin(dir) * len; }
  function pointAngle(cx, cy, ex, ey) { }
  function pointDistance(x1, y1, x2, y2) {
    x3 = Math.abs(x2 - x1);
    y3 = Math.abs(y2 - y1);
    return Math.sqrt((x3 * x3) + (y3 * y3));
  }
  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
  }

  function reflectDegrees(incidenceAngle, wallAngle) {
    return radiansToDegrees((2 * degreesToRadians(wallAngle)) - degreesToRadians(incidenceAngle));
  }

  const repeat = n => f => x => {
    if (n > 0)
      return repeat(n - 1)(f)(f(x));
    else
      return x;
  };

  // times :: Int -> (Int -> Int) -> Int 
  const times = n => f =>
    repeat(n)(i => (f(i), i + 1))(0);

  const xyToMemory = (x, y, width) => {
    return x + y * width
  };
  const memoryToXy = (memory, width) => {
    memory = memory << 0;  // floor
    width = width << 0;  // floor
    x = memory % width;    // % is the "modulo operator", the remainder of i / width;
    y = memory / width;    // where "/" is an integer division
  };

  function splice2(index, howmany) {
    if (index < 0) {
      index = this.length + index;
    }  if (!howmany || howmany < 0) {
      howmany = 0;
    }  var selection = this.slice(index, index + howmany);
    copyFrom2(
      this.slice(0, index)
        .concat(Array.prototype.slice.apply(arguments, [2]))
        .concat(this.slice(index + howmany)));
    return selection;
  }
  function copyFrom2(source) {
    for (var i = 0; i < source.length; i++) {
      this[i] = source[i];
    }  this.length = source.length;
    return this;
  }

  const Utils = {
    uuidv4,
    getRandomInt,
    ld_x,
    ld_y,
    pointAngle,
    pointDistance,
    vector,
    degreesToRadians,
    radiansToDegrees,
    reflectDegrees,
    times,
    xyToMemory,
    memoryToXy,
    splice2 // Electric Boogaloo
  };

  class Actor {
    constructor({
      group = 'default',
      onInit = () => { },
      onUpdate = () => { },
      onDestroy = () => { }
    }) {

      this.time = 0;

      this.group = group;
      this.x;
      this.y;
      this.vx = 0;
      this.vy = 0;
      this.angle = 0;
      this.speed = 0;
      this.active = true;

      this.destroyAuto = false;
      this.destroyTimer = 0;
      this.destroyMe = false;

      this.init = onInit;
      this.update = onUpdate;
      this.destroy = onDestroy;

      this.init(this);
    }
    tick() {
      this.time += 1;
      return this;
    }
    setHitbox(x, y, width, height){
      this.hitbox = {
        x, y, width, height
      };
    }
    setPosition(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }
    setAngle(angle) {
      this.angle = angle;
      return this;
    }
    setSpeed(speed) {
      this.speed = speed;
      return this;
    }
    setVector(vector) {
      this.vx = vector[0];
      this.vy = vector[1];
      return this;
    } 
    destroyIn(frames) {
      this.destroyTimer = Math.abs(Math.floor(frames));
      this.destroyAuto = true;
      return this;
    }
    checkShouldDestroy() {

      if (this.destroyTimer > 0 && this.destroyAuto && this.active) {
        this.destroyTimer -= 1;
      }

      if (this.destroyTimer === 0 && this.destroyAuto) {
        this.destroyMe = true;
      }
      return this;
    }
    step() {
      if (this.active) {
        this.x += this.vx;
        this.y += this.vy;
      }
      return this;
    }
    stop() {
      this.vx = 0;
      this.vy = 0;
      return this;
    }
    up(amt) {
      this.vy = -Math.abs(amt);
      return this;
    }
    down(amt) {
      this.vy = Math.abs(amt);
      return this;
    }
    left(amt) {
      this.vx = -Math.abs(amt);
      return this;
    }
    right(amt) {
      this.vx = Math.abs(amt);
      return this;
    }
  }

  class Cast {
    constructor() {
      this.actors = {};
    }

    getActor(actorId) {
      if (this.actors[actorId]) {
        return this.actors[actorId];
      }
    }

    addActor(actorConfig) {
      const actor = new Actor(actorConfig);
      actor.init();
      actor.key = actorConfig.id || Utils.uuidv4();
      this.actors[actor.key] = actor;
      return actor.key;
    }

    destroyActor(actor) {
      if (typeof actor.destroy === "function") {
        actor.destroy();
      }
      delete this.actors[actor.key];
    }

    destroyActorById(actorId) {
      if (this.actors[actorId]) {
        this.destroyActor(this.actors[actorId]);
      }
    }

    destroyAllActors() {
      this.actors = {};
    }

    updateActors() {
      if (this.actors) {
        for (const [key, actor] of Object.entries(this.actors)) {
          if (actor.destroyMe) {
            this.destroyActor(this.actors[actor.key]);
          } else {
            actor.update();
          }
        }
      }
    }

    getHitbox(actor) {
      return {
        x: actor.x + actor.hitbox.x,
        y: actor.y + actor.hitbox.y,
        width: actor.hitbox.width,
        height: actor.hitbox.height
      };
    }

    collide(actor1, actor2) {
      let returnValue = false;
      if (actor1.hitbox && actor2.hitbox) {
        var rect1 = this.getHitbox(actor1);
        var rect2 = this.getHitbox(actor2);
        if (rect1.x < rect2.x + rect2.width &&
          rect1.x + rect1.width > rect2.x &&
          rect1.y < rect2.y + rect2.height &&
          rect1.y + rect1.height > rect2.y) {
          returnValue = true;
        }
      }
      return returnValue;
    }

    drawActors() {
      if (this.actors) {
        for (const [key, actor] of Object.entries(this.actors)) {
          actor.draw();
        }
      }
    }
  }

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

      this.frame = () => { };

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

      this.sprites = {};

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

    zoneCopy(source, sourcewidth, destination, destwidth, sx, sy, dx, dy, w, h) {

      let cloneSource = [...source];

      // lets make sure we dont try to modify our framebuffer outside its size
      if (sx + w > this.width) { w = this.fastInt(this.width - sx); }
      if (dx + w > this.width) { w = this.fastInt(this.width - dx); }
      if (sy + h > this.height) { h = this.fastInt(this.height - sy); }
      if (dy + h > this.height) { h = this.fastInt(this.height - dy); }

      let sourceAddress = Utils.xyToMemory(this.fastInt(sx), this.fastInt(sy), sourcewidth);
      let destAddress = Utils.xyToMemory(this.fastInt(dx), this.fastInt(dy), destwidth);
      let scanlineData = [];

      for (let i = 0; i < h; i++) {
        // cloneSource = [...source];
        // cloneDest = [...destination];      
        scanlineData = cloneSource.slice(sourceAddress, sourceAddress + w);
        this.framebuffer.splice(destAddress, w, ...scanlineData);
        sourceAddress += sourcewidth;
        destAddress += destwidth;
      }
    }


    /*
    🧚‍♀️ Sprites
    */

    async getImageData(imageUrl) {
      let img;
      const imageLoadPromise = new Promise(resolve => {
        img = new Image();
        img.onload = resolve;
        img.src = imageUrl;
      });

      await imageLoadPromise;
      return img;
    }

    // return nearest color from array
    nearestColor(palleteRGB, colorRGB) {
      var lowest = Number.POSITIVE_INFINITY;
      var tmp;
      let index = 0;
      palleteRGB.forEach((el, i) => {
        tmp = this.distance(colorRGB, el);
        if (tmp < lowest) {
          lowest = tmp;
          index = i;
        }    });
      return index;
    }
    distance(a, b) {
      return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
    }

    async getPixelData(img) {

      const canvas = document.createElement('canvas');
      //const canvas = document.getElementById('debug');
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      const imageData = context.getImageData(0, 0, img.width, img.height).data;
      console.log(imageData);
      let imageRgbData = [];
      for (var i = 0; i < imageData.length; i += 4) {
        const rgbPixel = [
          imageData[i] = imageData[i] / 255,     // red
          imageData[i + 1] = imageData[i + 1] / 255, // green
          imageData[i + 2] = imageData[i + 2] / 255, // blue
          imageData[i + 3] = 1 // no transparent
        ];

        imageRgbData.push(this.nearestColor(rgbpal, rgbPixel));
      }
      return {
        data: imageRgbData,
        width: img.width,
        height: img.height
      };
    }

    async loadPng(src) {

      // load image
      const imageObj = await this.getImageData(src);

      // get pixel data
      const imageData = await this.getPixelData(imageObj);

      return imageData;
    }
    async addSprite(name, path) {
      this.sprites[name] = await this.loadPng(path);
      console.log('🎨', this.getSprite(name));
    }
    getSprite(name) { return this.sprites[name]; }

    drawSprite(name, x, y, {
      width,
      height,
      offsetX,
      offsetY,
      transparentColor,
      flipH,
      flipV
    } = {}) {

      if (name) {

        const bigSprite = this.getSprite(name);

        const sprWidth = width || bigSprite.width;
        const sprHeight = height || bigSprite.height;

        if (bigSprite) {
          this.zoneCopy(
            bigSprite.data,
            bigSprite.width,
            this.framebuffer,
            this.width,
            offsetX,
            offsetY,
            x,
            y,
            sprWidth,
            sprHeight
          );
        }

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

            if (fragCol) {
              var k = index * 5;
              this.framebufferInternal[k + 2] = fragCol[0]; // r
              this.framebufferInternal[k + 3] = fragCol[1]; // g
              this.framebufferInternal[k + 4] = fragCol[2]; // b
            }
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

  class Audio {

    constructor() {
      this.sounds = {};
      try {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        alert('Web Audio API is not supported in this browser');
      }

    }

    add(name, url) {
      if (this.context) {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // Decode asynchronously
        request.onload = () => {
          this.context.decodeAudioData(request.response, (buffer) => {
            this.sounds[name] = buffer;
          }, this.onError);
        };
        request.send();
      }
    }
    onError(error) {
      console.log(error);
    }
    play(name) {
      if (this.sounds[name]) {
        let source = this.context.createBufferSource(); // creates a sound source
        source.buffer = this.sounds[name];                    // tell the source which sound to play
        source.connect(this.context.destination);       // connect the source to the context's destination (the speakers)
        source.start(0);
      }
    }

  }

  class Sprites {

    constructor() {
      this.sprites = {};
    }

    async getImageData(imageUrl) {
      let img;
      const imageLoadPromise = new Promise(resolve => {
        img = new Image();
        img.onload = resolve;
        img.src = imageUrl;
      });

      await imageLoadPromise;
      return img;
    }

    // return nearest color from array
    nearestColor(palleteRGB, colorRGB) {
      var lowest = Number.POSITIVE_INFINITY;
      var tmp;
      let index = 0;
      palleteRGB.forEach((el, i) => {
        tmp = this.distance(colorRGB, el);
        if (tmp < lowest) {
          lowest = tmp;
          index = i;
        }    });
      return index;
    }
    distance(a, b) {
      return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
    }

    async getPixelData(img) {

      //const canvas = document.createElement('canvas');
      const canvas = document.getElementById('debug');
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      const imageData = context.getImageData(0, 0, img.width, img.height).data;
      console.log(imageData);
      let imageRgbData = [];
      for (var i = 0; i < imageData.length; i += 4) {
        const rgbPixel = [
          imageData[i] = imageData[i] / 255,     // red
          imageData[i + 1] = imageData[i + 1] / 255, // green
          imageData[i + 2] = imageData[i + 2] / 255, // blue
          imageData[i + 3] = 1 // no transparent
        ];

        imageRgbData.push(this.nearestColor(rgbpal, rgbPixel));
      }
      return {
        data: imageRgbData,
        width: img.width,
        height: img.height
      };
    }

    async loadPng(src) {

      // load image
      const imageObj = await this.getImageData(src);

      // get pixel data
      const imageData = await this.getPixelData(imageObj);

      return imageData;
    }
    async add(name, path) {
      this.sprites[name] = await this.loadPng(path);
      console.log('🎨', this.get(name));
    }
    get(name) { return this.sprites[name]; }
  }

  /*!
   * gamepad.js v0.0.5-alpha
   * https://github.com/neogeek/gamepad.js
   *
   * Copyright (c) 2017 Scott Doxey
   * Released under the MIT license.
   */

  var _requestAnimationFrame,
      _cancelAnimationFrame,
      hasGamepadSupport = window.navigator.getGamepads !== undefined;

  if (String(typeof window) !== 'undefined') {

      ['webkit', 'moz'].forEach(function (key) {
          _requestAnimationFrame = _requestAnimationFrame || window.requestAnimationFrame || window[key + 'RequestAnimationFrame'] || null;
          _cancelAnimationFrame = _cancelAnimationFrame || window.cancelAnimationFrame || window[key + 'CancelAnimationFrame'] || null;
      });

  }

  function findKeyMapping(index, mapping) {

      var results = [];

      Object.keys(mapping).forEach(function (key) {

          if (mapping[key] === index) {

              results.push(key);

          } else if (Array.isArray(mapping[key]) && mapping[key].indexOf(index) !== -1) {

              results.push(key);

          }

      });

      return results;

  }

  function Gamepad() {

      this._events = {
          gamepad: [],
          axes: [],
          keyboard: {}
      };

      this._handlers = {
          gamepad: {
              connect: null,
              disconnect: null
          }
      };

      this._keyMapping = {
          gamepad: {
              'button_1': 0,
              'button_2': 1,
              'button_3': 2,
              'button_4': 3,
              'shoulder_top_left': 4,
              'shoulder_top_right': 5,
              'shoulder_bottom_left': 6,
              'shoulder_bottom_right': 7,
              'select': 8,
              'start': 9,
              'stick_button_left': 10,
              'stick_button_right': 11,
              'd_pad_up': 12,
              'd_pad_down': 13,
              'd_pad_left': 14,
              'd_pad_right': 15,
              'vendor': 16
          },
          axes: {
              'stick_axis_left': [0, 2],
              'stick_axis_right': [2, 4]
          },
          keyboard: {
              'button_1': 32,
              'start': 27,
              'd_pad_up': [38, 87],
              'd_pad_down': [40, 83],
              'd_pad_left': [37, 65],
              'd_pad_right': [39, 68]
          }
      };

      this._threshold = 0.3;

      this._listeners = [];

      this._handleKeyboardEventListener = this._handleKeyboardEventListener.bind(this);

      this.resume();

  }

  Gamepad.prototype._handleGamepadConnected = function (index) {

      if (this._handlers.gamepad.connect) {

          this._handlers.gamepad.connect({ index: index });

      }

  };

  Gamepad.prototype._handleGamepadDisconnected = function (index) {

      if (this._handlers.gamepad.disconnect) {

          this._handlers.gamepad.disconnect({ index: index });

      }

  };

  Gamepad.prototype._handleGamepadEventListener = function (controller) {

      var self = this;

      if (controller && controller.connected) {

          controller.buttons.forEach(function (button, index) {

              var keys = findKeyMapping(index, self._keyMapping.gamepad);

              if (keys) {

                  keys.forEach(function (key) {

                      if (button.pressed) {

                          if (!self._events.gamepad[controller.index][key]) {

                              self._events.gamepad[controller.index][key] = {
                                  pressed: true,
                                  hold: false,
                                  released: false,
                                  player: controller.index
                              };

                          }

                          self._events.gamepad[controller.index][key].value = button.value;

                      } else if (!button.pressed && self._events.gamepad[controller.index][key]) {

                          self._events.gamepad[controller.index][key].released = true;
                          self._events.gamepad[controller.index][key].hold = false;

                      }

                  });

              }

          });

      }

  };

  Gamepad.prototype._handleGamepadAxisEventListener = function (controller) {

      var self = this;

      if (controller && controller.connected) {

          Object.keys(self._keyMapping.axes).forEach(function (key) {

              var axes = Array.prototype.slice.apply(controller.axes, self._keyMapping.axes[key]);

              if (Math.abs(axes[0]) > self._threshold || Math.abs(axes[1]) > self._threshold) {

                  self._events.axes[controller.index][key] = {
                      pressed: self._events.axes[controller.index][key] ? false : true,
                      hold: self._events.axes[controller.index][key] ? true : false,
                      released: false,
                      value: axes
                  };

              } else if (self._events.axes[controller.index][key]) {

                  self._events.axes[controller.index][key] = {
                      pressed: false,
                      hold: false,
                      released: true,
                      value: axes
                  };

              }

          });

      }

  };

  Gamepad.prototype._handleKeyboardEventListener = function (e) {

      var self = this,
          keys = findKeyMapping(e.keyCode, self._keyMapping.keyboard);

      if (keys) {

          keys.forEach(function (key) {

              if (e.type === 'keydown' && !self._events.keyboard[key]) {

                  self._events.keyboard[key] = {
                      pressed: true,
                      hold: false,
                      released: false
                  };

              } else if (e.type === 'keyup' && self._events.keyboard[key]) {

                  self._events.keyboard[key].released = true;
                  self._events.keyboard[key].hold = false;

              }

          });

      }

  };

  Gamepad.prototype._handleEvent = function (key, events, player) {

      if (events[key].pressed) {

          this.trigger('press', key, events[key].value, player);

          events[key].pressed = false;
          events[key].hold = true;

      } else if (events[key].hold) {

          this.trigger('hold', key, events[key].value, player);

      } else if (events[key].released) {

          this.trigger('release', key, events[key].value, player);

          delete events[key];

      }

  };

  Gamepad.prototype._loop = function () {

      var self = this,
          gamepads = hasGamepadSupport ? window.navigator.getGamepads() : false,
          length = 4, // length = gamepads.length;
          i;

      if (gamepads) {

          for (i = 0; i < length; i = i + 1) {

              if (gamepads[i]) {

                  if (!self._events.gamepad[i]) {

                      self._handleGamepadConnected(i);

                      self._events.gamepad[i] = {};
                      self._events.axes[i] = {};

                  }

                  self._handleGamepadEventListener(gamepads[i]);
                  self._handleGamepadAxisEventListener(gamepads[i]);

              } else if (self._events.gamepad[i]) {

                  self._handleGamepadDisconnected(i);

                  self._events.gamepad[i] = null;
                  self._events.axes[i] = null;

              }

          }

          self._events.gamepad.forEach(function (gamepad, player) {

              if (gamepad) {

                  Object.keys(gamepad).forEach(function (key) {

                      self._handleEvent(key, gamepad, player);

                  });

              }

          });

          self._events.axes.forEach(function (gamepad, player) {

              if (gamepad) {

                  Object.keys(gamepad).forEach(function (key) {

                      self._handleEvent(key, gamepad, player);

                  });

              }

          });

      }

      Object.keys(self._events.keyboard).forEach(function (key) {

          self._handleEvent(key, self._events.keyboard, 'keyboard');

      });

      if (self._requestAnimation) {

          self._requestAnimation = _requestAnimationFrame(self._loop.bind(self));

      }

  };

  Gamepad.prototype.on = function (type, button, callback, options) {

      var self = this;

      if (Object.keys(this._handlers.gamepad).indexOf(type) !== -1 && typeof button === 'function') {

          this._handlers.gamepad[type] = button;

          this._events.gamepad = [];

      } else {

          if (typeof type === "string" && type.match(/\s+/)) {

              type = type.split(/\s+/g);

          }

          if (typeof button === "string" && button.match(/\s+/)) {

              button = button.split(/\s+/g);

          }

          if (Array.isArray(type)) {

              type.forEach(function (type) {

                  self.on(type, button, callback, options);

              });

          } else if (Array.isArray(button)) {

              button.forEach(function (button) {

                  self.on(type, button, callback, options);

              });

          } else {

              this._listeners.push({
                  type: type,
                  button: button,
                  callback: callback,
                  options: options
              });

          }

      }

  };

  Gamepad.prototype.off = function (type, button) {

      var self = this;

      if (typeof type === "string" && type.match(/\s+/)) {

          type = type.split(/\s+/g);

      }

      if (typeof button === "string" && button.match(/\s+/)) {

          button = button.split(/\s+/g);

      }

      if (Array.isArray(type)) {

          type.forEach(function (type) {

              self.off(type, button);

          });

      } else if (Array.isArray(button)) {

          button.forEach(function (button) {

              self.off(type, button);

          });

      } else {

          this._listeners = this._listeners.filter(function (listener) {

              return listener.type !== type && listener.button !== button;

          });

      }

  };

  Gamepad.prototype.setCustomMapping = function (device, config) {

      if (this._keyMapping[device] !== undefined) {

          this._keyMapping[device] = config;

      } else {

          throw new Error('The device "' + device + '" is not supported through gamepad.js');

      }

  };

  Gamepad.prototype.setGlobalThreshold = function (num) {

      this._threshold = parseFloat(num);

  };

  Gamepad.prototype.trigger = function (type, button, value, player) {

      if (this._listeners) {

          this._listeners.forEach(function (listener) {

              if (listener.type === type && listener.button === button) {

                  listener.callback({
                      type: listener.type,
                      button: listener.button,
                      value: value,
                      player: player,
                      event: listener,
                      timestamp: Date.now()
                  });

              }

          });

      }

  };

  Gamepad.prototype.pause = function () {

      _cancelAnimationFrame(this._requestAnimation);

      this._requestAnimation = null;

      document.removeEventListener('keydown', this._handleKeyboardEventListener);
      document.removeEventListener('keyup', this._handleKeyboardEventListener);

  };

  Gamepad.prototype.resume = function () {

      this._requestAnimation = _requestAnimationFrame(this._loop.bind(this));

      document.addEventListener('keydown', this._handleKeyboardEventListener);
      document.addEventListener('keyup', this._handleKeyboardEventListener);

  };

  Gamepad.prototype.destroy = function () {

      this.pause();

      delete this._listeners;

  };

  // }());

  // t: current time, b: beginning value, _c: final value, d: total duration
  const Tweens = {
    linear: function(t, b, _c, d) {
      var c = _c - b;
      return c * t / d + b;
    },
    easeInQuad: function(t, b, _c, d) {
      var c = _c - b;
      return c * (t /= d) * t + b;
    },
    easeOutQuad: function(t, b, _c, d) {
      var c = _c - b;
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(t, b, _c, d) {
      var c = _c - b;
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
      } else {
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      }
    },
    easeInCubic: function(t, b, _c, d) {
      var c = _c - b;
      return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(t, b, _c, d) {
      var c = _c - b;
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(t, b, _c, d) {
      var c = _c - b;
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
      } else {
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      }
    },
    easeInQuart: function(t, b, _c, d) {
      var c = _c - b;
      return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(t, b, _c, d) {
      var c = _c - b;
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(t, b, _c, d) {
      var c = _c - b;
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t + b;
      } else {
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      }
    },
    easeInQuint: function(t, b, _c, d) {
      var c = _c - b;
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(t, b, _c, d) {
      var c = _c - b;
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(t, b, _c, d) {
      var c = _c - b;
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t * t + b;
      } else {
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      }
    },
    easeInSine: function(t, b, _c, d) {
      var c = _c - b;
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(t, b, _c, d) {
      var c = _c - b;
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(t, b, _c, d) {
      var c = _c - b;
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(t, b, _c, d) {
      var c = _c - b;
      return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    easeOutExpo: function(t, b, _c, d) {
      var c = _c - b;
      return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    easeInOutExpo: function(t, b, _c, d) {
      var c = _c - b;
      if (t === 0) {
        return b;
      }
      if (t === d) {
        return b + c;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      } else {
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      }
    },
    easeInCirc: function(t, b, _c, d) {
      var c = _c - b;
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(t, b, _c, d) {
      var c = _c - b;
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(t, b, _c, d) {
      var c = _c - b;
      if ((t /= d / 2) < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      } else {
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      }
    },
    easeInElastic: function(t, b, _c, d) {
      var c = _c - b;
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) {
        return b;
      } else if ((t /= d) === 1) {
        return b + c;
      }
      if (!p) {
        p = d * 0.3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(t, b, _c, d) {
      var c = _c - b;
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) {
        return b;
      } else if ((t /= d) === 1) {
        return b + c;
      }
      if (!p) {
        p = d * 0.3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(t, b, _c, d) {
      var c = _c - b;
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) {
        return b;
      } else if ((t /= d / 2) === 2) {
        return b + c;
      }
      if (!p) {
        p = d * (0.3 * 1.5);
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      if (t < 1) {
        return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      } else {
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
      }
    },
    easeInBack: function(t, b, _c, d, s) {
      var c = _c - b;
      if (s === void 0) {
        s = 1.70158;
      }
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(t, b, _c, d, s) {
      var c = _c - b;
      if (s === void 0) {
        s = 1.70158;
      }
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(t, b, _c, d, s) {
      var c = _c - b;
      if (s === void 0) {
        s = 1.70158;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
      } else {
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
      }
    },
    easeInBounce: function(t, b, _c, d) {
      var c = _c - b;
      var v;
      v = tweenFunctions.easeOutBounce(d - t, 0, c, d);
      return c - v + b;
    },
    easeOutBounce: function(t, b, _c, d) {
      var c = _c - b;
      if ((t /= d) < 1 / 2.75) {
        return c * (7.5625 * t * t) + b;
      } else if (t < 2 / 2.75) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
      } else if (t < 2.5 / 2.75) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
      }
    },
    easeInOutBounce: function(t, b, _c, d) {
      var c = _c - b;
      var v;
      if (t < d / 2) {
        v = tweenFunctions.easeInBounce(t * 2, 0, c, d);
        return v * 0.5 + b;
      } else {
        v = tweenFunctions.easeOutBounce(t * 2 - d, 0, c, d);
        return v * 0.5 + c * 0.5 + b;
      }
    }
  };

  class GameEngine {
    constructor() {
      this.stage;
      this.state = {};
      this.actors = new Cast();
      this.audio = new Audio();
      this.sprites = new Sprites();
      this.gamepad = new Gamepad();
      this.tweens = Tweens;
      this.utils = Utils;
      console.log('🦄 engine started');
    }
    powerOn({ target, init, update, mouseClick, mouseMove }) {
      this.stage = new Stage({
        target,
        width: TV.width,
        height: TV.height,
        refreshRate: TV.refreshRate,
        onMouseClick: mouseClick,
        onMouseMove: mouseMove,
      });
      if (typeof init === 'function') {
        init();
      }
      if (typeof update === 'function') {
        this.stage.frame = update;
      }

    }
  }

  const Game = new GameEngine();

  exports.Game = Game;
  exports.PAL = PAL;
  exports.TV = TV;
  exports.hexpal = hexpal;
  exports.rgbpal = rgbpal;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
