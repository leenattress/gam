class Actor {
  constructor({ group = 'default', onInit, onUpdate, onDestroy }) {

    this.time = 0;

    this.group = group;
    this.x;
    this.y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.speed = 0;
    this.active = true;
    this.alpha = 1;

    this.init = onInit;
    this.update = onUpdate;
    this.destroy = onDestroy;

    this.init();
  }
  tick() {
    this.time += 1;
  }
  move() {
    if (this.active) {
      this.x += this.vx;
      this.y += this.vy;
    }
  }
}

export { Actor };