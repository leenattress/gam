import { rgbpal } from './tv'

class Sprites {

  constructor() {
    this.sprites = {};
  }

  async getImageData(imageUrl) {
    let img;
    const imageLoadPromise = new Promise(resolve => {
      img = new Image();
      img.onload = resolve;
      img.src = imageUrl;
    });

    await imageLoadPromise;
    return img;
  }

  // return nearest color from array
  nearestColor(palleteRGB, colorRGB) {
    var lowest = Number.POSITIVE_INFINITY;
    var tmp;
    let index = 0;
    palleteRGB.forEach((el, i) => {
      tmp = this.distance(colorRGB, el)
      if (tmp < lowest) {
        lowest = tmp;
        index = i;
      };
    })
    return index;
  }
  distance(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
  }

  async getPixelData(img) {

    //const canvas = document.createElement('canvas');
    const canvas = document.getElementById('debug');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    const imageData = context.getImageData(0, 0, img.width, img.height).data;
    console.log(imageData)
    let imageRgbData = [];
    for (var i = 0; i < imageData.length; i += 4) {
      const rgbPixel = [
        imageData[i] = imageData[i] / 255,     // red
        imageData[i + 1] = imageData[i + 1] / 255, // green
        imageData[i + 2] = imageData[i + 2] / 255, // blue
        imageData[i + 3] = 1 // no transparent
      ]

      imageRgbData.push(this.nearestColor(rgbpal, rgbPixel));
    }
    return {
      data: imageRgbData,
      width: img.width,
      height: img.height
    };
  }

  async loadPng(src) {

    // load image
    const imageObj = await this.getImageData(src);

    // get pixel data
    const imageData = await this.getPixelData(imageObj);

    return imageData;
  }
  async add(name, path) {
    this.sprites[name] = await this.loadPng(path);
    console.log('🎨', this.get(name));
  }
  get(name) { return this.sprites[name]; }
}

export { Sprites };