import { Utils } from "./utils";
import { Actor } from "./actor";

class Cast {
  constructor() {
    this.actors = {};
  }

  getActor(actorId) {
    if (this.actors[actorId]) {
      return this.actors[actorId];
    }
  }

  addActor(actorConfig) {
    const actor = new Actor(actorConfig);
    actor.init();
    actor.key = actorConfig.id || Utils.uuidv4();
    this.actors[actor.key] = actor;
    return actor.key;
  }

  destroyActor(actor) {
    if (typeof actor.destroy === "function") {
      actor.destroy();
    }
    delete this.actors[actor.key];
  }

  destroyActorById(actorId) {
    if (this.actors[actorId]) {
      this.destroyActor(this.actors[actorId]);
    }
  }

  destroyAllActors() {
    this.actors = {};
  }

  updateActors() {
    if (this.actors) {
      for (const [key, actor] of Object.entries(this.actors)) {
        if (actor.destroyMe) {
          this.destroyActor(this.actors[actor.key]);
        } else {
          actor.update();
        }
      }
    }
  }

  getHitbox(actor) {
    return {
      x: actor.x + actor.hitbox.x,
      y: actor.y + actor.hitbox.y,
      width: actor.hitbox.width,
      height: actor.hitbox.height
    };
  }

  collide(actor1, actor2) {
    let returnValue = false;
    if (actor1.hitbox && actor2.hitbox) {
      var rect1 = this.getHitbox(actor1);
      var rect2 = this.getHitbox(actor2);
      if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
        returnValue = true;
      }
    }
    return returnValue;
  }

  drawActors() {
    if (this.actors) {
      for (const [key, actor] of Object.entries(this.actors)) {
        actor.draw();
      }
    }
  }
}

export { Cast };
