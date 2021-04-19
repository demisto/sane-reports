import './WidgetEmptyState.less';
import React from 'react';

const EMPTY_STATE_TEXT = 'No Results FOUND';

const WidgetEmptyState = () => (
  <div className="widget-empty-state">
    <i className="widget-empty-state-icon demisto-icon icon-status-noresults-24-r" />
    <div className="widget-empty-state-text">{EMPTY_STATE_TEXT}</div>
  </div>);

export default WidgetEmptyState;
