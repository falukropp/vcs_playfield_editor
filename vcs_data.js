export class VCSData {

  #includeRegisters

  constructor(textarea, playfield) {
    this.textarea = textarea;
    this.playfield = playfield;
    this.#includeRegisters =Array(3).fill(true)
  }

  setIncludeRegister(register, include) {
    if (register < 0 || register > 2) {
      throw new Error("Weird register " + register)
    }

    this.#includeRegisters[register] = !!include
  }

  updateFromPlayfield() {
    const playfieldData = this.playfield.data;
    const getPaddedByte = (num) => num.toString(2).padStart(8,'0')
    let text = ''

    playfieldData.forEach((row) => {
      const PF = [0,0,0]
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
      const rowData = []
      for (let i = 0; i<=2; ++i) {
        if (this.#includeRegisters[i]) {
          rowData.push(`#%`+getPaddedByte(PF[i]))
        }
      }

      text += `.byte ${rowData.join(', ')}\n`
    });

    this.textarea.value = text
  }
}
