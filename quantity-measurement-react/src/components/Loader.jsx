import React from 'react';

const Loader = ({ size = 'md', text = null, fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50'
    : 'flex flex-col items-center justify-center';

  return (
    <div className={containerClasses}>
      <div className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizeClasses[size] || sizeClasses.md}`}></div>
      {text && (
        <p className="mt-3 text-gray-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );
};

export default Loader;
