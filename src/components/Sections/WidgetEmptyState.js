import './WidgetEmptyState.less';
import React from 'react';
import { EMPTY_STATE_TEXT } from '../../constants/Constants';
import PropTypes from 'prop-types';


const WidgetEmptyState = ({ emptyString }) => (
  <div className="widget-empty-state">
    <i className="demisto-icon icon-status-noresults-24-r" />
    <div className="widget-empty-state-text">{emptyString || EMPTY_STATE_TEXT}</div>
  </div>);

WidgetEmptyState.propTypes = {
  emptyString: PropTypes.string
};

export default WidgetEmptyState;
