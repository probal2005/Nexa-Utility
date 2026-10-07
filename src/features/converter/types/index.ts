export type ConverterCategory =
  | 'length'
  | 'mass'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'speed'
  | 'time'
  | 'data'
  | 'energy';

export type UnitDefinition = {
  id: string;
  name: string;
  symbol: string;
};

export type ConverterCategoryDefinition = {
  id: ConverterCategory;
  name: string;
  description: string;
  units: UnitDefinition[];
};

export type ConversionResult = {
  value: number;
  fromUnit: string;
  toUnit: string;
  formatted: string;
};
