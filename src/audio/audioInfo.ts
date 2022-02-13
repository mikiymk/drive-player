import { parseBuffer } from "music-metadata-browser";
import { readTagFromData } from "tag/index";

class AudioInfo {
  static getEmptyInfo() {
    return new AudioInfo();
  }

  /**
   * @param data オーディオファイルデータ
   * @returns データから読み取ったオーディオ情報
   */
  static async getInfo(data?: ArrayBuffer) {
    if (data === undefined) {
      return new AudioInfo();
    }

    const tag = readTagFromData(data);
    console.log(tag);

    try {
      const metadata = await parseBuffer(new Uint8Array(data));
      console.log(metadata);
    } catch (error) {
      console.log("music metadata error");
      console.log(error);
    }

    let title;
    let artist;
    let album;
    let jacket;

    if (tag.v2 !== undefined) {
      title = tag.v2.tags.find(({ id }) => id === "TIT2")?.data?.text;
      artist = tag.v2.tags.find(({ id }) => id === "TPE1")?.data?.text;
      album = tag.v2.tags.find(({ id }) => id === "TALB")?.data?.text;
      const apic = tag.v2.tags.find(({ id }) => id === "APIC")?.data;
      if (apic !== null && apic !== undefined) {
        jacket = URL.createObjectURL(
          new Blob([apic.pictureData], { type: apic.mimetype })
        );
      }
    } else if (tag.v1 !== undefined) {
      title = tag.v1.title;
      artist = tag.v1.artist;
      album = tag.v1.album;
    }

    console.log(`TITLE : ${title}`);
    console.log(`ARTIST: ${artist}`);
    console.log(`ALBUM : ${album}`);
    console.log(`JACKET: ${jacket}`);

    return new AudioInfo(title, artist, album, jacket);
  }

  readonly title: string;
  readonly artist: string;
  readonly album: string;
  readonly jacket: string;

  private constructor(
    title?: string,
    artist?: string,
    album?: string,
    jacket?: string
  ) {
    this.title = title ?? "";
    this.artist = artist ?? "";
    this.album = album ?? "";
    this.jacket = jacket ?? "";
  }

  /**
   * 消す前に呼ぶ
   */
  close() {
    if (this.jacket !== undefined) {
      URL.revokeObjectURL(this.jacket);
    }
  }
}

export default AudioInfo;
