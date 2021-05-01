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
  return radians * (180/Math.PI);
}

function reflectDegrees(incidenceAngle, wallAngle) {       
  return radiansToDegrees((2 * degreesToRadians(wallAngle)) - degreesToRadians(incidenceAngle));  
}

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
  reflectDegrees
};

export { Utils };