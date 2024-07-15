// Import React
import React from 'react';

// Define props interface for ErrorAlert component
interface ErrorAlertProps {
    error: string;
}

// ErrorAlert component
const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
    // If there's no error, don't render anything
    if (!error) return null;

    return (
        <div className="alert alert-danger" role="alert">
            {error}
        </div>
    );
};

export default ErrorAlert;