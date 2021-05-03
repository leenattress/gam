import { Actor, Utils } from ".";

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

  drawActors() {
    if (this.actors) {
      for (const [key, actor] of Object.entries(this.actors)) {
        actor.draw();
      }
    }
  }
}

export { Cast };
