export const PlayfieldMode = {
  NORMAL: 0,
  REFLECTED: 1,
};

export class Playfield {
  #data;
  #mode;
  #width;
  #height;

  constructor(height, width = 40, mode = PlayfieldMode.NORMAL) {
    this.#height = height;
    this.#width = width;
    this.#mode = mode;

    this.#data = Array(height)
      .fill()
      .map(() => Array(width).fill(0));
  }

  setPixel(x, y, value) {
    if (x < 0 || x > this.#width || y < 0 || y > this.#height) {
      return;
    }
    this.#updatePixels(x, y, value);
  }

  swapPixel(x, y, value) {
    if (x < 0 || x > this.#width || y < 0 || y > this.#height) {
      return value;
    }
    const oldValue = this.#data[y][x];
    this.#updatePixels(x, y, value);
    return oldValue;
  }

  /**
   *  Obviously not the absolut fastest way to go about this... But the number of pixels is in the hundreds, so bother...
   */
  #updatePixels(x, y, value) {
    const row = this.#data[y];
    row[x] = value;
    this.#setMirrorPixel(x, row, value);
  }

  #setMirrorPixel(x, row, value) {
    const secondX = this.#mode === PlayfieldMode.NORMAL ? (x + this.#width / 2) % this.#width : this.#width - 1 - x;
    row[secondX] = value;
  }

  getPixel(x, y) {
    if (x < 0 || x > this.#width || y < 0 || y > this.#height) {
      return 0;
    }
    return this.#data[y][x];
  }

  get data() {
    return this.#data.map((r) => [...r]);
  }

  get width() {
    return this.#width;
  }

  get mode() {
    return this.#mode;
  }

  set mode(newMode) {
    if (newMode !== PlayfieldMode.NORMAL && newMode !== PlayfieldMode.REFLECTED) {
      throw new Error(`Invalid mode selected ${newMode}`);
    }
    this.#mode = newMode;
    this.#data.forEach((r) => r.forEach((value, x) => this.#setMirrorPixel(x, r, value)));
  }

  get height() {
    return this.#height;
  }
}
