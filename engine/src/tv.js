const hexToGlRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16) / 256,
    parseInt(result[2], 16) / 256,
    parseInt(result[3], 16) / 256,
    1
  ] : null;
}

const TV = {
  width: 320,
  height: 240,
  refreshRate: 60
};

// DB-32 - Thankyou DawnBringer!
// https://github.com/geoffb/dawnbringer-palettes
const hexpal = [
  '#000000', //  0 black
  '#222034', //  1 steel_grey
  '#45283c', //  2 livid_purple
  '#663931', //  3 buccanneer_brown
  '#8f563b', //  4 bronze
  '#df7126', //  5 cinnamon
  '#d9a066', //  6 gold
  '#eec39a', //  7 sand
  '#fbf236', //  8 sunshine
  '#99e550', //  9 mint
  '#6abe30', // 10 lawn
  '#37946e', // 11 teal
  '#4b692f', // 12 olive
  '#524b24', // 13 woodland
  '#323c39', // 14 deep_ocean
  '#3f3f74', // 15 storm_blue
  '#306082', // 16 calypso_blue
  '#5b6ee1', // 17 royal_blue
  '#639bff', // 18 malibu_blue
  '#5fcde4', // 19 turquoise_blue
  '#cbdbfc', // 20 baby_blue
  '#ffffff', // 21 white
  '#9badb7', // 22 gull_gray
  '#847e87', // 23 purple_gray
  '#696a6a', // 24 corduroy_gray
  '#595652', // 25 chicago_gray
  '#76428a', // 26 deluxe_purple
  '#ac3232', // 27 mojo_red
  '#d95763', // 28 roman_pink
  '#d77bba', // 29 orchid_pink
  '#8f974a', // 30 sycamore_green
  '#8a6f30'  // 31 pesto_green
];

const rgbpal = hexpal.map((hex) => {
  return hexToGlRgb(hex);
});

const PAL = 
{
  'BLACK': 0,
  'WHITE': 21,
  'RED': 27
}

const vertexShader = `
attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 vColor;
uniform vec2 uResolution;

void main() {
  vec2 zeroToOne = aPosition / uResolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  // x and y position in screen space
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  vColor = aColor;
  gl_PointSize = 1.0;
}
`;

const fragmentShader = `
precision mediump float;

varying vec3 vColor;

void main() {
  gl_FragColor = vec4( vColor, 1.0 );
}
`

export { TV, PAL, hexpal, rgbpal, vertexShader, fragmentShader };
