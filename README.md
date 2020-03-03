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

class Example extends Component {
  async onClick() {
    // console.log('onClick', this.props);
    const pdf = new Pdf();
    try {
      pdf.addText(text, { fontSize: 12, color: '#BBBBBB' });
      pdf.addText(' ');
      // Add fontawesome icon
      pdf.addIcon('', { color: '#BBBBBB' });
      pdf.moveUp();
      pdf.addText(text2, null, { indent: 16 });
      pdf.addText(' ');
      const canvas = await html2canvas(this.chart);
      const dataUrl = canvas.toDataURL();
      pdf.addImage(dataUrl);
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
