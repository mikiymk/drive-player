/**
 * 元の並びを維持したままランダム並び替えをする配列
 */
export class ShuffleArray implements Iterable<string> {
  private readonly _array: string[];
  private _indexArray: number[];

  constructor(array: string[], shuffled: boolean) {
    this._array = Array.from(array);
    this._indexArray = makeShuffledArray(this._array.length, shuffled);
  }

  /** シャッフル状態の切り替え */
  set shuffle(value: boolean) {
    this._indexArray = makeShuffledArray(this.length, value);
  }

  get length() {
    return this._array.length;
  }

  get(index: number): string {
    return this._array[this._indexArray[index] ?? 0] ?? "";
  }

  [Symbol.iterator](): ShuffleIterator {
    return new ShuffleIterator(this);
  }
}

/** ShuffleArray のイテレータ */
class ShuffleIterator implements Iterator<string, undefined> {
  private readonly _array: ShuffleArray;
  private _index = 0;

  constructor(array: ShuffleArray) {
    this._array = array;
  }

  next(): IteratorResult<string, undefined> {
    if (this._index < this._array.length) {
      return {
        done: false,
        value: this._array.get(this._index++),
      };
    } else {
      return {
        done: true,
        value: undefined,
      };
    }
  }
}

/** 0 <= n < length の配列を作る */
const makeArray = (length: number): number[] => {
  return Array.from({ length }).map((_, i) => i);
};

/** 0 <= n < limit の整数乱数 */
const random = (limit: number): number => {
  return Math.floor(Math.random() * limit);
};

/** Fisher–Yates shuffle */
const shuffle = (array: number[]): number[] => {
  const len = array.length;
  for (let i = len - 1; i > 0; i--) {
    const j = random(i + 1);

    [array[i], array[j]] = [array[j] ?? 0, array[i] ?? 0];
  }

  return array;
};

const makeShuffledArray = (length: number, shuffled: boolean) => {
  if (shuffled) {
    return shuffle(makeArray(length));
  } else {
    return makeArray(length);
  }
};
