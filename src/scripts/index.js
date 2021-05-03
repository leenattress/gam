import "../styles/index.scss";
import { Stage, Cast, Utils, Gamepad, Tweens } from './engine';

if (process.env.NODE_ENV === "development") {
  require("../index.html");
}

const debug = document.getElementById('debug');

const cast = new Cast();

const config = {
  width: 1280,
  height: 720
};

const gamepad = new Gamepad();
let joyPadFollower;
gamepad.on('connect', e => {
  console.log(`controller ${e.index} connected!`);
  joyPadFollower = cast.addActor({
    onInit: function () {
      this.x = 300;
      this.y = 300;
    },
    onUpdate: function () {
      this.step();
      let rectangleColor = [0.7, 0.7, 0.7, 1];
      stage.drawRectFill(rectangleColor, this.x - 15, this.y - 15, 60, 30);
      rectangleColor = [0.8, 0.8, 0.8, 1];
      stage.drawRectFill(rectangleColor, this.x + 40, this.y, 30, 20);
      rectangleColor = [0.6, 0.6, 0.6, 1];
      stage.drawRectFill(rectangleColor, this.x - 10, this.y-25, 10, 50);

    }
  });
});
gamepad.on('disconnect', e => {
  console.log(`controller ${e.index} disconnected!`);
  if (joyPadFollower) {
    cast.destroyActorById(joyPadFollower);
    joyPadFollower = null;
  };
});
gamepad.on('press', 'button_1', e => {
  if (joyPadFollower) {
    const { x, y } = cast.getActor(joyPadFollower);
    makeShootyBullet(x, y);
    console.log(joyPadFollower);
  }
});
gamepad.on('hold', 'stick_axis_left', e => {
  if (joyPadFollower) {
    const ship = cast.getActor(joyPadFollower);
    ship.setVector([e.value[0] * 5, e.value[1] * 5]);
    makeBoosterParticle(ship.x - 10, ship.y);
  }
});
gamepad.on('release', 'stick_axis_left', e => {
  if (joyPadFollower) {
    cast.getActor(joyPadFollower)
      .stop();
  }
});

const stage = new Stage({
  target: 'canvas',
  width: config.width,
  height: config.height,
  onFrame: frame,
  onMouseClick: mouseClick,
  onMouseMove: mouseMove
});

function frame() {
  cast.updateActors();
  debug.innerHTML = JSON.stringify({
    config,
    actors: Object.keys(cast.actors).length,
    gamepad: gamepad._events,
  }, null, 2);
};

function mouseClick(event) {
  if (event.button === 0) {
    Utils.times(Utils.getRandomInt(5) + 5)(i => {
      makeBouncyActorHere(event.x, event.y, 20);
    });
  } else {
    cast.destroyAllActors();
  }
}

function mouseMove(event) {
  let mouseFollow = cast.getActor(mouseFollower);
  if (mouseFollow) {
    mouseFollow.x = event.x;
    mouseFollow.y = event.y;
  }
  makeSmallParticle(event.x, event.y);
}

const mouseFollower = cast.addActor({
  onUpdate: function () {
    let rectangleColor = [0.2, 1.0, 0.5, 0.8];
    stage.drawRectFill(rectangleColor, this.x - 15, this.y - 15, 30, 30);
  }
});


const makeShootyBullet = (x, y) => {
  return cast.addActor({
    onInit: function () {
      this
        .setPosition(x + 40, y)
        .right(10)
        .destroyIn(120);
    },
    onUpdate: function () {
      this
        .tick()
        .checkShouldDestroy()
        .step();

      let rectangleColor = [1, 0, 1, 1];
      let size = 10;
      let half = size / 2;
      stage.drawRectFill(rectangleColor, this.x - half, this.y - half, size, size);
    }
  });
};


const makeBoosterParticle = (x, y) => {
  return cast.addActor({
    onInit: function () {
      this
        .setPosition(x, y + Utils.getRandomInt(5))
        .destroyIn(20);
    },
    onUpdate: function () {
      this
        .tick()
        .checkShouldDestroy()
        .step();
      let rectangleColor = [Utils.getRandomInt(100)/100, Utils.getRandomInt(100)/100, 0.2, 0.3];
      let half = this.destroyTimer / 2;
      let size = Math.max(1, this.destroyTimer);
      stage.drawRectFill(rectangleColor, this.x - half, this.y - half, size, size);
    }
  });
};


const makeSmallParticle = (x, y) => {
  const actorId = cast.addActor({
    onInit: function () {
      this
        .setPosition(x, y)
        .setAngle(Utils.getRandomInt(359))
        .destroyIn(30);
    },
    onUpdate: function () {

      this
        .tick()
        .setSpeed(Tweens.easeOutCubic(this.time, Utils.getRandomInt(16), 0, 60))
        .setVector(Utils.vector(this.angle, this.speed))
        .checkShouldDestroy()
        .step();

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
      this
        .setPosition(x, y)
        .setAngle(Utils.getRandomInt(359))
        .destroyIn(240);
    },
    onUpdate: function () {

      let life = 240;
      this
        .tick()
        .setSpeed(Tweens.easeOutCubic(this.time, 20, 0, life))
        .setVector(Utils.vector(this.angle, this.speed))
        .checkShouldDestroy()
        .step();

      if (this.x >= config.width - size || this.x <= 0 + size) {
        this.angle = Utils.reflectDegrees(this.angle, 90);
      }
      if (this.y >= config.height - size || this.y <= 0 + size) {
        this.angle = Utils.reflectDegrees(this.angle, 0);
      }

      let alpha = (this.speed / 100) * life;
      let rectangleColor = [1, 0.2, 0.1, alpha];
      let half = size / 2;
      stage.drawRectFill(rectangleColor, this.x - half, this.y - half, size, size);
    },
    onDestroy: function () {
      Utils.times(Utils.getRandomInt(5) + 5)(i => {
        makeSmallParticle(this.x, this.y);
      });
    },
  });
};


