import "../styles/index.scss";
import { Stage, Cast, Utils } from './game';
import { easeOutCubic } from './tween';

if (process.env.NODE_ENV === "development") {
  require("../index.html");
}

const config = {
  width: 800,
  height: 480
};

const cast = new Cast();

const stage = new Stage({
  target: 'canvas',
  width: config.width,
  height: config.height,
  onFrame: () => {
    cast.updateActors();
  },
  onMouseClick: (event) => {
    if (event.button === 0) {
      let i;
      for (i = 0; i < (Utils.getRandomInt(5) + 5); i++) {
        makeBouncyActorHere(event.x, event.y, 20);
      };
    } else {
      cast.destroyAllActors();
    }
  },
  onMouseMove: (event) => {
    let mouseFollow = cast.getActor(mouseFollower);
    if (mouseFollow) {
      mouseFollow.x = event.x;
      mouseFollow.y = event.y;
    }
    makeSmallParticle(event.x, event.y);
  }
});

const mouseFollower = cast.addActor({
  onUpdate: function () {
    let rectangleColor = [0.2, 1.0, 0.5, 0.8];
    stage.drawRectFill(rectangleColor, this.x - 15, this.y - 15, 30, 30);
    //stage.drawRectFill(rectangleColor, 200, 200, 80, 80);
  }
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

      let rectangleColor = [0.2, 0.2, 1, 0.8];
      let half = this.speed / 2;
      let size = Math.max(1, this.speed);
      stage.drawRectFill(rectangleColor, this.x - half, this.y - half, size, size);
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

      let life = 240;
      this.tick();

      this.speed = easeOutCubic(this.time, 20, 0, life);

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

      let alpha = (this.speed / 100) * life;
      let rectangleColor = [1, 0.2, 0.1, alpha];
      let half = size / 2;
      stage.drawRectFill(rectangleColor, this.x - half, this.y - half, size, size);
    },
    onDestroy: function () {
      this.active = false;
    },
  });
};


