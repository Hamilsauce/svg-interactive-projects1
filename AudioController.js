export class AudioController {
  constructor() {
    this.played = false;
    this.playing = false;

    this.ctx = new AudioContext();
    this.osc = this.ctx.createOscillator();

    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0.5;
    this.osc.connect(this.gain)
    this.controllers = [];

    this.gainstash = []
    console.log(this);
  }

  updateGains() {
    const val = 0.76 / this.gainstash.length
    this.gainstash.forEach((x, i) => {
      x.gain.exponentialRampToValueAtTime(val, this.ctx.currentTime + 0.05);
      // x.gain.value = val
      // x.disconnect()
    });
  }


  attachOscillator(obj) {
    const ctx = this.ctx
    obj.audio = obj.audio ? obj.audio  : {}
    obj.audio.oscillator = ctx.createOscillator({ type: 'sawtooth' })
    obj.audio.oscillator.type = 'triangle'
    obj.audio.gain = ctx.createGain()
    obj.audio.oscillator.connect(obj.audio.gain);

    obj.audio.oscillator.frequency.value = obj.frequency || 50 //* 2
    obj.audio.playing = false;

    this.gainstash.push(obj.audio.gain)
    this.updateGains()
    obj.audio.oscillator.start(ctx.currentTime);
    obj.audio.oscillator.connect(obj.audio.gain)
    obj.audio.play = () => {
      obj.audio.gain.connect(ctx.destination);
    }
    obj.audio.stop = () => {
      // obj.audio.gain.gain.value = 0
      // obj.audio.gain.setValueAtTime(obj.audio.gain.value, ctx.currentTime);
      obj.audio.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

    }
    // obj.audio.stop = () => obj.audio.gain.disconnect();
  }

  removeGain(gain) {
    // gain.gain.value = 0
    // gain.disconnect();

    // Important! Setting a scheduled parameter value
    // gain.gain.setValueAtTime(gain.gain.value, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);
    // gain.gain.setTargetAtTime(0, context.currentTime, 0.015);

    this.gainstash = this.gainstash.filter(_ => _ !== gain)
    console.log('gain', gain)
    this.updateGains()

  }

  stop(gain) {
    if (this.playing) {
      gain.disconnect();
      this.played = true;
      this.playing = false;
    }
  }

  changeNote(note, frequency) {
    this.osc.frequency.value = frequency;
    if (this.played) {
      this.played = false;
      this.playing = true;
      return this.gain.connect(this.ctx.destination);
    }

    if (this.playing) return 0;

    this.osc.start(this.ctx.currentTime);
    this.gain.connect(this.ctx.destination);

    this.playing = true;
  }
}
