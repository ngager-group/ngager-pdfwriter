
export function ptToPixel(pt) {
  return pt * 1.3
}

export function pixelToPt(px) {
  return px * 0.75
}

export function isHTML(str) {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
  }
  
