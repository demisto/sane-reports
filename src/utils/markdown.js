export function mdUnderline(md) {
  md.inline.ruler.push(
    'underline',
    (state, silent) => {
      let matchStart;
      let matchEnd;
      let token;
      let pos = state.pos;
      const ch = state.src.charCodeAt(pos);

      if (ch !== 0x2b /* + */) {
        return false;
      }

      const start = pos;
      pos++;
      const max = state.posMax;

      while (pos < max && state.src.charCodeAt(pos) === 0x2b /* + */) {
        pos++;
      }

      const underlined = state.src.slice(start, pos);

      matchEnd = pos;
      matchStart = state.src.indexOf('+', matchEnd);
      while (matchStart !== -1) {
        matchEnd = matchStart + 1;

        while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x2b /* + */) {
          matchEnd++;
        }

        if (matchEnd - matchStart === underlined.length) {
          if (!silent) {
            token = state.push('underline_open', 'u', 1);
            const text = state.src.slice(pos, matchStart);
            token.attrs = [['content', text]];
            const inlineToken = state.push('inline', '', 0);
            inlineToken.children = state.md.parseInline(text, state.env);

            token = state.push('underline_close', 'u', -1);
          }
          state.pos = matchEnd;
          return true;
        }
        matchStart = state.src.indexOf('+', matchEnd);
      }

      if (!silent) {
        state.pending += underlined;
      }

      state.pos += underlined.length;
      return true;
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] }
  );
}

