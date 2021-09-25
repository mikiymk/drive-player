import { downloadFile } from "./api";
import { File } from "./type";

const BUFFER_MAX_SIZE = 5;

export class PlayingList {
  context: AudioContext;

  list: File[];
  index: number = 0;

  downloadIDs: string[] = [];
  buffers: AudioBuffer[] = [];
  history: File[] = [];
  isLoop: boolean = false;

  isDownloading: boolean = false;

  getBufferCallBack: ((buffer: AudioBuffer) => void) | null = null;

  constructor(context: AudioContext, files: File[], index: number) {
    this.context = context;
    this.list = files;

    this.setIndex(index);
  }

  getBuffer(callback: (buffer: AudioBuffer) => void) {
    const buffer = this.buffers.shift();
    if (buffer !== undefined) {
      callback(buffer);
    } else {
      this.getBufferCallBack = (buffer: AudioBuffer) => {
        callback(buffer);
        this.getBufferCallBack = null;
      };
    }
  }

  setIndex(index: number) {
    this.index = this.calcIndex(index, 0);
    this.downloadIDs = [
      this.list[this.index].id,
      this.list[this.calcIndex(index, 1)].id,
    ];
    this.buffers = [];
    this.noticeDownload();
  }

  addDownloadID(id: string) {
    this.downloadIDs.push(id);
    this.noticeDownload();
  }

  noticeDownload() {
    if (this.downloadIDs.length === 0) {
      return;
    } else if (this.buffers.length > BUFFER_MAX_SIZE) {
      return;
    } else if (this.isDownloading) {
      return;
    } else {
      this.isDownloading = true;
      this.downloadBuffer();
    }
  }

  async downloadBuffer() {
    const id = this.downloadIDs.shift();
    if (id === undefined) {
      return;
    }
    const buffer = await this.download(id);
    if (this.getBufferCallBack) {
      this.getBufferCallBack(buffer);
    } else {
      this.buffers.push(buffer);
    }

    this.isDownloading = false;
    this.noticeDownload();
  }

  async download(id: string) {
    const fileData = await downloadFile(id);
    const dataArray = Array.from(fileData).map(c => c.charCodeAt(0));
    const buffer = new Uint8Array(dataArray).buffer;
    return await this.context.decodeAudioData(buffer);
  }

  calcIndex(index: number, move: number): number {
    if (this.isLoop) {
      return (index + move) % this.list.length;
    } else {
      return Math.max(0, Math.min(this.list.length - 1, index + move));
    }
  }
}
