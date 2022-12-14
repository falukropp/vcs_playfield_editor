export class VCSData {
    #includeRegisters;
    #gameData;
    #textarea;

    constructor(document, gameData) {
        this.#textarea = document.getElementById('vcs_data');
        this.#gameData = gameData;
        this.#includeRegisters = Array(3).fill(true);

        document.getElementById('updateData').addEventListener('click', () => this.updateFromGameData());
        document.getElementById('include_pf0').addEventListener('change', (e) => this.setIncludeRegister(0, e.target.checked));
        document.getElementById('include_pf1').addEventListener('change', (e) => this.setIncludeRegister(1, e.target.checked));
        document.getElementById('include_pf2').addEventListener('change', (e) => this.setIncludeRegister(2, e.target.checked));

    }

    setIncludeRegister(register, include) {
        if (register < 0 || register > 2) {
            throw new Error('Weird register ' + register);
        }

        this.#includeRegisters[register] = !!include;
    }

    updateFromGameData() {
        let text = '';
        text += this.#gameData.getAllPaletteData().map(this.#updateFromPlayfield, this).join(`\n`)
        text += '\n# Map\n'
        text += this.#gameData.getMap().map(id => `#%` + this.#getPaddedByte(id)).join(`\n`)

        this.#textarea.value = text
    }

    #getPaddedByte(num) {
        return num.toString(2).padStart(8, '0');
    }

    #updateFromPlayfield(playfieldData, idx) {
        let text = `# room ${idx}\n`;

        playfieldData.forEach((row) => {
            const PF = [0, 0, 0];
            row.forEach((value, x) => {
                // Both NORMAL and REFLECTED only use half the width.
                // PFO |PF1     |PF2
                // 4567|76543210|01234567
                if (value === 1) {
                    if (x <= 3) {
                        PF[0] += 1 << (x + 4);
                    } else if (x <= 11) {
                        PF[1] += 1 << (7 - (x - 4));
                    } else if (x <= 19) {
                        PF[2] += 1 << (x - 12);
                    }
                }
            });
            // .byte #%00100000, #%11000100,
            // const rowData = `.byte #%${getPaddedByte(PF0)}, #%${getPaddedByte(PF1)}, #%${getPaddedByte(PF2)}\n`
            const rowData = [];
            for (let i = 0; i <= 2; ++i) {
                if (this.#includeRegisters[i]) {
                    rowData.push(`#%` + this.#getPaddedByte(PF[i]));
                }
            }

            text += `.byte ${rowData.join(', ')}\n`;
        });

        return text;
    }
}
