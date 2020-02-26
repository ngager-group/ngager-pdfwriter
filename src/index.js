/* eslint new-cap: 0 */
/* eslint semi: ["error", "always"] */
// import jsPDF from 'jspdf';
import _isNumber from 'lodash/isNumber';
import _replace from 'lodash/replace';
import _split from 'lodash/split';
import { ptToPixel, pixelToPt, isHTML } from './utils';
import { getPdfDocument } from './pdfDocument';

class Pdf {
  constructor(font = 'Play', fontType = 'normal') {
    this.doc = getPdfDocument('p', 'pt', 'a4');
    // this.doc = new PdfConverter('p', 'pt', 'a4');
    this.y = 50;
    this.doc.setFont(font);
    this.doc.setFontType(fontType);
    this.defaultFont = font;
    this.left = 30;
    this.top = 50;
    this.contentHeight = this.doc.internal.pageSize.height - this.top * 2;
    this.contentWidth = this.doc.internal.pageSize.width - this.left * 2;
    this.defaultFontSize = 13;
    this.defaultColor = '#36425A';
  }

  getDocMeta() {
    return {
      y: this.y,
      left: this.left,
      top: this.top,
      contentWidth: this.contentWidth,
      contentHeight: this.contentHeight,
      defaultFontSize: this.defaultFontSize,
      defaultColor: this.defaultColor
    };
  }

  getFontSize() {
    return this.doc.internal.getFontSize();
  }

  getDoc() {
    return this.doc;
  }

  setY(y) {
    this.y = y;
  }

  setDefaultColor(color) {
    this.defaultColor = color;
  }

  setTextColor(color) {
    this.doc.setTextColor(color);
  }

  getRemainsHeight() {
    return ptToPixel(this.contentHeight) - this.y;
  }

  addPage() {
    this.doc.addPage();
    this.y = this.top;
  }

  addHeight(value) {
    this.y += value;
    if (this.y >= this.contentHeight) {
      this.addPage();
    }
  }

  addHeaderText(content, color) {
    if (!content || content.length === 0) {
      return;
    }
    this.doc.setFontSize(18);
    this.doc.setTextColor(color);
    const splitTexts = this.doc.splitTextToSize(content, this.contentWidth);
    splitTexts.forEach(text => {
      if (this.y >= this.contentHeight) {
        this.addPage();
      }
      const txtWidth =
        (this.doc.getStringUnitWidth(text) * this.doc.internal.getFontSize()) /
        this.doc.internal.scaleFactor;
      const x = this.left + (this.contentWidth - txtWidth) / 2;
      this.doc.text(x, this.y, text);
      this.breakLine(20);
    });
  }

  addText(content, options) {
    if (!content || content.length === 0) {
      return;
    }
    const { align, fontWeight, paddingLeft } = options;
    const color = options.color !== undefined ? options.color : this.defaultColor;
    const fontSize = options.fontSize !== undefined ? options.fontSize : this.defaultFontSize;
    // this.doc.setFontSize(fontWeight === 'bold' ? fontSize * 1.3 : fontSize);
    this.doc.setFontType(fontWeight !== undefined ? fontWeight : 'normal');
    if (isHTML(content)) {
      const newContent = _replace(content, '<br/>', '<br>');
      _split(newContent, '<br>').forEach(e => {
        const htmlContent = `<div style="font-family: Helvetica; font-size: ${ptToPixel(
          fontSize
        )}px; color: ${color}">${e}</div>`;
        console.log('htmlContent', htmlContent);
        this.addHTML(htmlContent);
      });
      return;
    }
    // console.log(align, fontSize, color, paddingLeft);
    this.doc.setTextColor(color);
    let splitTexts;
    if (_isNumber(content)) {
      splitTexts = [`${content}`];
    } else {
      splitTexts = this.doc.splitTextToSize(
        content,
        paddingLeft !== undefined ? this.contentWidth - paddingLeft : this.contentWidth
      );
    }
    // console.log('addText', content, splitTexts);
    splitTexts.forEach((text, index) => {
      if (this.y >= this.contentHeight) {
        this.addPage();
      }
      let x = this.left;
      if (align !== 'left') {
        const txtWidth =
          (this.doc.getStringUnitWidth(text) * this.doc.internal.getFontSize()) /
          this.doc.internal.scaleFactor;
        if (align === 'center') {
          x = this.left + (this.contentWidth - txtWidth) / 2;
        } else if (align === 'right') {
          x = this.left + this.contentWidth - txtWidth;
        }
      }
      this.doc.text(paddingLeft !== undefined ? x + paddingLeft : x, this.y, text);
      if (index < splitTexts.length - 1) {
        this.breakLine();
      }
    });
  }

