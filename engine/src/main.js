import { TV, PAL, hexpal, rgbpal } from "./tv";
import { Cast } from "./cast";
//  import { Actor } from "./actor";
import { Stage } from './stage';
import { Audio } from './audio';
import { Sprites } from './sprites';

import { Utils } from "./utils";
import { Gamepad } from './gamepad';
import { Tweens } from './tweens';

class GameEngine {
  constructor() {
    this.stage;
    this.state = {};
    this.actors = new Cast();
    this.audio = new Audio();
    this.sprites = new Sprites();
    this.gamepad = new Gamepad();
    this.tweens = Tweens;
    this.utils = Utils;
    console.log('🦄 engine started')
  }
  powerOn({ target, init, update, mouseClick, mouseMove }) {
    this.stage = new Stage({
      target,
      width: TV.width,
      height: TV.height,
      refreshRate: TV.refreshRate,
      onMouseClick: mouseClick,
      onMouseMove: mouseMove,
    });
    if (typeof init === 'function') {
      init();
    }
    if (typeof update === 'function') {
      this.stage.frame = update;
    }

  }
}

const Game = new GameEngine();

export { Game, TV, PAL, hexpal, rgbpal }

