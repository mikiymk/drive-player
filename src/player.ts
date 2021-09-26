export class AudioPlayer {
  private readonly context: AudioContext;
  private node: AudioBufferSourceNode;

  private intervalID = 0;

  duration = 0;
  currentTime = 0;
  startAt = 0;
  stopAt = 0;
  isPaused = true;

  onSetDuration = (duration: number) => {};
  onSetCurrentTime = (currentTime: number) => {};
  onSetStartAt = (startAt: number) => {};
  onSetStopAt = (stopAt: number) => {};
  onSetPause = (isPaused: boolean) => {};

  onEnd = () => {};

  constructor(context: AudioContext) {
    this.context = context;
    this.node = this.context.createBufferSource();

    console.log("audio player");
  }

  setBuffer(buffer: AudioBuffer) {
    console.log("set buffer", buffer);

    this.setDuration(buffer.duration);
    this.node = this.context.createBufferSource();
    this.node.buffer = buffer;
    this.node.connect(this.context.destination);
  }

  private setDuration(duration: number) {
    console.log("set duration", duration);

    this.duration = duration;
    this.onSetDuration(duration);
  }

  private setCurrentTime(currentTime: number) {
    console.log("set current time", currentTime);

    this.currentTime = currentTime;
    this.onSetCurrentTime(currentTime);
  }

  private setStartAt(startAt: number) {
    console.log("set start at", startAt);

    this.startAt = startAt;
    this.onSetStartAt(startAt);
  }

  private setStopAt(stopAt: number) {
    console.log("set stop at", stopAt);

    this.stopAt = stopAt;
    this.onSetStopAt(stopAt);
  }

  private setPause(isPaused: boolean) {
    console.log("set pause", isPaused);

    this.isPaused = isPaused;
    this.onSetPause(isPaused);
  }

  private updateTime() {
    if (this.isPaused) {
      this.setCurrentTime(this.stopAt);
    } else {
      this.setCurrentTime(this.context.currentTime - this.startAt);
    }
  }

  start() {
    if (this.isPaused) {
      console.log("player start");

      this.setStartAt(this.currentTime);
      this.setStopAt(0);
      this.setPause(false);

      this.intervalID = window.setInterval(() => this.updateTime(), 250);

      this.node.start(this.context.currentTime, 0);
    }
  }

  stop() {
    if (!this.isPaused) {
      console.log("player stop");

      this.setStopAt(0);
      this.setPause(true);

      window.clearInterval(this.intervalID);

      this.node.stop(this.context.currentTime);
    }
  }

  play() {
    if (this.isPaused) {
      console.log("player play");

      this.setStartAt(this.context.currentTime - this.stopAt);
      this.setPause(false);

      this.intervalID = window.setInterval(() => this.updateTime(), 250);

      this.node.start(this.context.currentTime, this.stopAt);
    }
  }

  pause() {
    if (!this.isPaused) {
      console.log("player pause");

      this.setStopAt(this.context.currentTime - this.startAt);
      this.setPause(true);

      window.clearInterval(this.intervalID);

      this.node.stop(this.context.currentTime);
    }
  }

  seek(time: number) {
    if (this.isPaused) {
      console.log("player seek", time);

      this.setStopAt(time);
    } else {
      this.node.stop();
      this.node.start(this.context.currentTime, time);
    }
  }
}
