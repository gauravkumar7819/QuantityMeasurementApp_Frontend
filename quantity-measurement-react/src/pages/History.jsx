import React from 'react';

const History = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Measurement History</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Feature Not Available</h3>
          <p className="text-yellow-700">
            The history feature is currently not supported by the backend API. 
            This feature will be available once the backend is updated to support measurement history endpoints.
          </p>
          <a
            href="/converter"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Converter
          </a>
        </div>
      </div>
    </div>
  );
};

export default History;