

class Audio {

  constructor() {
    this.sounds = {};
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      alert('Web Audio API is not supported in this browser');
    }

  }

  add(name, url) {
    if (this.context) {
      let request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      // Decode asynchronously
      request.onload = () => {
        this.context.decodeAudioData(request.response, (buffer) => {
          this.sounds[name] = buffer;
        }, this.onError);
      };
      request.send();
    }
  }
  onError(error) {
    console.log(error);
  }
  play(name) {
    if (this.sounds[name]) {
      let source = this.context.createBufferSource(); // creates a sound source
      source.buffer = this.sounds[name];                    // tell the source which sound to play
      source.connect(this.context.destination);       // connect the source to the context's destination (the speakers)
      source.start(0);
    }
  }

}

export { Audio };