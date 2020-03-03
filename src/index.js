/* eslint-disabled: 1 */
/* eslint class-methods-use-this: 0 */
/* eslint new-parens: 0 */
/* eslint semi: ["error", "always"] */
// import jsPDF from 'jspdf';
// import _isNumber from 'lodash/isNumber';
import _replace from 'lodash/replace';
import _split from 'lodash/split';

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
    const newContent = _replace(text, '<br/>', '<br>');
    _split(newContent, '<br>').forEach(str => {
      if (str.length === 0) {
        this.data.push({
          type: 'text',
          item: { text: ' ', style, options }
        });
        return;
      }
      // console.log('str', str);
      if (str.includes('<b>')) {
        // console.log(str);
        const array = [];
        let maxCount = 0;
        for (let i = 0; i < str.length; i++) {
          // console.log('maxCount', maxCount);
          if (maxCount > 30) {
            break;
          }
          maxCount += 1;
          const open = str.indexOf('<b>', i);
          if (open >= 0) {
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
            array.push({
              text: normalText,
              type: 'n'
            });
            array.push({
              text: boldText,
              type: 'b'
            });
          } else {
            const normalText = str.substr(i);
            i = str.length;
            array.push({
              text: normalText,
              type: 'n'
            });
          }
          // break;
        }
        this.data.push({
          type: 'formatted-text',
          item: { text: array, style, options }
        });
      } else {
        this.data.push({
          type: 'text',
          item: { text: str, style, options }
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
