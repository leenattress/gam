function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function vector(angle, length) {
  length = typeof length !== 'undefined' ? length : 10;
  angle = angle * Math.PI / 180; // if you're using degrees instead of radians
  return [length * Math.cos(angle), length * Math.sin(angle)];
}
function ld_x(len, dir) { return Math.cos(dir) * len; }
function ld_y(len, dir) { return Math.sin(dir) * len; }
function pointAngle(cx, cy, ex, ey) { Math.atan2(cx - ex, cy - ey); }
function pointDistance(x1, y1, x2, y2) {
  x3 = Math.abs(x2 - x1);
  y3 = Math.abs(y2 - y1);
  return Math.sqrt((x3 * x3) + (y3 * y3));
}
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

function reflectDegrees(incidenceAngle, wallAngle) {
  return radiansToDegrees((2 * degreesToRadians(wallAngle)) - degreesToRadians(incidenceAngle));
}

const repeat = n => f => x => {
  if (n > 0)
    return repeat(n - 1)(f)(f(x));
  else
    return x;
};

// times :: Int -> (Int -> Int) -> Int 
const times = n => f =>
  repeat(n)(i => (f(i), i + 1))(0);

const xyToMemory = (x, y, width) => {
  return x + y * width
}
const memoryToXy = (memory, width) => {
  memory = memory << 0  // floor
  width = width << 0  // floor
  x = memory % width;    // % is the "modulo operator", the remainder of i / width;
  y = memory / width;    // where "/" is an integer division
}

function splice2(index, howmany) {
  if (index < 0) {
    index = this.length + index;
  };
  if (!howmany || howmany < 0) {
    howmany = 0;
  };
  var selection = this.slice(index, index + howmany);
  copyFrom2(
    this.slice(0, index)
      .concat(Array.prototype.slice.apply(arguments, [2]))
      .concat(this.slice(index + howmany)));
  return selection;
};

function copyFrom2(source) {
  for (var i = 0; i < source.length; i++) {
    this[i] = source[i];
  };
  this.length = source.length;
  return this;
};


const Utils = {
  uuidv4,
  getRandomInt,
  ld_x,
  ld_y,
  pointAngle,
  pointDistance,
  vector,
  degreesToRadians,
  radiansToDegrees,
  reflectDegrees,
  times,
  xyToMemory,
  memoryToXy,
  splice2 // Electric Boogaloo
};

export { Utils };