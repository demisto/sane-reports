/* eslint-disable react/prop-types */
import React from 'react';

class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { errorMessage: `"${error.message}"` };
  }

  constructor(props) {
    super(props);
    this.state = { errorMessage: false };
  }

  render() {
    if (this.state.errorMessage) {
      return (<div className="error-section">
        <h5>Something Went Wrong - Error:</h5>
        <div className="error-message">
          {this.state.errorMessage}
        </div>
      </div>);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
