/* eslint-disabled: 1 */
/* eslint no-param-reassign: 0 */
/* eslint class-methods-use-this: 0 */
/* eslint new-parens: 0 */
/* eslint semi: ["error", "always"] */
// import jsPDF from 'jspdf';
// import _isNumber from 'lodash/isNumber';
import _replace from 'lodash/replace';
import _split from 'lodash/split';

function rgb2hex(str) {
  return '#' + str.split(',').map(s => (s.replace(/\D/g, '') | 0).toString(16)).map(s => s.length < 2 ? '0' + s : s).join('');
}

function findBoldTag(str, open) {
  let i = 0;
  const normalText = str.substr(i, open - i);
  let boldText;
  i = open + 3;
  const close = str.indexOf('</b>', i);
  if (close > i) {
    boldText = str.substr(i, close - i);
    i = close + 3;
  } else {
    boldText = str.substr(i);
    i = str.length;
  }
  if (i < 0) {
    i = 0;
  }
  return { n: i, normalText, boldText };
}

function findSpanTag(str, open) {
  // console.log('findSpanTag', str);
  let i = 0;
  const normalText = str.substr(i, open - i);
  const span = {
    text: '',
    font: 'n'
  };
  const close = str.indexOf('</span>', open);
  if (close > open) {
    const spanHTML = str.substr(open, close + 6 - i);
    i = close + 6;
    const div = document.createElement('div');
    div.innerHTML = spanHTML;
    if (div.firstChild && div.firstChild.style && div.firstChild.style !== undefined) {
      if (div.firstChild.style.color !== undefined) {
        span.color = rgb2hex(div.firstChild.style.color);
      }
      if (div.firstChild.style.fontWeight === 'bold') {
        span.font = 'b';
      }
    }
    span.text = div.firstChild.innerText;
  } else {
    span.text = str.substr(i);
    i = str.length;
  }
  if (i < 0) {
    i = 0;
  }
  return { i, normalText, span };
}

class Pdf {
  constructor(options = null) {
    this.host = 'https://nclong87.github.io';
    this.path = '/pdfwriter';
    this.data = [];
    this.options = options;
  }
  setHost(host) {
    this.host = host;
  }
  setPath(path) {
    this.path = path;
  }

  addPage(options) {
    this.data.push({
      type: 'addPage',
      item: { options }
    });
  }

  moveUp(value = 1) {
    this.data.push({
      type: 'move',
      item: { direction: 'up', value }
    });
  }

  moveDown(value = 1) {
    this.data.push({
      type: 'move',
      item: { direction: 'down', value }
    });
  }

  addIcon(icon, style = null, options = null) {
    this.data.push({
      type: 'icon',
      item: { icon, style, options }
    });
  }

  addImage(image, options = {}) {
    this.data.push({
      type: 'image',
      item: { image, options }
    });
  }

  addText(text, style = null, options = null) {
    let newContent = _replace(text, '<br/>', '<br>');
    newContent = _replace(text, '<br></b>', '</b><br>');
    _split(newContent, '<br>').forEach(text => {
      if (text.length === 0) {
        this.data.push({
          type: 'text',
          item: { text: ' ', style, options }
        });
        return;
      }
      const array = [];
      let max = 0;
      for (let i = 0; i < text.length; i++) {
        if (max > 30) {
          break;
        }
        max += 1;
        const str = text.substr(i);
        const regex = /(<span|<b>)/g;
        const matches = regex.exec(str);
        if (matches) {
          if (matches[0].includes('<b>')) {
            const { normalText, boldText, n } = findBoldTag(str, matches.index);
            i += n;
            if (normalText) {
              array.push({
                text: normalText,
                type: 'n'
              });
            }
            if (boldText) {
              array.push({
                text: boldText,
                type: 'b'
              });
            }
          } else if (matches[0].includes('<span')) {
            const findSpanTagResp = findSpanTag(str, matches.index);
            i += findSpanTagResp.i;
            const { normalText, span } = findSpanTagResp;
            const { text, font, color } = span;
            if (normalText) {
              array.push({
                text: normalText,
                type: 'n'
              });
            }
            if (text) {
              array.push({
                text: text,
                type: font,
                color: color
              });
            }
          }
        } else {
          i = text.length;
          array.push({
            text: str,
            type: 'n'
          });
        }
      }
      if (array.length === 1 && array[0].type === 'n') {
        this.data.push({
          type: 'text',
          item: { text: array[0].text, style, options }
        });
      } else {
        this.data.push({
          type: 'formatted-text',
          item: { text: array, style, options }
        });
      }
    });
  }

  output() {
    const { host, path } = this;
    this.iframe = document.createElement('iframe');
    this.iframe.style = 'border:0 ;position: fixed;left: 0;top: 0;z-index: 9999;cursor: wait;background-color: #fff;opacity: 0.5;';
    this.iframe.width = '100%';
    this.iframe.height = '100%';
    this.iframe.src = `${host}${path}`;
    document.body.appendChild(this.iframe);
    const self = this;
    const promise = new Promise(resolve => {
      function handleOnReceivedMessage(event) {
        if (event.data && event.data.type) {
          if (event.data.type === 'ready') {
            const data = {
              data: self.data,
              options: self.options
            };
            // console.log('data', data);
            self.iframe.contentWindow.postMessage(data, '*');
          } else if (event.data.type === 'finish') {
            // console.log(event.data.data);
            resolve(event.data.data);
            document.body.removeChild(self.iframe);
            window.removeEventListener('message', handleOnReceivedMessage, false);
          }
        }
      }
      window.addEventListener('message', handleOnReceivedMessage);
    });
    return promise
      .catch(error => {
        console.log('ERROR', error);
        return null;
      });
  }

  async save(fileName = null) {
    const blob = await this.output();
    const url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = fileName || 'untitled.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

export default Pdf;
