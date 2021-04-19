import './WidgetEmptyState.less';
import React from 'react';

const EMPTY_STATE_TEXT = 'No results found';

const WidgetEmptyState = () => (
  <div className="widget-empty-state">
    <i className="demisto-icon icon-status-noresults-24-r" />
    <div className="widget-empty-state-text">{EMPTY_STATE_TEXT}</div>
  </div>);

export default WidgetEmptyState;
