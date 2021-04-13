import jsdom from 'jsdom';
import 'babel-polyfill';

const globalKeys = {};

function mockCanvas(window) {
  window.HTMLCanvasElement.prototype.getContext = () => {
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: (x, y, w, h) => {
        return {
          data: new Array(w * h * 4)
        };
      },
      putImageData: () => {},
      createImageData: () => { return []; },
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: (value = '') => {
        return { width: value.length * 5 };
      },
      transform: () => {},
      rect: () => {},
      clip: () => {}
    };
  };

  window.HTMLCanvasElement.prototype.toDataURL = () => {
    return '';
  };
}

export function initDOM(initGlobalKeys = false) {
  const doc = jsdom.jsdom('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
  const win = doc.defaultView;

  global.document = doc;
  global.window = win;
  global.__DEV_TOOLS__ = false;

  if (initGlobalKeys) {
    Object.keys(window).forEach((key) => {
      if (!(key in global)) {
        global[key] = window[key];
        globalKeys[key] = window[key];
      }
    });
  } else {
    Object.keys(globalKeys).forEach((key) => {
      global[key] = globalKeys[key];
    });
  }

  mockCanvas(win);
}

initDOM(true);
