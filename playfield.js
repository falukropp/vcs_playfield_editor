export const PlayfieldMode = {
    NORMAL: 0,
    REFLECTED: 1,
};

export const PlayfieldRegisterMode = {
    DRAW: 'DRAW',
    FILL: 'FILL',
    CLEAR: 'CLEAR',
};

export const PLAYFIELD_WIDTH = 40;

export class Playfield {
    #data;
    #mode;
    // TODO: Probably remove this? Must always be #data.length
    #height;
    #registerModes;

    constructor(height, mode = PlayfieldMode.NORMAL, data, registerModes) {
        if (registerModes && registerModes.length != 3) {
            throw new Error(`Weird registerModes! ${registerModes}`);
        }
        if (data && data.length != height) {
            throw new Error(`Weird data size, expected ${height}, was ${data.length}`);
        }

        this.#height = height;
        this.#mode = mode;
        this.#registerModes = registerModes ?? Array(3).fill(PlayfieldRegisterMode.DRAW);

        this.#data = data ? this.#copyData(data) : this.#createEmptyData();
    }

    copy() {
        return new Playfield(this.#height, this.mode, this.data, this.getRegisterModes())
    }

    #createEmptyData() {
        return Array(this.#height)
            .fill()
            .map(() => Array(PLAYFIELD_WIDTH).fill(0));
    }

    setPixel(x, y, value) {
        if (x < 0 || x >= PLAYFIELD_WIDTH || y < 0 || y >= this.#height) {
            return;
        }
        this.#updatePixels(x, y, value);
    }

    swapPixel(x, y, value) {
        if (x < 0 || x >= PLAYFIELD_WIDTH || y < 0 || y >= this.#height) {
            return value;
        }
        const oldValue = this.#data[y][x];
        this.#updatePixels(x, y, value);
        return oldValue;
    }

    /**
     *  Obviously not the absolut fastest way to go about this... But the number of pixels is only in the hundreds, so bother...
     */
    #updatePixels(x, y, value) {
        const row = this.#data[y];
        const filteredValue = this.#filterRegisterValue(x, value);
        row[x] = filteredValue;
        this.#setMirrorPixel(x, row, filteredValue);
    }

    #setMirrorPixel(x, row, value) {
        const secondX = this.#getMirrorCoord(x);
        row[secondX] = value;
    }

    #getMirrorCoord(x) {
        return this.#mode === PlayfieldMode.NORMAL ? (x + PLAYFIELD_WIDTH / 2) % PLAYFIELD_WIDTH : PLAYFIELD_WIDTH - 1 - x;
    }

    getPixel(x, y) {
        if (x < 0 || x >= PLAYFIELD_WIDTH || y < 0 || y > this.#height) {
            return 0;
        }
        return this.#data[y][x];
    }

    #filterRegisterValue(x, value) {
        if (x < 0 || x >= PLAYFIELD_WIDTH) {
            return value;
        }
        let xInLeftHalf = x < 20 ? x : this.#getMirrorCoord(x);
        let register;
        if (xInLeftHalf <= 3) {
            register = 0;
        } else if (xInLeftHalf <= 11) {
            register = 1;
        } else if (xInLeftHalf <= 19) {
            register = 2;
        }

        switch (this.#registerModes[register]) {
            case PlayfieldRegisterMode.DRAW:
                return value;
            case PlayfieldRegisterMode.FILL:
                return 1;
            case PlayfieldRegisterMode.CLEAR:
                return 0;
        }
    }

    #copyData(data) {
        return data.map((r) => [...r]);
    }

    get data() {
        return this.#copyData(this.#data);
    }

    set data(data) {
        if (data?.length != this.#height) {
            throw new Error(`Weird data size, expected ${this.#height}, was ${data?.length}`);
        }

        this.#data = this.#copyData(data);
    }


    get width() {
        return PLAYFIELD_WIDTH;
    }

    get mode() {
        return this.#mode;
    }

    set mode(newMode) {
        if (newMode !== PlayfieldMode.NORMAL && newMode !== PlayfieldMode.REFLECTED) {
            throw new Error(`Invalid mode selected ${newMode}`);
        }
        this.#mode = newMode;
        this.#redrawPixels();
    }

    get height() {
        return this.#height;
    }

    set height(newHeight) {
        if (newHeight != this.#height) {
            this.#height = newHeight;
            this.#data = this.#createEmptyData();
        }
    }

    setRegisterMode(register, mode) {
        if (register < 0 || register > 2) {
            throw new Error('Weird register ' + register);
        }
        if (mode !== PlayfieldRegisterMode.DRAW && mode !== PlayfieldRegisterMode.FILL && mode !== PlayfieldRegisterMode.CLEAR) {
            throw new Error('Weird registermode ' + mode);
        }

        this.#registerModes[register] = mode;
        this.#redrawPixels();
    }

    setRegisterModes(registerModes) {
        if (registerModes?.length != 3) {
            throw new Error(`Weird registerModes! ${registerModes}`);
        }
        registerModes.forEach((mode, register) => this.setRegisterMode(register, mode));
    }

    getRegisterModes() {
        return [...this.#registerModes];
    }

    #redrawPixels() {
        this.#data.forEach((r, y) => r.slice(0, 20).forEach((value, x) => this.#updatePixels(x, y, value)));
    }
}
