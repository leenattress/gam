import { Cast } from "./cast";
import { Actor } from "./actor";
import { Utils } from "./utils";

class Game {

  constructor({ fill, target, width, height, onFrame }) {
    this.fps = 0;
    this.fill = fill;
    this.width = width;
    this.height = height;
    this.debug = true;
    this.oldTimeStamp = 10;
    this.canvas = document.getElementById(target);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = canvas.getContext("2d");
    this.frame = onFrame;
    window.requestAnimationFrame((ts) => this.draw(ts));
  }

  drawRectFill(color, x1, y1, x2, y2) {
    this.context.fillStyle = color;
    this.context.fillRect(x1, y1, x2, y2);
  }

  drawCircleFill(color, x1, y1, radius) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x1, y1, radius, 0, 2 * Math.PI);
    this.context.fill();
  }

  drawText(str, x, y, col = "black", font = "14px Arial") {
    this.context.font = font;
    this.context.fillStyle = col;
    this.context.fillText(str, x, y);
  }

  draw(timeStamp) {

    // Calculate the number of seconds passed since the last frame
    const secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
    this.oldTimeStamp = timeStamp;

    // Calculate fps
    this.fps = Math.round(1 / secondsPassed);

    // Fill white background
    if (this.fill) {
      this.drawRectFill(this.fill, 0, 0, this.width, this.height);
    }
    // Perform the drawing operation
    this.frame();

    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame((ts) => this.draw(ts));
  }

}
export { Game, Utils, Cast, Actor };
