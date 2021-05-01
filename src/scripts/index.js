import "../styles/index.scss";
import { Game, Cast, Utils } from './game';
import { easeOutCubic } from './tween';

if (process.env.NODE_ENV === "development") {
  require("../index.html");
}

const config = {
  width: 800,
  height: 600
};

const cast = new Cast();

const stage = new Game({
  target: 'canvas',
  width: config.width,
  height: config.height,
  fill: '#f0f0f0',
  onFrame: () => {
    cast.updateActors();
    stage.drawText('Actors: ' + Object.keys(cast.actors).length, 20, 20);
  }
});

document
  .getElementById("create-button")
  .addEventListener("click", () => {
    console.log("createButton clicked");
    // Create Player
    cast.addActor({
      id: Utils.uuidv4(),
      group: "friendly",
      onInit: function () {
        this.x = config.width / 2;
        this.y = config.height / 2;
        this.angle = Utils.getRandomInt(359);
      },
      onUpdate: function () {

        this.tick();

        this.speed = easeOutCubic(this.time, 8, 0, 120);

        const vector = Utils.vector(this.angle, this.speed);
        this.vx = vector[0];
        this.vy = vector[1];
        
        this.move();

        //stage.drawRectFill('#f00000', this.x, this.y, 20, 20);

        stage.drawCircleFill(`rgba(255, 0, 0, ${this.speed / 4})`, this.x, this.y, 10);

        // stage.drawText(`${Math.floor(this.x)}/${Math.floor(this.y)} - t:${this.time}`, this.x, this.y - 10);

        if (this.time > 240) {
          cast.destroyActorById(this.key);
        }

      },
      onDestroy: function () {
        this.active = false;
      },
    });

  });

document
  .getElementById("destroy-button")
  .addEventListener("click", () => {
    console.log("destroy button clicked");
    cast.destroyAllActors();
  });