  addHTML(content) {
    if (this.y >= this.contentHeight) {
      this.addPage();
    }
    try {
      const newContent = _replace(content, '<br><br>', '<br> <br>');
      console.log('final newContent', newContent);
      this.doc.fromHTML(newContent, this.left, this.y, { width: this.contentWidth }, dispose => {
        // console.log('dispose', dispose);
        // this.addHeight(dispose.y);
        this.y = dispose.y;
      });
    } catch (e) {
      console.log('ERROR', e);
    }
  }

  addImage(content, width, height) {
    const imageWidth = width > this.contentWidth ? this.contentWidth : width;
    const imageHeight = (imageWidth * height) / width;
    if (this.y + imageHeight >= this.contentHeight) {
      this.addPage();
    }
    // console.log('addImage', content);
    this.doc.addImage(content, 'JPEG', this.left, this.y, imageWidth, imageHeight);
    this.addHeight(imageHeight);
  }

  addQuoteIcon(style = {}) {
    if (this.y >= this.contentHeight) {
      this.addPage();
    }
    const paddingLeft = style.paddingLeft ? style.paddingLeft : 0;
    this.doc.addImage(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAOCAYAAAD0f5bSAAABfGlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGAqSSwoyGFhYGDIzSspCnJ3UoiIjFJgv8PAzcDDIMRgxSCemFxc4BgQ4MOAE3y7xsAIoi/rgsxK8/x506a1fP4WNq+ZclYlOrj1gQF3SmpxMgMDIweQnZxSnJwLZOcA2TrJBUUlQPYMIFu3vKQAxD4BZIsUAR0IZN8BsdMh7A8gdhKYzcQCVhMS5AxkSwDZAkkQtgaInQ5hW4DYyRmJKUC2B8guiBvAgNPDRcHcwFLXkYC7SQa5OaUwO0ChxZOaFxoMcgcQyzB4MLgwKDCYMxgwWDLoMjiWpFaUgBQ65xdUFmWmZ5QoOAJDNlXBOT+3oLQktUhHwTMvWU9HwcjA0ACkDhRnEKM/B4FNZxQ7jxDLX8jAYKnMwMDcgxBLmsbAsH0PA4PEKYSYyjwGBn5rBoZt5woSixLhDmf8xkKIX5xmbARh8zgxMLDe+///sxoDA/skBoa/E////73o//+/i4H2A+PsQA4AJHdp4IxrEg8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAICaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNzwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xNjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrIgcRyAAABW0lEQVQoFV1Sa1PCQAzc613pwxegMsz4//8aX9ABBaz0+nA3bQHNTHu5JJtsknP9IHDO4VZotuutXTbdnTDyNm2Hn7pFjB2KPCBLEwYA8lbn1nx56lEWAUGAloDtrsLhu0HTdFgtC+TzHG3XYfd1xv4QCWzwOs+uoP0x0lnjvkzxuChQspLkeIr4+KyRpg5vqzvavdlD2/WsEJHPPNbPBWakMMmxaozeelleEsmXqCVRShLHAEdKPTp+EukaT8LmpOuTGA81rCFsticD57MEy6fcJtUy6eb9hOA9fcBqkQ0gg/NXs6KqVGdnE1QySWx61DFapTLzf0EKEk3JsAhTbfTcjnhCDFlwdPw77cqAsdiN0iNow8E79sSmGaQKaRhsnnbRpWkQKiGQnmfJFzankSudAvQaCnIXSP6Jqqg/cJeXZzTmuh6KnCZxtZpmPWlX4xO8uFVxskmXTPdf5s6t4saDPkYAAAAASUVORK5CYII=',
      'PNG',
      this.left + paddingLeft,
      this.y - 8
    );
  }

  addLine() {
    this.doc.setLineWidth(0.1);
    this.doc.setDrawColor(151, 173, 217);
    this.doc.line(this.left, this.y, this.contentWidth + this.left, this.y);
  }

  breakLine(height = 15) {
    this.y += height;
    if (this.y >= this.contentHeight) {
      this.addPage();
    }
  }

  save(filename) {
    this.doc.save(filename);
  }
}

export function createPDFFromListTexts(title, subTitle, texts, color = '#36425A') {
  const pdf = new Pdf();
  if (isHTML(title)) {
    pdf.addText(title, { fontSize: pixelToPt(18) });
  } else {
    pdf.addHeaderText(title, color);
  }
  if (subTitle) {
    pdf.addText(subTitle, { align: 'center', fontSize: 14, color });
  }
  pdf.breakLine(60);
  texts.forEach(p => {
    pdf.addQuoteIcon();
    if (typeof p === 'string') {
      pdf.addText(p, { paddingLeft: 15, fontSize: 10 });
    } else {
      pdf.addText(p.text, Object.assign({ paddingLeft: 15, fontSize: 10 }, p.style));
    }
    pdf.breakLine(25);
    // pdf.addLine();
    // pdf.breakLine(15);
  });
  return pdf.getDoc().output('blob');
}

export function createPDFFromHTML(html) {
  const pdf = new Pdf();
  pdf.addHTML(html);
  return pdf.getDoc().output('blob');
}

export default Pdf;
