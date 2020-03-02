# ngager-pdfwriter

> Very simple ReactJS PDF Writer library using PDFKit

[![NPM](https://img.shields.io/npm/v/ngager-pdfwriter.svg)](https://www.npmjs.com/package/ngager-pdfwriter) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save libary-name
```

## Usage

```jsx
import React, { Component } from 'react'

import PDF from 'ngager-pdfwriter'

const domtoimage = require('dom-to-image');

class Example extends Component {
  async onClick() {
    console.log('onClick', this.props);
    const pdf = new Pdf();
    pdf.setFilename('test.pdf');
    try {
      pdf.addText(text);
      pdf.addText(' ');
      const dataUrl = await domtoimage.toPng(this.chart);
      pdf.addImage(dataUrl);
    } catch (e) {
      console.log('ERROR', e);
    }
    pdf.save();
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
