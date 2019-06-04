import React, { Component } from 'react';
import StatisticRangeTable from '../../components/StatisticRangeTable/StatisticRangeTable';
import FunctionPlot from '../../components/Plots/FunctionPlot/FunctionPlot';
import DistributionFormula from '../../components/DistributionFormula/DistributionFormula';
import SelectionCharacteristics from '../../components/SelectionCharacteristics/SelectionCharacteristics';

import { CalculateUniqueValuesFrequencies, SortData, RoundNumber } from '../../math/calculations';
import { ReadStatisticalFile, ParseStatisticalData } from '../../helpers';
import './SmallDataDashboard.css';

export type SelectionParameters = {
	average: number,
	averageVariance: number,
	refinedVariance: number,
	variance: number
};

export type DashboardState = {
	valuesNumber: number
	values: number[], 
	valuesFrequencies: number[],
	valuesRelativeFrequencies: number[],
	statisticalData: number[],
	characteristics: SelectionParameters,
	showResults: boolean
};

class SmallDataDashboard extends Component<{}, DashboardState> {
	constructor(props: {}) {
		super(props);

		this.state = {
			values: [],
			valuesFrequencies: [],
			valuesRelativeFrequencies: [],
			statisticalData: [],
			valuesNumber: 0,
			characteristics: {
				average: 0, 
				averageVariance: 0,
				refinedVariance: 0,
				variance: 0
			},
			showResults: false
		};
	}

	setStatisticalData = (data: string) => {
		const statisticalData = ParseStatisticalData(data);
		const valuesAndFrequencies: Map<number, number> = CalculateUniqueValuesFrequencies(statisticalData, SortData(statisticalData));
		const dataSize = statisticalData.length;

		let values: number[] = [];
		let valuesFrequencies: number[] = [];
		let valuesRelativeFrequencies: number[] = [];

		valuesAndFrequencies.forEach((freq: number, num: number) => {
			values.push(num);
			valuesFrequencies.push(freq);
		});

		valuesFrequencies.forEach((freq: number) => {
			valuesRelativeFrequencies.push(RoundNumber(freq/dataSize, 3));
		});

		const valuesNumber = values.length;

		this.setState(
			{ 
				statisticalData: statisticalData, 
				values: values, 
				valuesFrequencies: valuesFrequencies, 
				valuesNumber: valuesNumber,
				valuesRelativeFrequencies: valuesRelativeFrequencies,
				showResults: true
			}
		);
	}

	readStatisticalFile = (e: any) => {
		ReadStatisticalFile(e, this.setStatisticalData);
	}

	render() {
		return (
			<div className="smallDataDashboard">
				<input type="file" id="statisticalDataFileInput" onChange={this.readStatisticalFile} />

				<h2>Статистический ряд частот: </h2>
				<StatisticRangeTable 
					x={this.state.values} 
					n={this.state.valuesFrequencies} 
					valuesNumber={this.state.valuesNumber}
					cellsOptions={{disabled: true}}
					mappedValueName="n"
					valueName={<span>x<sub>i</sub></span>}
					xListHandler={function() {}}
					nListHandler={function() {}}
				/>  

				<h2>Статистический ряд относительных частот: </h2>
				<StatisticRangeTable 
					x={this.state.values} 
					n={this.state.valuesRelativeFrequencies} 
					valuesNumber={this.state.valuesNumber}
					cellsOptions={{disabled: true}}
					mappedValueName="w"
					valueName={<span>x<sub>i</sub></span>}
					xListHandler={function() {}}
					nListHandler={function() {}}
				/>

				<h2>Аналитическое выражение эмпирической функции распределения</h2>
				<DistributionFormula 
					probabilities={this.state.valuesRelativeFrequencies}
					values={this.state.values}
					elementId="DistributionFormula"
				/>

				<FunctionPlot 
					xList={this.state.values}
					pList={this.state.valuesRelativeFrequencies}
					xUnit={0.1}
					elementId="DistributionPlot"
				/>

				{this.state.showResults &&
					<SelectionCharacteristics 
						values={this.state.values} 
						frequencies={this.state.valuesFrequencies} 
						dataSize={this.state.statisticalData.length}
					/>
				}
			</div>
		);
	}
}

export default SmallDataDashboard;