import React from 'react';
import { Result, Button, Typography, Space, Alert } from 'antd';

const { Text, Paragraph } = Typography;

/**
 * A reusable error message component that displays user-friendly error information
 * and provides options to retry or go back.
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Main error message to display
 * @param {Object} props.error - Error object
 * @param {Function} props.retry - Function to retry the failed operation
 * @param {string} props.backUrl - URL to navigate back to (defaults to home)
 */
const ErrorMessage = ({ message, error, retry, backUrl = '/' }) => {
  // Extract status code if available
  const statusCode = error?.status || error?.response?.status;
  
  // Get error details
  const errorDetail = error?.data?.message || 
                     error?.message || 
                     'Unknown error occurred';

  return (
    <Result
      status={statusCode ? 'warning' : 'error'}
      title={message || 'Something went wrong'}
      subTitle="We encountered an error while processing your request"
      extra={
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Show error details in an alert */}
          <Alert
            message="Error details"
            description={
              <Space direction="vertical">
                {statusCode && (
                  <Text type="secondary">Status code: {statusCode}</Text>
                )}
                <Paragraph type="secondary">{errorDetail}</Paragraph>
              </Space>
            }
            type="error"
            showIcon
          />
          
          {/* Action buttons */}
          <Space>
            {retry && (
              <Button type="primary" onClick={retry}>
                Try Again
              </Button>
            )}
            <Button href={backUrl}>
              Go Back
            </Button>
          </Space>
        </Space>
      }
    />
  );
};

export default ErrorMessage;
