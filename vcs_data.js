export class VCSData {
  constructor(textarea, playfield) {
    this.textarea = textarea;
    this.playfield = playfield;
  }


  updateFromPlayfield() {
    const playfieldData = this.playfield.data;
    const getPaddedByte = (num) => num.toString(2).padStart(8,'0')
    let text = ''

    playfieldData.forEach((row) => {
      let PF0 = 0;
      let PF1 = 0;
      let PF2 = 0;
      row.forEach((value, x) => {
        // Both NORMAL and REFLECTED only use half the width.
        // PFO |PF1     |PF2
        // 4567|76543210|01234567
        if (value === 1) {
          if (x <= 3) {
            PF0 += 1 << (x + 4);
          } else if (x <= 11) {
            PF1 += 1 << (7 - (x - 4));
          } else if (x <= 19) {
            PF2 += 1 << (x - 12);
          }
        }
      });
      // .byte #%00100000, #%11000100,
      const rowData = `.byte #%${getPaddedByte(PF0)}, #%${getPaddedByte(PF1)}, #%${getPaddedByte(PF2)}\n`
      text += rowData
    });

    this.textarea.value = text
  }
}
