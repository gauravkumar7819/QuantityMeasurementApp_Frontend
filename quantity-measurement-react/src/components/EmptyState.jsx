import React from 'react';

const EmptyState = ({ 
  icon = '📝', 
  title = 'No History Yet', 
  message = 'Start using the converter to build your history',
  action = null 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">{message}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
