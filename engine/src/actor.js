import { Utils } from './utils';

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

export { Actor };