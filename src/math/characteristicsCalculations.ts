import math, { FormatOptions } from 'mathjs';
import { Interval } from './calculations';

const outputFormat: FormatOptions = {notation: 'fixed', precision: 4};

function calculateSelectionAverage(valuesAndFrequencies: Map<number, number>, dataSize: number): number {
  let productionsSum: math.MathType = 0;
  valuesAndFrequencies.forEach((freq: number, num: number) => {
    productionsSum = math.add(productionsSum, math.multiply(freq, num));
  });

  return math.round(math.number(math.divide(productionsSum, dataSize)), 3) as number;
} 

function calculateSelectionVariance(valuesAndFrequencies: Map<number, number>, dataSize: number, selectionAverage: number): number {
  let productionsSum: math.MathType = 0;
  valuesAndFrequencies.forEach((freq: number, num: number) => {
    const difference = math.subtract(num, selectionAverage);
    const differenceSquare = math.pow(difference, 2);
    productionsSum = math.add(productionsSum, math.multiply(differenceSquare, freq));
  });

  return math.round(math.number(math.divide(productionsSum, dataSize)), 4) as number;
}

function calculateSelectionAverageVariance(selectionVariance: number): number {
  return math.sqrt(selectionVariance) ;
}

function calculateSelectionRefinedVariance(selectionVariance: number, dataSize: number): number {
  return math.sqrt(math.divide(math.multiply(selectionVariance, dataSize), dataSize - 1));
}

function formatNumber(num: number): string {
  return math.format(num, outputFormat);
}

export { calculateSelectionAverage as SelectionAverage };
export { calculateSelectionAverageVariance as SelectionAverageVariance };
export { calculateSelectionRefinedVariance as SelectionRefinedVariance };
export { calculateSelectionVariance as SelectionVariance };

export { formatNumber as FormatNumber };