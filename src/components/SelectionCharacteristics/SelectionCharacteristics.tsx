import React from 'react';
import * as Characteristics from '../../math/characteristicsCalculations';
import './SelectionCharacteristics.css';

type SelectionInfo = { values: number[], frequencies: number[], dataSize: number };

type SelectionParameters = {
	average: number,
	averageVariance: number,
	refinedAverageVariance: number,
	variance: number
};

const calculateCharacteristics = (valuesAndFrequencies: Map<number, number>, dataSize: number): SelectionParameters => {
  let characteristics: SelectionParameters = { 
    average: -1, 
    averageVariance: -1,
    refinedAverageVariance: -1,
    variance: -1
  };

  characteristics.average = Characteristics.SelectionAverage(valuesAndFrequencies, dataSize);
  characteristics.variance = Characteristics.SelectionVariance(valuesAndFrequencies, dataSize, characteristics.average);
  characteristics.averageVariance = Characteristics.SelectionAverageVariance(characteristics.variance);
  characteristics.refinedAverageVariance = Characteristics.SelectionRefinedVariance(characteristics.variance, dataSize);

  return characteristics;
}

const selectionCharacteristics = (props: SelectionInfo) => {
  let valuesAndFrequencies: Map<number, number> = new Map<number, number>();
  props.values.forEach((value: number, index: number) => valuesAndFrequencies.set(value, props.frequencies[index]));

  const characteristics: SelectionParameters = calculateCharacteristics(valuesAndFrequencies, props.dataSize);
  return (
    <React.Fragment>
      <p>Средняя выборочная: {Characteristics.FormatNumber(characteristics.average)}</p>
      <p>Дисперсия: {Characteristics.FormatNumber(characteristics.variance)}</p>
      <p>Выборочное среднее квадратическое отклонение: {Characteristics.FormatNumber(characteristics.averageVariance)}</p>
      <p>Исправленное среднее квадратическое отклонение: {Characteristics.FormatNumber(characteristics.refinedAverageVariance)}</p>
    </React.Fragment>
  );
}

export default selectionCharacteristics;