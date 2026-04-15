import React, { useState, useEffect } from 'react';
import { quantityAPI } from '../services/api';

const Converter = () => {
  const [category, setCategory] = useState('length');
  const [action, setAction] = useState('CONVERT');
  const [operation, setOperation] = useState('ADD');
  const [value1, setValue1] = useState('1');
  const [value2, setValue2] = useState('1');
  const [unit1, setUnit1] = useState('');
  const [unit2, setUnit2] = useState('');
  const [resultUnit, setResultUnit] = useState(''); 
  const [result, setResult] = useState('--');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['length', 'weight', 'temperature', 'volume'];
  const icons = {
    length: '📏',
    weight: '⚖️', 
    temperature: '🌡️',
    volume: '🧪'
  };
  

  // Units matching backend API expectations (lowercase)
  const units = {
    length: ['inches', 'feet', 'yards', 'centimeters'],
    weight: ['kilogram', 'gram', 'pound'],
    temperature: ['celsius', 'fahrenheit', 'kelvin'],
    volume: ['litre', 'millilitre', 'gallon']
  };

  // Initialize units when category changes
  useEffect(() => {
    const categoryUnits = units[category];
    setUnit1(categoryUnits[0]);
    setUnit2(categoryUnits[1] || categoryUnits[0]);
    setResultUnit(categoryUnits[0]); // Default result unit
  }, [category]);

  // Validate units are from same category
  const validateUnits = () => {
    if (action === 'CONVERT') {
      // Convert should always be within same category
      return true; // Already enforced by UI
    }
    if (action === 'COMPARE') {
      // Compare should be within same category
      return true; // Already enforced by UI
    }
    if (action === 'ARITHMETIC') {
      // Arithmetic operations should be within same category
      return true; // Already enforced by UI
    }
    return true;
  };

  // Handle calculations
  const calculate = async () => {
    if (!value1) return;
    
    // Validate units before making API call
    if (!validateUnits()) {
      setError('Invalid unit combination: Units must be from the same category');
      setResult('Error');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const v1 = parseFloat(value1);
      const v2 = parseFloat(value2);
      let response;
      
      if (action === 'CONVERT') {
        // Validate conversion is within same category
        if (!units[category].includes(unit1) || !units[category].includes(resultUnit)) {
          throw new Error(`Invalid conversion: ${unit1} → ${resultUnit}. Units must be from ${category} category.`);
        }
        
        response = await quantityAPI.convert(v1, unit1, resultUnit);
        if (response.success) {
          const resultText = `${response.data.result.value} ${response.data.result.unit}`;
          setResult(resultText);
          setValue2(response.data.result.value.toString());
        }
      } 
      else if (action === 'COMPARE') {
        // Validate comparison is within same category
        if (!units[category].includes(unit1) || !units[category].includes(unit2)) {
          throw new Error(`Invalid comparison: Units must be from ${category} category.`);
        }
        
        response = await quantityAPI.compare(v1, unit1, v2, unit2);
        if (response.success) setResult(response.data.result.toString());
      }
      else if (action === 'ARITHMETIC') {
        // Validate arithmetic is within same category
        if (!units[category].includes(unit1) || !units[category].includes(unit2)) {
          throw new Error(`Invalid arithmetic: Units must be from ${category} category.`);
        }
        
        // For arithmetic, use resultUnit for output
        const outputUnit = resultUnit || unit1;
        if (!units[category].includes(outputUnit)) {
          throw new Error(`Invalid result unit: ${outputUnit} must be from ${category} category.`);
        }
        
        const operations = {
          ADD: () => quantityAPI.add(v1, unit1, v2, unit2, outputUnit),
          SUBTRACT: () => quantityAPI.subtract(v1, unit1, v2, unit2, outputUnit),
          DIVIDE: () => quantityAPI.divide(v1, unit1, v2, unit2)
        };
        
        response = await operations[operation]();
        if (response.success) {
          if (operation === 'DIVIDE') {
            // Divide returns just a ratio number, not a unit object
            setResult(`${response.data.result} (ratio)`);
          } else {
            // Add/Subtract return object with value and unit
            setResult(`${response.data.result.value} ${response.data.result.unit}`);
          }
        }
      }
      
      if (!response?.success) throw new Error(response?.error || 'Calculation failed');
    } catch (err) {
      setError(err.message || 'Calculation failed');
      setResult('Error');
    }
    setLoading(false);
  };

  // Debounced calculation
  useEffect(() => {
    // Don't calculate on initial mount when units are empty
    if (!unit1) {
      return;
    }
    
    const timer = setTimeout(() => calculate(), 500);
    return () => clearTimeout(timer);
  }, [value1, value2, unit1, unit2, resultUnit, action, operation]);

  const ActionButton = ({ label, value }) => (
    <button 
      onClick={() => setAction(value)}
      className={`flex-1 py-2 rounded-lg font-semibold transition ${
        action === value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
      }`}
    >
      {label}
    </button>
  );

  const OperationButton = ({ op, symbol }) => (
    <button 
      onClick={() => setOperation(op)}
      className={`flex-1 py-2 rounded-lg font-bold text-lg transition ${
        operation === op ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
      }`}
    >
      {symbol}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Unit Converter</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          <strong>Error:</strong> {error}
          {error.includes('Invalid') && (
            <div className="mt-2 text-xs">
              💡 <strong>Tip:</strong> Make sure your .NET backend ENUMs match these unit names exactly.
              <br />• Length: INCHES, FEET, YARDS, CENTIMETERS
              <br />• Weight: KILOGRAM, GRAM, POUND
              <br />• Temperature: CELSIUS, FAHRENHEIT, KELVIN
              <br />• Volume: LITRE, MILLILITRE, GALLON
            </div>
          )}
        </div>
      )}

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setCategory(cat)}
            className={`p-3 rounded-lg text-center transition ${
              category === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span className="text-xl">{icons[cat]}</span>
            <span className="hidden sm:inline ml-1 capitalize">{cat}</span>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-4">
        <ActionButton label="CONVERT" value="CONVERT" />
        <ActionButton label="COMPARE" value="COMPARE" />
        <ActionButton label="ARITHMETIC" value="ARITHMETIC" />
      </div>

      {/* Arithmetic Operators */}
      {action === 'ARITHMETIC' && (
        <div className="flex gap-2 mb-4">
          <OperationButton op="ADD" symbol="+" />
          <OperationButton op="SUBTRACT" symbol="−" />
          <OperationButton op="DIVIDE" symbol="÷" />
        </div>
      )}

      {/* Value 1 Input */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <label className="text-sm text-gray-500">Value 1</label>
        <div className="flex flex-col sm:flex-row gap-2 mt-1">
          <input 
            type="number" 
            value={value1} 
            onChange={(e) => setValue1(e.target.value)}
            className="flex-1 text-xl p-2 border rounded-lg" 
          />
          <select 
            value={unit1} 
            onChange={(e) => setUnit1(e.target.value)}
            className="w-full sm:w-auto p-2 border rounded-lg bg-white"
          >
            {units[category]?.map(unit => <option key={unit}>{unit}</option>)}
          </select>
        </div>
      </div>

      {/* Value 2 Input (for COMPARE and ARITHMETIC) */}
      {action !== 'CONVERT' && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <label className="text-sm text-gray-500">
            {action === 'COMPARE' ? 'Compare with' : 'Value 2'}
          </label>
          <div className="flex flex-col sm:flex-row gap-2 mt-1">
            <input 
              type="number" 
              value={value2} 
              onChange={(e) => setValue2(e.target.value)}
              className="flex-1 text-xl p-2 border rounded-lg" 
            />
            <select 
              value={unit2} 
              onChange={(e) => setUnit2(e.target.value)}
              className="w-full sm:w-auto p-2 border rounded-lg bg-white"
            >
              {units[category]?.map(unit => <option key={unit}>{unit}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Result Unit Selection */}
      {(action === 'CONVERT' || action === 'ARITHMETIC') && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <label className="text-sm text-gray-500">Result Unit</label>
          <div className="mt-1">
            <select 
              value={resultUnit} 
              onChange={(e) => setResultUnit(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white"
            >
              {units[category]?.map(unit => <option key={unit}>{unit}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Choose the unit for your result (must match {category} category)
            </p>
          </div>
        </div>
      )}

      {/* Result Display */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow p-6 text-white">
        <div className="text-sm opacity-80 mb-2">Result</div>
        <div className="text-2xl sm:text-3xl font-bold break-all">
          {loading ? 'Calculating...' : result}
        </div>
      </div>
    </div>
  );
};

export default Converter;