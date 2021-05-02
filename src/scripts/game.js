import { Cast } from "./cast";
import { Actor } from "./actor";
import { Utils } from "./utils";
import { Stage } from './stage';

// class Game {

//   constructor({ fill, target, width, height, onFrame, onMouseClick, onMouseMove }) {
//     this.fps = 0;
//     this.fill = fill;
//     this.width = width;
//     this.height = height;
//     this.debug = true;
//     this.oldTimeStamp = 10;

//     this.canvas = document.getElementById(target);
//     this.canvas.width = this.width;
//     this.canvas.height = this.height;
//     this.context = canvas.getContext("webgl");
//     this.canvas.addEventListener('mousedown', (event) => {
//       if (typeof onMouseClick === 'function')
//         onMouseClick(this.canvasMousePosition(event));
//     });
//     this.canvas.addEventListener('mousemove', (event) => {
//       if (typeof onMouseMove === 'function')
//         onMouseMove(this.canvasMousePosition(event));
//     });    

//     // no right click context on the canvas please
//     this.canvas.addEventListener("contextmenu", function(e){
//       e.preventDefault();
//     }, false);

//     this.frame = onFrame;
//     window.requestAnimationFrame((ts) => this.draw(ts));
//   }

//   canvasMousePosition(event) {
//     const rect = this.canvas.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;
//     return { x, y, button: event.button };
//   }

//   drawRectFill(color, x1, y1, x2, y2) {
//     this.context.fillStyle = color;
//     this.context.fillRect(x1, y1, x2, y2);
//   }

//   drawCircleFill(color, x1, y1, radius) {
//     this.context.fillStyle = color;
//     this.context.beginPath();
//     this.context.arc(x1, y1, radius, 0, 2 * Math.PI);
//     this.context.fill();
//   }

//   drawText(str, x, y, col = "black", font = "14px Arial") {
//     this.context.font = font;
//     this.context.fillStyle = col;
//     this.context.fillText(str, x, y);
//   }

//   draw(timeStamp) {

//     // Calculate the number of seconds passed since the last frame
//     const secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
//     this.oldTimeStamp = timeStamp;

//     // Calculate fps
//     this.fps = Math.round(1 / secondsPassed);

//     // Fill white background
//     if (this.fill) {
//       this.drawRectFill(this.fill, 0, 0, this.width, this.height);
//     }
//     // Perform the drawing operation
//     this.frame();

//     // The loop function has reached it's end. Keep requesting new frames
//     window.requestAnimationFrame((ts) => this.draw(ts));
//   }

// }
export { Stage, Utils, Cast, Actor };
