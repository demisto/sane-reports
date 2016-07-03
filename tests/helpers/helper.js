import jsdom from 'jsdom';
import 'babel-polyfill';

const globalKeys = {};

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
}

initDOM(true);
