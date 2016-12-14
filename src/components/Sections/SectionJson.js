import '../../../node_modules/generic-react-json-inspector/json-inspector.css';
import React, { PropTypes } from 'react';
import Inspector from 'generic-react-json-inspector';


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
