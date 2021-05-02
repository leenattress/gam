# DIY Minimalist WebGL Game Engine

A javascript game engine with simplicity in mind. Only extremely basic features are present.

### Installation

```
npm install
```

### Start Dev Server

```
npm start
```

### Build Prod Version

```
npm run build
```

### Features:

- WebGl canvas for accellerated gameplay
- SHAPES! - rectangles now available!
- ES6 Support via [babel](https://babeljs.io/) (v7)
- JavaScript Linting via [eslint-loader](https://github.com/MoOx/eslint-loader)
- SASS Support (for area around the game canvas) via [sass-loader](https://github.com/jtangelder/sass-loader)
- Autoprefixing of browserspecific CSS rules via [postcss](https://postcss.org/) and [autoprefixer](https://github.com/postcss/autoprefixer)
- Style Linting via [stylelint](https://stylelint.io/)

When you run `npm run build` we use the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to move the css to a separate file. The css file gets included in the head of the `index.html`.

### Roadmap

- Graphics
  - Images
    - 🔲 Scale
    - 🔲 Rotate
    - 🔲 Transparency
    - 🔲 Skew
  - Simple primitives
    - ✅ Rectangle
    - 🔲 Line
    - 🔲 Circle
  - Text
    - 🔲 Font
    - 🔲 Size
    - 🔲 Color
- Sound
  - 🔲 Samples
  - 🔲 Looping
  - 🔲 Volume
- Input
  - ✅ Mouse
  - 🔲 Keyboard
  - 🔲 Joypad
  - 🔲 Mobile
- Helpers
  - 🔲 Collisions
  - Behaviours
    - 🔲 Top down
    - 🔲 Platformer
    - 🔲 Shoot-em-up
    - 🔲 etc...

