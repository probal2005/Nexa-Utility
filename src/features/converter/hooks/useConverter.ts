'use client';

import {
  useMemo,
  useState,
} from 'react';

import {
  CONVERTER_CATEGORIES,
  convertValue,
  formatConversionValue,
} from '../lib/converter';

import type {
  ConverterCategory,
} from '../types';

export function useConverter() {
  const [category, setCategory] =
    useState<ConverterCategory>('length');

  const [value, setValue] =
    useState('1');

  const units =
    useMemo(
      () =>
        CONVERTER_CATEGORIES.find(
          (item) =>
            item.id === category,
        )?.units ?? [],
      [category],
    );

  const [fromUnit, setFromUnit] =
    useState('meter');

  const [toUnit, setToUnit] =
    useState('kilometer');

  const numericValue =
    Number.parseFloat(value);

  const result =
    Number.isFinite(numericValue)
      ? convertValue(
          category,
          numericValue,
          fromUnit,
          toUnit,
        )
      : 0;

  const formattedResult =
    formatConversionValue(result);

  function changeCategory(
    nextCategory: ConverterCategory,
  ) {
    const nextUnits =
      CONVERTER_CATEGORIES.find(
        (item) =>
          item.id === nextCategory,
      )?.units ?? [];

    setCategory(nextCategory);
    setFromUnit(
      nextUnits[0]?.id ?? '',
    );
    setToUnit(
      nextUnits[1]?.id ??
        nextUnits[0]?.id ??
        '',
    );
    setValue('1');
  }

  function swapUnits() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  return {
    category,
    value,
    fromUnit,
    toUnit,
    units,
    result,
    formattedResult,
    setValue,
    setFromUnit,
    setToUnit,
    changeCategory,
    swapUnits,
  };
}
