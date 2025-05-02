import React, { Component } from 'react';
import { Result, Button, Typography } from 'antd';

const { Text } = Typography;

/**
 * ErrorBoundary component to catch JavaScript errors in child component tree
 * and display a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  // Update state when error is caught
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Log error details
  componentDidCatch(error, errorInfo) {
    // console.error('Error caught by boundary:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      errorInfo: errorInfo
    });
    
    // You could also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  // Reset the error state to allow retry
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    // If error occurred, show fallback UI
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle="We apologize for the inconvenience. An error occurred in this component."
          extra={[
            <Button type="primary" key="retry" onClick={this.handleReset}>
              Retry
            </Button>,
            <Button key="home" href="/">
              Go to Home
            </Button>
          ]}
        >
          <div className="error-details">
            {process.env.NODE_ENV !== 'production' && (
              <>
                <Text type="danger">{this.state.error?.toString()}</Text>
                {this.state.errorInfo && (
                  <div style={{ marginTop: 16 }}>
                    <Text type="secondary">Component Stack:</Text>
                    <pre style={{ 
                      marginTop: 8,
                      padding: 16,
                      background: '#f5f5f5',
                      borderRadius: 4,
                      maxHeight: '200px',
                      overflow: 'auto'
                    }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        </Result>
      );
    }

    // Otherwise, render children
    return this.props.children;
  }
}

export default ErrorBoundary;
