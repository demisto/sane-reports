/* eslint-disable react/prop-types */
import './SectionMarkdown.less';
import '../../../assets/styles/railscasts.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Highlight from 'react-highlight';
import isString from 'lodash/isString';
import { uniqueId } from 'lodash';
import {
  getMarkdownImageServer,
  MARKDOWN_IMAGES_PATH,
  PAGE_BREAK_KEY
} from '../../constants/Constants';
import { mdReact } from '../ReactMarkdown/ReactMarkdown';
import {
  getChildrenText,
  mdBtn,
  mdHyper,
  mdTextAlign,
  mdTextStyle,
  mdUnderline,
  myBackticks
} from '../../utils/markdown';
import WidgetEmptyState from './WidgetEmptyState';

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
import SectionTitle from './SectionTitle';
import classNames from 'classnames';
// end of import plugin

const IGNORE_KEYS = [PAGE_BREAK_KEY];

export default class SectionMarkdown extends Component {
  static propTypes = {
    text: PropTypes.string,
    style: PropTypes.object,
    setRef: PropTypes.any,
    customClass: PropTypes.string,
    tableClasses: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]),
    forceRangeMessage: PropTypes.string
  };

  static createBtn(props, children) {
    let message = children;
    try {
      const obj = JSON.parse(children[0]);
      message = obj.message || message;
    } catch (e) {
      // do nothing
    }
    return (<span {...props}>{message}</span>);
  }

  static handleIterate(tableClasses, Tag, props, children) {
    let res = '';
    switch (Tag) {
      case 'textalign': {
        let content = props.content;
        if (children) {
          content = children;
        }
        res = (
          <div className="text-align" {...props}>
            {content}
          </div>
        );
        break;
      }
      case 'p':
        res = (<div key={uniqueId('preplacer_')} className="preplacer" {...props}>{children}</div>);
        break;
      case 'hr':
        res = (<hr {...props} />);
        break;
      case 'mdbtn': {
        res = SectionMarkdown.createBtn(props, children);
        break;
      }
      case 'img': {
        const srcArr = props.src.split('=size=');
        if (MARKDOWN_IMAGES_PATH.test(srcArr[0])) {
          props.src = `${getMarkdownImageServer()}${srcArr[0]}`;
        } else {
          props.src = srcArr[0];
        }
        if (srcArr.length > 1) {
          const sizeArr = srcArr[1].split('x');
          props.height = sizeArr[0];
          if (sizeArr.length > 1) {
            props.width = sizeArr[1];
          }
        }

        res = (<img alt="" {...props} />);
        break;
      }
      case 'a':
        res = (<a {...props} target="_blank" rel="noopener noreferrer">{children[0]}</a>);
        break;
      case 'mark': {
        props.className = 'highlight-result';
        break;
      }
      case 'table': {
        const thead = children[0];
        const tbody = children[1];

        const headerRows = thead.props.children;
        const headerCells = headerRows[0].props.children;

        const bodyRows = tbody?.props?.children;
        const headersValues = headerCells.map(cell => (cell.props.children && cell.props.children[0]) || '');
        const tableContent = [];

        if (headersValues && bodyRows) {
          bodyRows.forEach((row) => {
            const newRow = {};
            const cells = row.props.children;
            const cellValue = cells.map((cell) => {
              const cellChildren = cell.props.children;
              if (!cellChildren) {
                return '';
              }

              if (cellChildren.length === 1) {
                return (cellChildren[0]) || '';
              }

              return getChildrenText(cell);
            });
            headersValues.forEach((headerValue, i) => {
              newRow[i] = isString(cellValue[i]) ? cellValue[i].replace(/<br>/g, '\n') : cellValue[i];
            });
            tableContent.push(newRow);
          });
        }

        res = (
          <div key={uniqueId('table_')}>
            <table
              className={`ui very compact table celled fixed unstackable selectable ${tableClasses}`}
              style={{ tableLayout: 'fixed' }}
            >
              <thead>
                <tr>
                  {headersValues.map((col, i) => {
                  return <th key={i}>{col}</th>;
                })}
                </tr>
              </thead>
              {tableContent.length > 0 &&
              <tbody>
                {tableContent.map((row, i) => {
                return (
                  <tr key={i}>
                    {Object.keys(row).map((key, j) =>
                      <td key={j + '.' + i} style={{ wordBreak: 'break-word' }}>{row[key]}</td>)}
                  </tr>
                );
              })}
              </tbody>
              }

            </table>
            {tableContent.length === 0 &&
              <WidgetEmptyState />
            }
          </div>
        );
        break;
      }
      case 'blockquote':
        props.className = 'markdown blockquote';
        break;
      case 'inlineCode':
        props.className = 'markdown inline-blockquote';
        res = <span {...props}>{children}</span>;
        break;
      case 'br':
        res = <span {...props}><br /></span>;
        break;
      case 'code': {
        let clzz = '';
        let parsedContent;
        if (children) {
          clzz = props['data-language'] || '';
          parsedContent = children[0];
        }
        res = (
          <Highlight className={clzz} key={uniqueId('highlight_')}>
            {parsedContent}
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

  render() {
    const {
      text,
      style,
      tableClasses,
      doNotShowEmoji,
      setRef,
      customClass,
      forceRangeMessage
    } = this.props;
    let finalText = text;
    IGNORE_KEYS.forEach((s) => {
      finalText = (finalText || '').replace(s, '');
    });
    let res = finalText;
    try {
      const plugins = [
        myBackticks,
        mdUnderline,
        mdTextAlign,
        mdTextStyle,
        abbr,
        sub,
        sup,
        mark,
        container,
        footnote,
        deflist,
        ins,
        mdBtn,
        mdHyper
      ];

      if (!doNotShowEmoji) {
        plugins.push(emoji);
      }

      const mdData = mdReact(
        {
          disableRules: ['backticks'],
          onIterate: SectionMarkdown.handleIterate.bind(this, tableClasses),
          markdownOptions: { typographer: true },
          plugins
        }
      )(finalText);

      if (mdData) {
        res = mdData;
      }
    } catch (ignored) {
      // do nothing
    }

    return (
      <div
        className={classNames('section-markdown', customClass)}
        ref={setRef}
        style={style}
      >
        <SectionTitle subTitle={forceRangeMessage} />
        {res}
      </div>
    );
  }
}
