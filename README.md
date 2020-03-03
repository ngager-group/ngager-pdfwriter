# ngager-pdfwriter

> Very simple ReactJS PDF Writer library using PDFKit

[![NPM](https://img.shields.io/npm/v/ngager-pdfwriter.svg)](https://www.npmjs.com/package/ngager-pdfwriter) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save ngager-pdfwriter
```

## Usage

```jsx
import React, { Component } from 'react'

import Pdf from 'ngager-pdfwriter'

const html2canvas = require('html2canvas');

const text = '3. <b>Consultation Services</b>: The Recruitment team provides <b>consultation on </b>new and replacement positions - hiring  –  process, salary<b> range, </b> hehehe<br><br>   <b>availability, possible</b> challenges/risks and strategies <br>to close the roles.';

const text2 = 'The man who knows his worth respects his fellow man because he respects himself first. He does not boast; is not self-seeking; nor does he force his personal opinion on others.';

const text3 = '<span style="color: #FF6347;font-weight: bold;">#</span> What website or app has completely changed your life for better or for worse?'


class Example extends Component {
  async onClick() {
    const pdf = new Pdf({ defaultFontSize: 11, defaultColor: '#222222' });
    try {
      pdf.addText(text, { fontSize: 12, color: '#BBBBBB' });
      pdf.addText(' ');
      pdf.addIcon('', { color: '#BBBBBB' });
      pdf.moveUp();
      pdf.addText(text2, null, { indent: 16 });
      pdf.addText(' ');
      pdf.addText(text3);
      pdf.addText(' ');
      const canvas = await html2canvas(this.chart);
      const dataUrl = canvas.toDataURL();
      pdf.addImage(dataUrl);

      // add Page
      pdf.addPage();
    } catch (e) {
      console.log('ERROR', e);
    }
    // const blob = await pdf.output();
    // console.log('blob', blob);
    await pdf.save('test.pdf');
  }
  render () {
    return (
      <div>
        <div ref={el => {this.chart = el || this.chart; }} >
          {...chart}
        </div>
        <button onClick={() => this.onClick()}>Download PDF</button>
      </div>
    )
  }
}
```
## Example
https://ngager-group.github.io/ngager-pdfwriter/

## License

MIT © [ngager-group](https://github.com/ngager-group)
