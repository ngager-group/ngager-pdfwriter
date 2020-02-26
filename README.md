# libary-name

> Libary-description

[![NPM](https://img.shields.io/npm/v/libary-name.svg)](https://www.npmjs.com/package/libary-name) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save libary-name
```

## Usage

```jsx
import React, { Component } from 'react'

import PDF from 'ngager-pdfwriter'

class Example extends Component {
  onClick() {
    const pdf = new Pdf();
    // pdf.setDefaultColor('#6c81af');
    pdf.addText('Nguyễn Chí Long', { align: 'center' });
    pdf.breakLine(20);
    pdf.addText('Nguyễn Chí Long', {
      align: 'center',
      fontWeight: 'bold',
    });
    pdf.breakLine(20);
    pdf.save();
  }
  render () {
    return (
      <div>
        <button onClick={() => this.onClick()}>Download PDF</button>
      </div>
    )
  }
}
```

## License

MIT © [ngager-group](https://github.com/ngager-group)
