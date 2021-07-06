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

