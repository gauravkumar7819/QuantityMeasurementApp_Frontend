import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { measurementsAPI } from '../services/api';

const History = () => {
  const { isAuthenticated } = useAuth();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchMeasurements();
    }
  }, [isAuthenticated]);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await measurementsAPI.getMeasurements();
      setMeasurements(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load measurement history');
      setMeasurements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this measurement?')) {
      return;
    }

    try {
      await measurementsAPI.deleteMeasurement(id);
      setMeasurements(measurements.filter(m => m.id !== id));
    } catch (err) {
      setError('Failed to delete measurement');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getCategoryIcon = (category) => {
    const icons = {
      length: '📏',
      weight: '⚖️',
      temperature: '🌡️',
      volume: '🧪'
    };
    return icons[category] || '📊';
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Measurement History</h1>
          <p className="text-gray-600">Please log in to view your measurement history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Measurement History</h1>
        <button
          onClick={fetchMeasurements}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : measurements.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No measurements yet</h3>
          <p className="text-gray-500">Start converting units to see your history here.</p>
          <a
            href="/converter"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Converter
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {measurements.map((measurement) => (
                  <tr key={measurement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">
                          {getCategoryIcon(measurement.inputUnit1?.toLowerCase().includes('inch') ? 'length' : 
                                          measurement.inputUnit1?.toLowerCase().includes('feet') ? 'length' :
                                          measurement.inputUnit1?.toLowerCase().includes('yard') ? 'length' :
                                          measurement.inputUnit1?.toLowerCase().includes('centimeter') ? 'length' :
                                          measurement.inputUnit1?.toLowerCase().includes('kilo') ? 'weight' :
                                          measurement.inputUnit1?.toLowerCase().includes('gram') ? 'weight' :
                                          measurement.inputUnit1?.toLowerCase().includes('pound') ? 'weight' :
                                          measurement.inputUnit1?.toLowerCase().includes('celsius') ? 'temperature' :
                                          measurement.inputUnit1?.toLowerCase().includes('fahrenheit') ? 'temperature' :
                                          measurement.inputUnit1?.toLowerCase().includes('kelvin') ? 'temperature' :
                                          measurement.inputUnit1?.toLowerCase().includes('litre') ? 'volume' :
                                          measurement.inputUnit1?.toLowerCase().includes('millilitre') ? 'volume' :
                                          measurement.inputUnit1?.toLowerCase().includes('gallon') ? 'volume' :
                                          '📊')}
                        </span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {measurement.inputUnit1?.toLowerCase().includes('inch') ? 'length' : 
                           measurement.inputUnit1?.toLowerCase().includes('feet') ? 'length' :
                           measurement.inputUnit1?.toLowerCase().includes('yard') ? 'length' :
                           measurement.inputUnit1?.toLowerCase().includes('centimeter') ? 'length' :
                           measurement.inputUnit1?.toLowerCase().includes('kilo') ? 'weight' :
                           measurement.inputUnit1?.toLowerCase().includes('gram') ? 'weight' :
                           measurement.inputUnit1?.toLowerCase().includes('pound') ? 'weight' :
                           measurement.inputUnit1?.toLowerCase().includes('celsius') ? 'temperature' :
                           measurement.inputUnit1?.toLowerCase().includes('fahrenheit') ? 'temperature' :
                           measurement.inputUnit1?.toLowerCase().includes('kelvin') ? 'temperature' :
                           measurement.inputUnit1?.toLowerCase().includes('litre') ? 'volume' :
                           measurement.inputUnit1?.toLowerCase().includes('millilitre') ? 'volume' :
                           measurement.inputUnit1?.toLowerCase().includes('gallon') ? 'volume' :
                           'unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {measurement.operation?.charAt(0).toUpperCase() + measurement.operation?.slice(1)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {measurement.inputValue1} {measurement.inputUnit1} 
                        {measurement.inputUnit2 ? ` → ${measurement.inputValue2} ${measurement.inputUnit2}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {measurement.resultValue} {measurement.resultUnit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(measurement.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(measurement.id)}
                        className="text-red-600 hover:text-red-900 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default History;