import type {
  ConverterCategory,
  ConverterCategoryDefinition,
} from '../types';

export const CONVERTER_CATEGORIES: ConverterCategoryDefinition[] = [
  {
    id: 'length',
    name: 'Length',
    description: 'Convert distances and dimensions.',
    units: [
      { id: 'meter', name: 'Meter', symbol: 'm' },
      { id: 'kilometer', name: 'Kilometer', symbol: 'km' },
      { id: 'centimeter', name: 'Centimeter', symbol: 'cm' },
      { id: 'millimeter', name: 'Millimeter', symbol: 'mm' },
      { id: 'mile', name: 'Mile', symbol: 'mi' },
      { id: 'yard', name: 'Yard', symbol: 'yd' },
      { id: 'foot', name: 'Foot', symbol: 'ft' },
      { id: 'inch', name: 'Inch', symbol: 'in' },
    ],
  },
  {
    id: 'mass',
    name: 'Weight',
    description: 'Convert weight and mass.',
    units: [
      { id: 'kilogram', name: 'Kilogram', symbol: 'kg' },
      { id: 'gram', name: 'Gram', symbol: 'g' },
      { id: 'milligram', name: 'Milligram', symbol: 'mg' },
      { id: 'pound', name: 'Pound', symbol: 'lb' },
      { id: 'ounce', name: 'Ounce', symbol: 'oz' },
      { id: 'ton', name: 'Metric Ton', symbol: 't' },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    description: 'Convert temperature scales.',
    units: [
      { id: 'celsius', name: 'Celsius', symbol: '°C' },
      { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F' },
      { id: 'kelvin', name: 'Kelvin', symbol: 'K' },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    description: 'Convert surface areas.',
    units: [
      { id: 'square-meter', name: 'Square Meter', symbol: 'm²' },
      { id: 'square-kilometer', name: 'Square Kilometer', symbol: 'km²' },
      { id: 'square-centimeter', name: 'Square Centimeter', symbol: 'cm²' },
      { id: 'square-mile', name: 'Square Mile', symbol: 'mi²' },
      { id: 'square-yard', name: 'Square Yard', symbol: 'yd²' },
      { id: 'square-foot', name: 'Square Foot', symbol: 'ft²' },
      { id: 'acre', name: 'Acre', symbol: 'acre' },
      { id: 'hectare', name: 'Hectare', symbol: 'ha' },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    description: 'Convert liquid and solid volume.',
    units: [
      { id: 'liter', name: 'Liter', symbol: 'L' },
      { id: 'milliliter', name: 'Milliliter', symbol: 'mL' },
      { id: 'cubic-meter', name: 'Cubic Meter', symbol: 'm³' },
      { id: 'gallon', name: 'US Gallon', symbol: 'gal' },
      { id: 'quart', name: 'US Quart', symbol: 'qt' },
      { id: 'pint', name: 'US Pint', symbol: 'pt' },
      { id: 'cup', name: 'US Cup', symbol: 'cup' },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    description: 'Convert travel and motion speeds.',
    units: [
      { id: 'meters-per-second', name: 'Meter / Second', symbol: 'm/s' },
      { id: 'kilometers-per-hour', name: 'Kilometer / Hour', symbol: 'km/h' },
      { id: 'miles-per-hour', name: 'Mile / Hour', symbol: 'mph' },
      { id: 'knot', name: 'Knot', symbol: 'kn' },
      { id: 'foot-per-second', name: 'Foot / Second', symbol: 'ft/s' },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    description: 'Convert durations.',
    units: [
      { id: 'second', name: 'Second', symbol: 's' },
      { id: 'millisecond', name: 'Millisecond', symbol: 'ms' },
      { id: 'minute', name: 'Minute', symbol: 'min' },
      { id: 'hour', name: 'Hour', symbol: 'h' },
      { id: 'day', name: 'Day', symbol: 'day' },
      { id: 'week', name: 'Week', symbol: 'week' },
    ],
  },
  {
    id: 'data',
    name: 'Data',
    description: 'Convert digital storage sizes.',
    units: [
      { id: 'byte', name: 'Byte', symbol: 'B' },
      { id: 'kilobyte', name: 'Kilobyte', symbol: 'KB' },
      { id: 'megabyte', name: 'Megabyte', symbol: 'MB' },
      { id: 'gigabyte', name: 'Gigabyte', symbol: 'GB' },
      { id: 'terabyte', name: 'Terabyte', symbol: 'TB' },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    description: 'Convert common energy units.',
    units: [
      { id: 'joule', name: 'Joule', symbol: 'J' },
      { id: 'kilojoule', name: 'Kilojoule', symbol: 'kJ' },
      { id: 'calorie', name: 'Calorie', symbol: 'cal' },
      { id: 'kilocalorie', name: 'Kilocalorie', symbol: 'kcal' },
      { id: 'watt-hour', name: 'Watt Hour', symbol: 'Wh' },
      { id: 'kilowatt-hour', name: 'Kilowatt Hour', symbol: 'kWh' },
    ],
  },
];

const LINEAR_FACTORS: Record<
  ConverterCategory,
  Record<string, number>
> = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.344,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
  },

  mass: {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    pound: 0.45359237,
    ounce: 0.028349523125,
    ton: 1000,
  },

  area: {
    'square-meter': 1,
    'square-kilometer': 1_000_000,
    'square-centimeter': 0.0001,
    'square-mile': 2_589_988.110336,
    'square-yard': 0.83612736,
    'square-foot': 0.09290304,
    acre: 4046.8564224,
    hectare: 10_000,
  },

  volume: {
    liter: 1,
    milliliter: 0.001,
    'cubic-meter': 1000,
    gallon: 3.785411784,
    quart: 0.946352946,
    pint: 0.473176473,
    cup: 0.2365882365,
  },

  speed: {
    'meters-per-second': 1,
    'kilometers-per-hour': 1 / 3.6,
    'miles-per-hour': 0.44704,
    knot: 0.5144444444,
    'foot-per-second': 0.3048,
  },

  time: {
    second: 1,
    millisecond: 0.001,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
  },

  data: {
    byte: 1,
    kilobyte: 1024,
    megabyte: 1024 ** 2,
    gigabyte: 1024 ** 3,
    terabyte: 1024 ** 4,
  },

  energy: {
    joule: 1,
    kilojoule: 1000,
    calorie: 4.184,
    kilocalorie: 4184,
    'watt-hour': 3600,
    'kilowatt-hour': 3_600_000,
  },

  temperature: {},
};

function convertTemperature(
  value: number,
  from: string,
  to: string,
): number {
  let celsius: number;

  if (from === 'celsius') {
    celsius = value;
  } else if (from === 'fahrenheit') {
    celsius = (value - 32) * (5 / 9);
  } else {
    celsius = value - 273.15;
  }

  if (to === 'celsius') {
    return celsius;
  }

  if (to === 'fahrenheit') {
    return celsius * (9 / 5) + 32;
  }

  return celsius + 273.15;
}

export function convertValue(
  category: ConverterCategory,
  value: number,
  from: string,
  to: string,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (from === to) {
    return value;
  }

  if (category === 'temperature') {
    return convertTemperature(
      value,
      from,
      to,
    );
  }

  const factors =
    LINEAR_FACTORS[category];

  if (!factors[from] || !factors[to]) {
    return value;
  }

  return (
    (value * factors[from]) /
    factors[to]
  );
}

export function formatConversionValue(
  value: number,
): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  if (Math.abs(value) < 0.000001) {
    return value.toExponential(6);
  }

  return Number(
    value.toPrecision(12),
  ).toString();
}

export function getCategory(
  category: ConverterCategory,
) {
  return CONVERTER_CATEGORIES.find(
    (item) => item.id === category,
  )!;
}
