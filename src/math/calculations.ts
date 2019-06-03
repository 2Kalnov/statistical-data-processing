import math from 'mathjs';

export type Interval = [number, number];

function calculateIntervalLength(minValue: number, maxValue: number, intervalsNumber: number): [number, number] {
	let decimalsNumber: number = math.isInteger(minValue) && math.isInteger(maxValue) ? 0 : 1;
	let intervalLength: any;
	intervalLength = math.number((maxValue - minValue) / intervalsNumber);
	console.log(intervalLength);
	return [roundIntervalLength(intervalLength), intervalLength];
}

function makeIntervals(minValue: number, maxValue: number, intervalsNumber: number): Array<Interval> {
	const calculatedIntervalLength = calculateIntervalLength(minValue, maxValue, intervalsNumber);
	const intervalLength = calculatedIntervalLength[0];
	const roundOverRun = intervalLength - calculatedIntervalLength[1];
	const totalRoundOverRun = roundOverRun * intervalsNumber;
	console.log(`Round overrun is ${roundOverRun}`);
	console.log(`Rounded interval length is ${intervalLength}`);
	const firstIntervalStart: math.BigNumber = math.bignumber(minValue - totalRoundOverRun / 2);

	let lastBorder: math.BigNumber = firstIntervalStart;
	let intervalsBorders: Array<math.BigNumber> = [lastBorder];

	while (math.smaller(lastBorder, maxValue)) {
		lastBorder = <math.BigNumber>math.add(lastBorder, intervalLength);
		intervalsBorders.push(lastBorder);
	}
	console.log(intervalsBorders);

	let intervals: Array<Interval> = [];
	intervalsBorders.slice(0, -1).forEach((num, index) => {
		const interval: Interval = [<number>math.number(num), <number>math.number(intervalsBorders[index + 1])];
		intervals.push(interval);
	});

	return intervals;
}

function sortData(data: number[]) {
	let sortedData = Array.from(new Set(data)).sort((a: number, b: number) => a - b);
	return sortedData;
}

function calculateIntervalsFrequencies(intervals: Array<Interval>, valuesFrequencies: Map<number, number>) {
	const dataMinValue: number = Array.from(valuesFrequencies.keys())[0];
	let intervalsFrequencies: number[] = [];

	intervals.forEach((interval: Interval, index: number) => {
		const countValuesOnIntervalLeftBound: boolean = index == 0 && interval[0] == dataMinValue;

		valuesFrequencies.forEach((freq, num) => {
			if(( math.largerEq(num, interval[0]) && countValuesOnIntervalLeftBound || math.larger(num, interval[0]) ) && math.smallerEq(num, interval[1]))
				if(intervalsFrequencies[index] == undefined)
					intervalsFrequencies[index] = freq;
				else
					intervalsFrequencies[index] += freq;
		});
	});

	return intervalsFrequencies;
}

function calculateUniqueValuesFrequencies(data: number[], sortedData: number[]): Map<number, number> {
	let frequencies: Map<number, number> = new Map<number, number>();
	sortedData.forEach(num => frequencies.set(num, 0));
	data.forEach(num => {
		let currentRate = frequencies.get(num);
		if(currentRate !== undefined)
			frequencies.set(num, currentRate + 1);
	});

	return frequencies;
}

function roundNumber(number: number, digitsAfterZero: number): number {
	return math.round(number, digitsAfterZero) as number;
}

function makeStatisticRange(data: number[]): Map<number, number> {
	const sortedData = sortData(data);
	return calculateUniqueValuesFrequencies(data, sortedData);
}

function roundIntervalLength(intervalLength: number): number {
	let roundPrecision: number = 0;
	if(math.smaller(intervalLength, 0.5))
		roundPrecision = 2;
	else if(math.smaller(intervalLength, 1))
		roundPrecision = 1;

	let decimalsAfterDot: number = 0;
	let roundedIntervalLength: number = intervalLength;
	while(math.smaller(roundedIntervalLength, math.pow(10, roundPrecision - 1))) {
		roundedIntervalLength = roundedIntervalLength * 10;
		decimalsAfterDot += 1;
	}

	roundedIntervalLength = math.ceil(roundedIntervalLength);

	let bigRoundedIntervalLength = math.bignumber(roundedIntervalLength);

	for(let i: number = 1; i <= decimalsAfterDot; i += 1)
		bigRoundedIntervalLength = <math.BigNumber>math.divide(bigRoundedIntervalLength, 10);

	return <number>math.number(bigRoundedIntervalLength);
}

function calculateIntervalsRelativeFrequencies(intervalsFrequencies: number[], intervalLength: number, dataSize: number): number[] {
	return intervalsFrequencies.map((freq: number) => <number>math.divide(freq, math.multiply(dataSize, intervalLength)));
}


function findIntervalsMids(intervals: Array<Interval>): Array<number> {
  return intervals.map((interval: Interval) => <number>math.divide(math.add(interval[0], interval[1]), 2));
}

export { sortData as SortData };
export { makeIntervals as MakeIntervals };
export { makeStatisticRange as MakeStatisticRange };
export { calculateIntervalsFrequencies as CalculateIntervalsFrequencies };
export { calculateUniqueValuesFrequencies as CalculateUniqueValuesFrequencies };
export { roundNumber as RoundNumber };
export { calculateIntervalsRelativeFrequencies as IntervalsRelativeFrequencies };
export { findIntervalsMids as IntervalsMids };