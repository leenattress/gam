import { Stage, Cast, Utils, Gamepad, Tweens, Audio, TV, Sprites } from 'gam-engine';

if (process.env.NODE_ENV === "development") {
  require("../index.html");
}

const debug = document.getElementById('debug');
const cast = new Cast();
const audio = new Audio();
const gamepad = new Gamepad();
const sprites = new Sprites();

const stage = new Stage({
  target: 'canvas',
  width: TV.width,
  height: TV.height,
  refreshRate: TV.refreshRate,
  update: update,
  init: init,
  onMouseClick: mouseClick,
  onMouseMove: mouseMove
});

// test image provided by http://bevouliin.com/
//stage.loadTexture('test', '/sprites/airship.png');

let joyPadFollower;
let mouseFollower;

async function init() {

  audio.add('pew', '/sounds/pew.wav');
  audio.add('bounce', '/sounds/bounce.wav');
  audio.add('splode', '/sounds/splode.wav');

  await sprites.add('bg1', '/sprites/full-screen-db32.png');


  mouseFollower = cast.addActor({
    onInit: function () {
      this
        .setPosition(200, 100)
        .setHitbox(0, 0, 30, 30);
    },
    onUpdate: function () {
      stage.rectFill(this.x - 15, this.y - 15, 30, 30, 27);
    }
  });

  gamepad.on('connect', e => {
    console.log(`controller ${e.index} connected!`);
    joyPadFollower = cast.addActor({
      onInit: function () {
        this
          .setPosition(300, 300)
          .setHitbox(0, 0, 60, 30);
      },
      onUpdate: function () {
        this.step();
        stage.rectFill(this.x - 15, this.y - 15, 60, 30, 20);
        stage.rectFill(this.x + 40, this.y, 30, 20, 20);
        stage.rectFill(this.x - 10, this.y - 25, 10, 50, 20);
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
      audio.play('pew');
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
}

function checkIfBelongsToMandelbrotSet(x, y) {
  var realComponentOfResult = x;
  var imaginaryComponentOfResult = y;
  var maxIterations = 100;
  for (var i = 0; i < maxIterations; i++) {
    var tempRealComponent = realComponentOfResult * realComponentOfResult
      - imaginaryComponentOfResult * imaginaryComponentOfResult
      + x;
    var tempImaginaryComponent = 2 * realComponentOfResult * imaginaryComponentOfResult
      + y;
    realComponentOfResult = tempRealComponent;
    imaginaryComponentOfResult = tempImaginaryComponent;

    // Return a number as a percentage
    if (realComponentOfResult * imaginaryComponentOfResult > 5)
      return (i / maxIterations * 100);
  }
  return 0;   // Return zero if in set        
}


function update() {
  cast.updateActors();

  if (stage) {
    var magnificationFactor = 200;
    var panX = 2;
    var panY = 1.5;
    for (var x = 0; x < config.width; x++) {
      for (var y = 0; y < config.height; y++) {
        var belongsToSet =
          checkIfBelongsToMandelbrotSet(x / magnificationFactor - panX,
            y / magnificationFactor - panY);
        if (belongsToSet) {
          stage.pset(22, x, y);
        }
      }
    }
  }



  if (joyPadFollower) {
    if (
      cast.collide(
        cast.getActor(joyPadFollower),
        cast.getActor(mouseFollower)
      )
    ) {
      console.log('COLLIDE');

      audio.play('splode');
      Utils.times(Utils.getRandomInt(5) + 5)(i => {
        makeSmallParticle(this.x, this.y);
      });

    }
  }
  // stage.drawImage(
  //   'test',
  //   128,
  //   128,
  //   0, 0, 256, 256,
  //   100, 100, 128, 128);

  debug.innerHTML = JSON.stringify({
    actors: Object.keys(cast.actors).length,
    audio: audio,
    gamepad: gamepad._events,
  }, null, 2);
};

function mouseClick(event) {
  if (event.button === 0) {
    Utils.times(Utils.getRandomInt(5) + 5)(i => {
      makeBouncyActorHere(event.x, event.y, 20);
    });
    audio.play('pew');
  } else {
    console.log('🐭', event);
    cast.destroyAllActors();
  }
}

function mouseMove(event) {
  const moveFollower = cast.getActor(mouseFollower);
  if (moveFollower) {
    moveFollower.setPosition(event.x, event.y);
  }
  makeSmallParticle(event.x, event.y);
}

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
      stage.rectFill(rectangleColor, this.x - half, this.y - half, size, size);
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
      let rectangleColor = [Utils.getRandomInt(100) / 100, Utils.getRandomInt(100) / 100, 0.2, 0.3];
      let half = this.destroyTimer / 2;
      let size = Math.max(1, this.destroyTimer);
      stage.rectFill(rectangleColor, this.x - half, this.y - half, size, size);
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

      let half = this.speed / 2;
      let size = Math.max(1, this.speed);
      stage.rectFill(this.x - half, this.y - half, size, size, 8);
    }
  });
};

const makeBouncyActorHere = (x, y, size) => {
  cast.addActor({
    onInit: function () {
      this.destroyTime = Utils.getRandomInt(40) + 200;
      this
        .setPosition(x, y)
        .setAngle(Utils.getRandomInt(359))
        .destroyIn(this.destroyTime);

    },
    onUpdate: function () {

      this
        .tick()
        .setSpeed(Tweens.easeOutCubic(this.time, 20, 0, this.destroyTime))
        .setVector(Utils.vector(this.angle, this.speed))
        .checkShouldDestroy()
        .step();

      if (this.x >= stage.width - size || this.x <= 0 + size) {
        this.angle = Utils.reflectDegrees(this.angle, 90);
        audio.play('bounce');
      }
      if (this.y >= stage.height - size || this.y <= 0 + size) {
        this.angle = Utils.reflectDegrees(this.angle, 0);
        audio.play('bounce');
      }

      let half = size / 2;
      stage.rectFill(this.x - half, this.y - half, size, size, 18);
    },
    onDestroy: function () {
      audio.play('splode');
      Utils.times(Utils.getRandomInt(5) + 5)(i => {
        makeSmallParticle(this.x, this.y);
      });
    },
  });
};


