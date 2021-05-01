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
  },
  onMouseClick: (event) => {
    if (event.button === 0) {
      makeBouncyActorHere(event.x, event.y, 20);
      var i;
      for (i = 0; i < (Utils.getRandomInt(5) + 5); i++) {
        makeSmallParticle(event.x, event.y);
      };
    } else {
      cast.destroyAllActors();
    }
  },
  // onMouseMove: (event) => {
  //   console.log(event);
  // }
});

const makeSmallParticle = (x, y) => {
  const actorId = cast.addActor({
    onInit: function () {
      this.x = x;
      this.y = y;
      this.angle = Utils.getRandomInt(359);
    },
    onUpdate: function () {
      this.tick();
      this.speed = easeOutCubic(this.time, Utils.getRandomInt(16), 0, 60);
      const vector = Utils.vector(this.angle, this.speed);
      this.vx = vector[0];
      this.vy = vector[1];
      this.move();
      if (this.time > 30) { cast.destroyActorById(this.key); }
      stage.drawCircleFill(`rgba(0, 0, 255, 0.5`, this.x, this.y, Math.max(0.1, this.speed));
    }
  });
};

const makeBouncyActorHere = (x, y, size) => {
  const actorId = cast.addActor({
    onInit: function () {
      this.x = x;
      this.y = y;
      this.angle = Utils.getRandomInt(359);
    },
    onUpdate: function () {

      this.tick();

      this.speed = easeOutCubic(this.time, 20, 0, 240);

      const vector = Utils.vector(this.angle, this.speed);
      this.vx = vector[0];
      this.vy = vector[1];

      this.move();

      if (this.x >= config.width - size || this.x <= 0 + size) {
        this.angle = Utils.reflectDegrees(this.angle, 90);
      }
      if (this.y >= config.height - size || this.y <= 0 + size) {
        this.angle = Utils.reflectDegrees(this.angle, 0);
      }

      if (this.time > 240) {
        cast.destroyActorById(this.key);
      }

      //stage.drawRectFill('#f00000', this.x, this.y, 20, 20);
      stage.drawCircleFill(`rgba(255, 0, 0, ${this.speed / 4})`, this.x, this.y, size);
      // stage.drawText(`${Math.floor(this.x)}/${Math.floor(this.y)} - t:${this.time}`, this.x, this.y - 10);        

    },
    onDestroy: function () {
      this.active = false;
    },
  });
};


