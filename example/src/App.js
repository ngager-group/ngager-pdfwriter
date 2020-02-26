import React, { Component } from 'react'

import PDF from 'ngager-pdfwriter'

export default class App extends Component {
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
