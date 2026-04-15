import React from 'react';

const HistoryCard = ({ item, onDelete = null }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getOperationIcon = (operationType) => {
    const icons = {
      'Convert': '🔄',
      'Compare': '⚖️',
      'Add': '➕',
      'Subtract': '➖',
      'Divide': '➗',
      'Multiply': '✖️'
    };
    return icons[operationType] || '📐';
  };

  const getOperationColor = (operationType) => {
    const colors = {
      'Convert': 'bg-blue-100 text-blue-700',
      'Compare': 'bg-purple-100 text-purple-700',
      'Add': 'bg-green-100 text-green-700',
      'Subtract': 'bg-orange-100 text-orange-700',
      'Divide': 'bg-red-100 text-red-700',
      'Multiply': 'bg-indigo-100 text-indigo-700'
    };
    return colors[operationType] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Operation Type Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOperationColor(item.operationType || item.operation)}`}>
                <span className="mr-1">{getOperationIcon(item.operationType || item.operation)}</span>
                {item.operationType || item.operation || 'Convert'}
              </span>
              <span className="text-xs text-gray-400">{formatDate(item.createdAt || item.created_at)}</span>
            </div>

            {/* Conversion Details */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-900">
                {item.inputValue || item.input_value || 'N/A'} {item.fromUnit || item.from_unit || ''}
              </span>
              <span className="text-gray-400">→</span>
              <span className="font-medium text-gray-900">
                {item.outputValue || item.output_value || 'N/A'} {item.toUnit || item.to_unit || ''}
              </span>
            </div>

            {/* Additional Details if available */}
            {(item.targetUnit || item.target_unit) && (
              <div className="text-xs text-gray-500 mt-1">
                Target Unit: {item.targetUnit || item.target_unit}
              </div>
            )}
          </div>

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete this item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
