import '../../../node_modules/react-json-inspector-demisto/json-inspector.css';
import React from 'react';
import PropTypes from 'prop-types';
import Inspector from 'react-json-inspector-demisto';


const SectionJson = ({ data, style }) => {
  let toRender;
  try {
    let parsedData = '';
    if (typeof data === 'string') {
      parsedData = JSON.parse(data);
    } else if (typeof data === 'object') {
      parsedData = data;
    }
    toRender = (
      <Inspector
        isRootCollapsed={false}
        data={parsedData}
        filterOptions={{ ignoreCase: true }}
        search={false}
        isExpanded={() => { return true; }}
      />
    );
  } catch (err) {
    toRender = (
      <div className="ui error message">
        Cannot parse JSON
      </div>
    );
  }

  return (
    <div className="section-json" style={style}>
      {toRender}
    </div>
  );
};
SectionJson.propTypes = {
  data: PropTypes.string,
  style: PropTypes.object
};

export default SectionJson;
