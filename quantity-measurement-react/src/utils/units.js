export const units = {
  length: {
    base: 'meter',
    data: {
      meter: 1, 
      kilometer: 0.001, 
      centimeter: 100, 
      millimeter: 1000,
      mile: 0.000621371, 
      yard: 1.09361, 
      foot: 3.28084, 
      inch: 39.3701
    }
  },
  weight: {
    base: 'kilogram',
    data: {
      kilogram: 1, 
      gram: 1000, 
      milligram: 1000000,
      pound: 2.20462, 
      ounce: 35.274, 
      ton: 0.001
    }
  },
  temperature: {
    base: 'celsius',
    isSpecial: true,
    conversions: {
      celsius: { toBase: v => v, fromBase: v => v },
      fahrenheit: { toBase: v => (v - 32) * 5/9, fromBase: v => (v * 9/5) + 32 },
      kelvin: { toBase: v => v - 273.15, fromBase: v => v + 273.15 }
    }
  },
  volume: {
    base: 'liter',
    data: {
      liter: 1, 
      milliliter: 1000, 
      gallon: 0.264172,
      quart: 1.05669, 
      cup: 4.22675, 
      'fluid ounce': 33.814
    }
  }
};

export const getUnitsForCategory = (category) => {
  const cat = units[category];
  return cat.isSpecial ? Object.keys(cat.conversions) : Object.keys(cat.data);
};

export const convertToBase = (value, unit, category) => {
  const cat = units[category];
  if (!cat) {
    console.error(`Category "${category}" not found`);
    return 0;
  }
  
  if (!unit) {
    console.error(`Unit is undefined for category "${category}"`);
    return 0;
  }
  
  if (cat.isSpecial) {
    if (!cat.conversions[unit]) {
      console.error(`Unit "${unit}" not found in conversions for category "${category}"`);
      return 0;
    }
    return cat.conversions[unit].toBase(value);
  }
  
  if (!cat.data[unit]) {
    console.error(`Unit "${unit}" not found in data for category "${category}"`);
    return 0;
  }
  
  return value / cat.data[unit];
};

export const convertFromBase = (value, unit, category) => {
  const cat = units[category];
  if (!cat) {
    console.error(`Category "${category}" not found`);
    return 0;
  }
  
  if (!unit) {
    console.error(`Unit is undefined for category "${category}"`);
    return 0;
  }
  
  if (cat.isSpecial) {
    if (!cat.conversions[unit]) {
      console.error(`Unit "${unit}" not found in conversions for category "${category}"`);
      return 0;
    }
    return cat.conversions[unit].fromBase(value);
  }
  
  if (!cat.data[unit]) {
    console.error(`Unit "${unit}" not found in data for category "${category}"`);
    return 0;
  }
  
  return value * cat.data[unit];
};

export const formatResult = (value) => {
  return value.toFixed(3).replace(/\.?0+$/, '');
};
