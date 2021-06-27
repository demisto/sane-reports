
const MD_BTTN = 0x25; // %
const MD_BTTN_STR = String.fromCharCode(MD_BTTN) + String.fromCharCode(MD_BTTN) + String.fromCharCode(MD_BTTN);

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

      const marker = state.src.slice(start, pos);

      matchEnd = pos;
      matchStart = state.src.indexOf('+', matchEnd);
      while (matchStart !== -1) {
        matchEnd = matchStart + 1;

        while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x2b /* + */) {
          matchEnd++;
        }

        if (matchEnd - matchStart === marker.length) {
          if (!silent) {
            token = state.push('underline', 'u', 0);

            token.attrs = [
              [
                'content',
                state.src
                  .slice(pos, matchStart)
                  .replace(/[ \n]+/g, ' ')
                  .trim()
              ]
            ];
          }
          state.pos = matchEnd;
          return true;
        }
        matchStart = state.src.indexOf('+', matchEnd);
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