const TEXT_STYLE_TOKEN_REG = /^{{([a-zA-Z-]+:[-.!# a-zA-Z0-9]+;)*([a-zA-Z-]+:[-.!# a-zA-Z0-9]+;?)}}/g;

export const SUPPORTED_STYLE_ATTRIBUTES = {
  BG: 'background',
  BG_COLOR: 'background-color',
  COLOR: 'color',
  LETTER_SPACING: 'letter-spacing',
  SHADOW: 'text-shadow',
  FONT_WEIGHT: 'font-weight',
  FONT_SIZE: 'font-size'
};

const SUPPORTED_STYLE_ATTRIBUTES_ARRAY = [
  SUPPORTED_STYLE_ATTRIBUTES.BG,
  SUPPORTED_STYLE_ATTRIBUTES.BG_COLOR,
  SUPPORTED_STYLE_ATTRIBUTES.COLOR,
  SUPPORTED_STYLE_ATTRIBUTES.LETTER_SPACING,
  SUPPORTED_STYLE_ATTRIBUTES.SHADOW,
  SUPPORTED_STYLE_ATTRIBUTES.FONT_SIZE,
  SUPPORTED_STYLE_ATTRIBUTES.FONT_WEIGHT
];

function getTextStyleToken(source) {
  let token = source.match(TEXT_STYLE_TOKEN_REG);
  if (token === null) {
    return false;
  }

  token = token[0];
  // remove '{{' and '}}' to extract the style string
  const styleString = token.slice(2, token.length - 2);
  const attrs = styleString.split(';');
  const filteredStyles = attrs.filter(attr => SUPPORTED_STYLE_ATTRIBUTES_ARRAY.includes(attr.split(':')[0]));

  if (filteredStyles.length === 0) {
    return false;
  }

  return { token, style: filteredStyles.join(';') };
}

function findClosingBracket(str, pos) {
  const rExp = /\(|\)/g;
  rExp.lastIndex = pos + 1;
  let deep = 1;
  let curr = rExp.exec(str);
  while (curr) {
    const close = !(deep += str[curr.index] === '(' ? 1 : -1);
    if (close) {
      return curr.index;
    }
    curr = rExp.exec(str);
  }

  return -1;
}

export function mdTextStyle(md) {
  md.inline.ruler.push(
    'textstyle',
    (state, silent) => {
      const tsToken = getTextStyleToken(state.src.slice(state.pos, state.posMax));
      if (!tsToken) {
        return false;
      }

      const pos = state.pos + tsToken.token.length;
      const ch = state.src.charCodeAt(pos);

      if (ch !== 0x28 /* ( */) {
        return false;
      }

      const start = pos;
      const end = findClosingBracket(state.src, start);
      if (end === -1) {
        return false;
      }

      const styled = state.src.slice(start + 1, end);

      if (!silent) {
        const token = state.push('textstyle_open', 'span', 1);
        token.attrs = [
          ['style', tsToken.style],
          ['className', 'text-style']
        ];

        const inlineToken = state.push('inline', '', 0);
        inlineToken.children = state.md.parseInline(styled, state.env);

        state.push('textstyle_close', 'span', -1);
      }
      state.pos = end + 1;
      return true;
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] }
  );
}

const TEXT_ALIGN_TOKEN_LENGTH = 5;
const TEXT_ALIGN_DIRECTION = {
  Left: 'left',
  Right: 'right',
  Center: 'center'
};

function getTextAlignTokenDirection(token) {
  if (token && token.length !== TEXT_ALIGN_TOKEN_LENGTH) {
    return false;
  }

  switch (token) {
    case '<:-->':
      return TEXT_ALIGN_DIRECTION.Left;
    case '<-:->':
      return TEXT_ALIGN_DIRECTION.Center;
    case '<--:>':
      return TEXT_ALIGN_DIRECTION.Right;
    default:
      return false;
  }
}

export function mdTextAlign(md) {
  md.inline.ruler.push(
    'textalign',
    (state, silent) => {
      if (state.posMax < TEXT_ALIGN_TOKEN_LENGTH) {
        return false;
      }

      const direction = getTextAlignTokenDirection(state.src.slice(state.pos, state.pos + TEXT_ALIGN_TOKEN_LENGTH));

      if (!direction) {
        return false;
      }

      const start = state.pos + TEXT_ALIGN_TOKEN_LENGTH;
      const textToAlign = state.src.slice(start, state.posMax);

      if (!silent) {
        const token = state.push('textalign_open', 'textalign', 1);
        token.attrs = [['style', `text-align:${direction}`]];

        const inlineToken = state.push('inline', '', 0);
        inlineToken.children = state.md.parseInline(textToAlign, state.env);

        state.push('textalign_close', 'textalign', -1);
      }
      state.pos = state.posMax;
      return true;
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] }
  );
}

const MD_BTTN = 0x25; // %
const MD_BTTN_STR = String.fromCharCode(MD_BTTN) + String.fromCharCode(MD_BTTN) + String.fromCharCode(MD_BTTN);
const MD_MARKER = 0x5e; // ^
const MD_MARKER_STR = String.fromCharCode(MD_MARKER) + String.fromCharCode(MD_MARKER) + String.fromCharCode(MD_MARKER);

export function mdBtn(md) {
  md.inline.ruler.push(
    'hyper',
    (state, silent) => {
      let token;
      let pos = state.pos;
      const ch = state.src.charCodeAt(pos);

      if (ch !== MD_BTTN) { return false; }

      const start = pos;
      pos++;
      const max = state.posMax;

      while (pos < max && state.src.charCodeAt(pos) === MD_BTTN) { pos++; }
      if (pos - start < MD_BTTN_STR.length) { return false; }

      const marker = state.src.slice(pos - MD_BTTN_STR.length, pos);

      const matchStart = state.src.indexOf(MD_BTTN_STR, pos);
      if (matchStart === -1) { return false; }

      if (!silent) {
        token = state.push('code_inline', 'mdbtn', 0);
        token.markup = marker;
        token.content = state.src.slice(pos, matchStart)
          .replace(/[ \n]+/g, ' ')
          .trim();
      }
      state.pos = matchStart + MD_BTTN_STR.length;
      return true;
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] }
  );
}

export function myBackticks(md) {
  md.inline.ruler.push(
    'mybackticks',
    (state, silent) => {
      let matchStart;
      let matchEnd;
      let token;
      let pos = state.pos;
      const ch = state.src.charCodeAt(pos);

      if (ch !== 0x60 /* ` */) {
        return false;
      }

      const start = pos;
      pos++;
      const max = state.posMax;

      while (pos < max && state.src.charCodeAt(pos) === 0x60 /* ` */) {
        pos++;
      }

      const marker = state.src.slice(start, pos);

      matchEnd = pos;
      matchStart = state.src.indexOf('`', matchEnd);
      while (matchStart !== -1) {
        matchEnd = matchStart + 1;

        while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60 /* ` */) {
          matchEnd++;
        }

        if (matchEnd - matchStart === marker.length) {
          if (!silent) {
            if (marker.length === 1) {
              token = state.push('code_inline', 'inlineCode', 0);
            } else {
              token = state.push('code_inline', 'code', 0);
            }
            token.markup = marker;
            token.content = state.src
              .slice(pos, matchStart)
              .replace(/[ \n]+/g, ' ')
              .trim();
          }
          state.pos = matchEnd;
          return true;
        }
        matchStart = state.src.indexOf('`', matchEnd);
      }

      if (!silent) {
        state.pending += marker;
      }
      state.pos += marker.length;
      return true;
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] }
  );
}

export function mdHyper(md) {
  md.inline.ruler.push(
    'hyper',
    (state, silent) => {
      let token;
      let pos = state.pos;
      const ch = state.src.charCodeAt(pos);

      if (ch !== MD_MARKER) {
        return false;
      }

      const start = pos;
      pos++;
      const max = state.posMax;

      while (pos < max && state.src.charCodeAt(pos) === MD_MARKER) {
        pos++;
      }
      if (pos - start < MD_MARKER_STR.length) {
        return false;
      }

      const marker = state.src.slice(pos - MD_MARKER_STR.length, pos);

      const matchStart = state.src.indexOf(MD_MARKER_STR, pos);
      if (matchStart === -1) {
        return false;
      }

      if (!silent) {
        token = state.push('code_inline', 'hyper', 0);
        token.markup = marker;
        token.content = state.src
          .slice(pos, matchStart)
          .replace(/[ \n]+/g, ' ')
          .trim();
      }
      state.pos = matchStart + MD_MARKER_STR.length;
      return true;
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] }
  );
}

export function hyperMarker() {
  return MD_MARKER_STR;
}
