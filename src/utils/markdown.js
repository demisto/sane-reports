
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

