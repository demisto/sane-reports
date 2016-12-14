import './SectionMarkdown.less';
import '../../../assets/styles/railscasts.css';
import React, { PropTypes } from 'react';
import { mdReact } from 'react-markdown-js';
import Highlight from 'react-highlight';

// plugins for react markdown component
import abbr from 'markdown-it-abbr';
import container from 'markdown-it-container';
import emoji from 'markdown-it-emoji';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import mark from 'markdown-it-mark';
import footnote from 'markdown-it-footnote';
import deflist from 'markdown-it-deflist';
import ins from 'markdown-it-ins';
// end of import plugin

function handleIterate(Tag, props, children) {
  let res = '';
  switch (Tag) {
    case 'p':
      res = (<div {...props}>{children}</div>);
      break;
    case 'hr':
      res = (<hr {...props} />);
      break;
    case 'img':
      res = (<img {...props} />); // eslint-disable-line jsx-a11y/img-has-alt
      break;
    case 'mark': {
      props.className = 'highlight-result';
      break;
    }
    case 'table':
      props.className = 'ui very compact table celled fixed selectable';
      break;
    case 'blockquote':
      props.className = 'markdown blockquote';
      break;
    case 'code': {
      const clzz = props['data-language'] || '';
      res = (
        <Highlight className={clzz} key={new Date().getMilliseconds()}>
          {children[0]}
        </Highlight>
      );
      break;
    }
    default:
      // Do nothing - will be set after switch
  }
  if (!res) {
    res = (<Tag {...props}>{children}</Tag>);
  }
  return res;
}

const SectionMarkdown = ({ text, style }) => {
  let res = text;
  try {
    const mdData = mdReact(
      {
        onIterate: handleIterate,
        markdownOptions: { typographer: true },
        plugins: [
          emoji,
          abbr,
          sub,
          sup,
          mark,
          container,
          footnote,
          deflist,
          ins
        ]
      }
    )(text);

    if (mdData) {
      res = mdData;
    }
  } catch (ignored) {
    // do nothing
  }

  return (
    <div className="section-markdown" style={style}>
      {res}
    </div>
  );
};
SectionMarkdown.propTypes = {
  text: PropTypes.string,
  style: PropTypes.object
};

export default SectionMarkdown;
