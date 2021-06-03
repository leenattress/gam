
# Untitled Game Engine

An extremely simple game engine for the browser with an emphasis on retro games and prototyping.


## Features

- Extremely simple execution and simple API
- Prototype very quickly
- WebGL GPU accellerated canvas
- Virtual `framebuffer` to draw graphics
- Actors that can interact with each other
- Collisions
- Audio engine for background music and sound effects
- Load images as sprites

  
## Demos

- Sprites
- Mandlebrot
- Mouse
- Sound
- Gamepad

## Authors

- [@leenattress](https://github.com/leenattress)

  
## Installation 

Include the compiled script as a module in your HTML page like this

```js 
<script type="module">

  // Insert our game cartridge
  import { Game } from '../lib/gam.esm.js';

</script>
```
    
## Usage

Provide a canvas element for us to draw into:

```html
<canvas
  id="canvas"
></canvas>
```

Create functions for each of the game events and power on the virtual console like this

```javascript

  // ROM data
  function init() {
    // Called when the game starts
  }
  function update() {
    // Called every frame
  }
  function mouseClick(event) {
    // Called when the mouse is clicked
  }
  function mouseMove(event) {
    // Called when the mouse moves
  }

  // Turn the console on
  Game.powerOn({
    target: 'canvas',
    init,
    update,
    mouseClick,
    mouseMove
  });

```

# API

## Game

The Game object as imported into your page:

- `Game.stage`
- `Game.actors`
- `Game.audio`
- `Game.sprites`
- `Game.gamepad`
- `Game.tweens`
- `Game.utils`


## Pallete

We use [DawnBringer's 32 Col Palette V1.0](http://pixeljoint.com/forum/forum_posts.asp?TID=16247) because it's incredibly beautiful.

Each of the colours is named in an enum and can be imported like this:

```js
import { Game, PAL } from '../lib/gam.esm.js';
```

There are 32 colours.

Now we can get to the colours like this:

```js
PAL.RED
```

## Stage

When you power on the console, you provide the `id` of a canvas for us to use.

Clicking events on this canvas are handled for us using `Mouse Events` (see examples)

We can clear the stage with a colour every update:

```js
  function update() {
    // Called every frame
    Game.stage.cls(PAL.RED)

    // ... your game logic
  }
```

## Actors

Actors are the individual entities your game will be made from, for example, the player, enemies, bullets, explosions or anything else that you want to move, see or collide.

They have an extremely simple chaining API that makes them easy to use and understand.

### Actor Properties

Inside the init, update and destroy functions, you can access `this` which contains the actor details.

- `this.tick()` - Increments the internal timer for this actor
- `this.setHitbox(x, y, width, height)` - Set the hitbox for later collision detetion
- `this.setPosition(x, y)` - Set the position of the actor, this can be a `float`
- `this.setAngle(angle)` - Set the `vector` using degrees
- `this.setSpeed(speed)` - Set the `speed` in pixels, this can be a `float`
- `this.setVector(vector)` - Set the vector (direction). `vector` is an array of 2 numbers like `[1,1]`
- `this.step()` - Move the actor in accordance with its vector 
- `this.stop()` - Stop all movement 
- `this.destroyIn(frames)` - Set the timer for the actor to destroy itself in _n_ `frames`
- `this.checkShouldDestroy()` - Marks actor to be destroyed if the timer is up as set with `destroyIn` 

To create an actor:

```js
Game.actors.addActor({
  onInit: function () {
    // Triggers once when the actor is created, you can access 'this' here
  },
  onUpdate: function () {
    // Triggers when an update is requested, you can access 'this' here
  },
  onDestroy: function () {
    // Triggers once when the actor is destroyed, you can access 'this' here
  },
});
```

To remove an actor:

```js
actorId = Game.actors.addActor(...); // addActor returns a unique id
Game.actors.destroyActorById(actorId) // use the id to remove the actor
```

To have the actor destroy itself after 60 frames:

```js
Game.actors.addActor({
  onInit: function () {
    this.destroyIn(60);
  },
  onUpdate: function () {
    this
      .tick()
      .checkShouldDestroy();
  },
  onDestroy: function () {
    console.log(`Actor was destroyed`, this)
  },
});
```

To update all actors in every frame (in the game update function):

```js
function update() {
  Game.actors.updateActors()
}
```

## Audio

Audio is loaded from a server during the `init` function, usually from an `mp3` or `wav` file.

We use `Game.audio.add`

```js
async function init() {
  await Game.audio.add('pew', '/sounds/pew.wav');
}
```

You might notice that I used `async/await` here. This means that the audio will be fully loaded before the game starts.

We can then trigger these audio files as we please using `Game.audio.play`

```js
Game.audio.play('pew');
```

## Sprites

Sprites are not limited to 8x8 or in fact any other size. A sprite is loaded in via an image. This image can contain any number of sprites or animations such as a sprite sheet.

We can load a sprite in the init function like this:

```js
    async function init() {
      await Game.sprites.add('test', '/sprites/full-screen-db32.png');
      await Game.sprites.add('sonic', '/sprites/sonic.png');
      await Game.sprites.add('sonic2', '/sprites/sonic2.png');
      await Game.sprites.add('sonic3', '/sprites/sonic3.png');
      await Game.sprites.add('sonic-waterfall', '/sprites/sonic-waterfall.png');
    }
```

Notice once again we used `async/await`. This ensures that we load our sprites properly and completely before the game starts.

Sprites loaded this way are all converted into the db32 pallete by using a crude `closest colour` function. This means that if you created your images in the db32 pallete then your results will be good, even if one or two colours are not quite perfect in your source image. Photographs or wildly different pallets, may not faire so well.

At this point the game engine does not support dithering or any sort of halftone for these loaded images. The loader is deliberately as simple as possible.

## Gamepad

⚠ Still under development, docs tbc

## Utils

We include a few helper functions under `Game.utils` to help with some frequently used game trigonometry.

- `Game.utils.vector(angle, length)`
  - Given an `angle` in degrees, and a `length` return a vector `[n, n]`
- `Game.utils.pointAngle(x1, y1, x2, y2)`
  - Given the `x` and `y` for 2 points, return the `angle`.
- `Game.utils.pointDistance(x1, y1, x2, y2)`
  - Given the `x` and `y` for 2 points, return the `distance`.
- `Game.utils.reflectDegrees(movementAngle, wallAngle)`
  - Given the `movementAngle` and the `wallAngle` return the reflection (bounce) `angle`
- `Game.utils.getRandomInt(max)`
  - Gets an integer from `0` to `max`
  
