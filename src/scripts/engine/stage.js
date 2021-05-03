class Stage {

  constructor({ target, width, height, update, init, onMouseClick, onMouseMove }) {

    this.width = width;
    this.height = height;

    this.target = target;
    this.canvas = document.getElementById(target);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.addEventListener('mousedown', (event) => {
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
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);    
    this.program = this.gl.createProgram();
    this.clearViewport();
    this.createShaders();
    this.aspect = this.canvas.width / this.canvas.height;

    this.frame = update;
    if (typeof init === 'function') {
      init();
    }

    window.requestAnimationFrame((ts) => this.draw(ts));
  }

  canvasMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y, button: event.button };
  }

  initGL() {
    let gl;
    try {
      gl = canvas.getContext("experimental-webgl");
      gl.viewportWidth = this.canvas.width;
      gl.viewportHeight = this.canvas.height;
    } catch (e) {
    }
    if (!gl) {
      alert("Could not initialise WebGL, sorry :-(");
    }
    return gl;
  }

  clearViewport(r, g, b, a) {
    //this.gl.colorMask(false, false, false, true);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(r, g, b, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  createShaders() {
    let v = document.getElementById("vertex").firstChild.nodeValue;
    let f = document.getElementById("fragment").firstChild.nodeValue;

    let vs = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vs, v);
    this.gl.compileShader(vs);

    let fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fs, f);
    this.gl.compileShader(fs);

    this.gl.attachShader(this.program, vs);
    this.gl.attachShader(this.program, fs);
    this.gl.linkProgram(this.program);

    if (!this.gl.getShaderParameter(vs, this.gl.COMPILE_STATUS))
      console.log(this.gl.getShaderInfoLog(vs));

    if (!this.gl.getShaderParameter(fs, this.gl.COMPILE_STATUS))
      console.log(this.gl.getShaderInfoLog(fs));

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS))
      console.log(this.gl.getProgramInfoLog(this.program));
  }

  getVertex(x, y) {
    const x_ndc = 2 * (x + 0.5) / this.width - 1;
    const y_ndc = 2 * (y + 0.5) / this.height - 1;
    return [x_ndc, y_ndc];
  }

  drawRectFill(color, x, y, w, h) {

    const tl = this.getVertex(x, y);
    const tr = this.getVertex(x + w, y);
    const bl = this.getVertex(x, y + h);
    const br = this.getVertex(x + w, y + h);

    let vertices = new Float32Array([

      tl[0],
      tl[1],

      tr[0],
      tr[1],

      br[0],
      br[1],

      tl[0],
      tl[1],

      bl[0],
      bl[1],

      br[0],
      br[1],

    ]);

    let vbuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    let itemSize = 2;
    let numItems = vertices.length / itemSize;

    this.gl.useProgram(this.program);

    this.program.uColor = this.gl.getUniformLocation(this.program, "uColor");
    this.gl.uniform4fv(this.program.uColor, color);

    this.program.aVertexPosition = this.gl.getAttribLocation(this.program, "aVertexPosition");
    this.gl.enableVertexAttribArray(this.program.aVertexPosition);
    this.gl.vertexAttribPointer(this.program.aVertexPosition, itemSize, this.gl.FLOAT, false, 0, 0);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, numItems);
  }

  draw(timeStamp) {

    // Calculate the number of seconds passed since the last frame
    const secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
    this.oldTimeStamp = timeStamp;

    // Calculate fps
    this.fps = Math.round(1 / secondsPassed);

    // clear the viewport
    this.clearViewport(0.1, 0.2, 0.2, 1);

    // Perform the drawing operation
    this.frame();

    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame((ts) => this.draw(ts));
  }  

}

export { Stage };