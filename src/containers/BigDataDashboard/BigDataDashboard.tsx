import React, { Component } from 'react'; 
import StatisticRangeTable from '../../components/StatisticRangeTable/StatisticRangeTable';
import FunctionPlot from '../../components/Plots/FunctionPlot/FunctionPlot';
import DistributionFormula from '../../components/DistributionFormula/DistributionFormula';
import EmpiricalDistributionFormula from '../../components/EmpiricalDistributionFormula/EmpiricalDistributionFormula';

import SelectionCharacteristics from '../../components/SelectionCharacteristics/SelectionCharacteristics';

import { FrequenciesHistogram } from '../../math/createHistogram';

import { DashboardState, SelectionParameters } from '../SmallDataDashboard/SmallDataDashboard'; 
import { ReadStatisticalFile, ParseStatisticalData } from '../../helpers';
import { CalculateUniqueValuesFrequencies, SortData, RoundNumber, MakeIntervals, CalculateIntervalsFrequencies, Interval, IntervalsRelativeFrequencies, IntervalsMids } from '../../math/calculations';
import ControlledInput from '../../components/ControlledInput/ControlledInput';

import './BigDataDashboard.css';

enum DataInputType {
  Manual,
  File
};

enum StatisticalRangeType {
  Grouped,
  Interval
}

type BigDataDashboardState = DashboardState & {
  intervalsNumber: number, 
  intervals: Array<Interval>, 
  intervalsFrequencies: number[], 
  dataIsLoaded: boolean,
  inputType: DataInputType | undefined,
  inputIntervals: Array<string>
}; // Types intersection

class BigDataDashboard extends Component<{}, BigDataDashboardState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      dataIsLoaded: false,
      intervalsNumber: 0,
      intervals: [],
      intervalsFrequencies: [],
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
      showResults: false,
      inputType: undefined,
      inputIntervals: []
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
        dataIsLoaded: true,
				statisticalData: statisticalData, 
				values: values, 
				valuesFrequencies: valuesFrequencies, 
				valuesNumber: valuesNumber,
				valuesRelativeFrequencies: valuesRelativeFrequencies
			}
		);
  }
  
  handleIntervalsNumberChange = (e: any) => {
    const intervalsNumber: any = e.target.value;
    let intervalsNumberValue: number = Number.parseFloat(intervalsNumber);
    if(Number.isNaN(intervalsNumberValue))
      intervalsNumberValue = 0;
    this.setState({intervalsNumber: intervalsNumberValue, showResults: false, inputIntervals: Array(intervalsNumberValue).fill('(]')});
  }

  readStatisticalFile = (e: any) => {
		ReadStatisticalFile(e, this.setStatisticalData);
  }
  
  calculateWithIntervals = () => {
    let valuesAndFrequencies: Map<number, number> = new Map<number, number>();
    this.state.values.forEach((value: number, index: number) => valuesAndFrequencies.set(value, this.state.valuesFrequencies[index]));
    
    const minValue = this.state.values[0];
    const maxValue = this.state.values[this.state.values.length - 1];

    let intervals: Array<Interval> = [];
    let intervalsFrequencies: number[] = [];

    if(this.state.intervalsNumber !== 0 && this.state.intervalsNumber !== undefined)
    {
      intervals = MakeIntervals(minValue, maxValue, this.state.intervalsNumber);
      intervalsFrequencies = CalculateIntervalsFrequencies(intervals, valuesAndFrequencies);
    }

    this.setState({
      intervals: intervals,
      intervalsFrequencies: intervalsFrequencies,
      showResults: true
    });
  }

  calculate = () => {
    const statisticalDataLength = this.state.intervalsFrequencies.reduce((freqSum: number, freq: number) => freqSum + freq, 0);
    this.setState({showResults: true, statisticalData: Array(statisticalDataLength)});
  }
  
  componentDidUpdate() {
    if(this.state.showResults == true)
    {
      const intervalRelativeFrequencies = IntervalsRelativeFrequencies(this.state.intervalsFrequencies, this.state.intervals[0][1] - this.state.intervals[0][0], this.state.statisticalData.length);
      FrequenciesHistogram(this.state.intervals, intervalRelativeFrequencies, 'frequenciesHistogram');
    }
  }

  handleInputTypeChange = (inputType: DataInputType) => {
    this.setState({inputType: inputType});
  }

  handleIntervalInput = (event: any) => {
    const interval = event.target.value;
    const inputName = event.target.name;
    const intervalFormat: RegExp = /\d+\.?\d*,\d+\.?\d*/;
    let intervalFormatMatch = interval.match(intervalFormat);
    
    this.setState((state: BigDataDashboardState) => {
      const intervalIndex: number = Number.parseInt(inputName.slice(1));

      let realInterval: Interval = [0, 0];
      if(intervalFormatMatch !== null && intervalFormatMatch.length !== 0)
      {
        const intervalBounds = intervalFormatMatch[0];
        const intervalValues = intervalBounds.split(',');

        realInterval = intervalValues.map((intervalBound: string) => Number.parseFloat(intervalBound));
      }

      const currentInputIntervals = this.state.inputIntervals;
      currentInputIntervals[intervalIndex] = interval;

      const currentIntervals = this.state.intervals;
      currentIntervals[intervalIndex] = realInterval;

      return {inputIntervals: currentInputIntervals, intervals: currentIntervals};
    });
  }

  handleIntervalFrequencyInput = (event: any) => {
    let inputFrequency = event.target.value;
    let frequency = Number.parseInt(inputFrequency);
    const frequencyIndex = Number.parseInt(event.target.name.slice(1));

    if(!Number.isNaN(frequency))
    {
      let currentFrequencies = this.state.intervalsFrequencies;
      currentFrequencies[frequencyIndex] = frequency;
      this.setState({intervalsFrequencies: currentFrequencies});
    }
  }

  render() {
    const inputChoiceTabs = [
      <span 
        key="manual" 
        onClick={() => this.handleInputTypeChange(DataInputType.Manual)}
        className={this.state.inputType === DataInputType.Manual ? 'active' : ''}
      >Ручной ввод интервального ряда распределения
      </span>,
      
      <span 
        key="file" 
        onClick={() => this.handleInputTypeChange(DataInputType.File)}
        className={this.state.inputType === DataInputType.File ? 'active' : ''}
      >Ввод данных из файла
      </span>
    ];

    let dataInput: any;

    switch(this.state.inputType) {
      case DataInputType.Manual:
        dataInput = 
          <React.Fragment>
            <p>Формат ввода: {'(<левая граница>,<правая граница>]'}</p>
            <StatisticRangeTable 
              x={this.state.inputIntervals} 
              n={this.state.intervalsFrequencies} 
              valuesNumber={this.state.intervalsNumber}
              cellsOptions={{}}
              valueName={<span>(x<sub>i</sub>, x<sub>i+1</sub>]</span>}
              mappedValueName="n"
              xListHandler={this.handleIntervalInput}
              nListHandler={this.handleIntervalFrequencyInput}
            />
          </React.Fragment>
        ;
        break;
      case DataInputType.File:
        dataInput=<input type="file" id="statisticalDataFileInput" onChange={this.readStatisticalFile} />;
        break;
      default:
        dataInput=<p>Выберите тип ввода данных</p>
    }

    return (
      <div className="bigDataDashboard">
        <div className="dataInputTypeTabs flexbox">
          {inputChoiceTabs}
        </div>
        {dataInput}

        <ControlledInput 
          labelText="Количество интервалов" 
          value={this.state.intervalsNumber} 
          handler={this.handleIntervalsNumberChange} 
          inputName="intervalsNumberInput" 
          options={{disabled: !this.state.dataIsLoaded && (this.state.inputType === undefined || this.state.inputType === DataInputType.File)}}
        />

        {this.state.showResults &&
          <React.Fragment>
            {this.state.inputType === DataInputType.File && 
              <React.Fragment>
                <h2>Интервальный ряд частот: </h2>
          
                <StatisticRangeTable 
                  x={this.state.intervals} 
                  n={this.state.intervalsFrequencies} 
                  valuesNumber={this.state.intervalsNumber}
                  cellsOptions={{disabled: true}}
                  mappedValueName="n"
                  valueName={<span>(x<sub>i</sub>, x<sub>i+1</sub>]</span>}
                  xListHandler={function() {}}
                  nListHandler={function() {}}
                />
              </React.Fragment>
            }

            <h2>Интервальный ряд относительных частот: </h2>
          
            <StatisticRangeTable 
              x={this.state.intervals} 
              n={this.state.intervalsFrequencies.map((freq: number) => freq / this.state.statisticalData.length)} 
              valuesNumber={this.state.intervalsNumber}
              cellsOptions={{disabled: true}}
              mappedValueName="n"
              valueName={<span>(x<sub>i</sub>, x<sub>i+1</sub>]</span>}
              xListHandler={function() {}}
              nListHandler={function() {}}
            />
          </React.Fragment>
        }

        {this.state.showResults && this.state.valuesNumber <= 20 && this.state.inputType === DataInputType.File &&
          <React.Fragment>
            <h2>Группированный ряд частот: </h2>
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

            <h2>Группированный ряд относительных частот: </h2>
            <StatisticRangeTable 
              x={this.state.values} 
              n={this.state.valuesFrequencies.map((freq: number) => freq / this.state.statisticalData.length)} 
              valuesNumber={this.state.valuesNumber}
              cellsOptions={{disabled: true}}
              mappedValueName="n"
              valueName={<span>x<sub>i</sub></span>}
              xListHandler={function() {}}
              nListHandler={function() {}}
            />
            
            <h3>Эмпирическая функция распределения (по группированному ряду): </h3>
            <DistributionFormula 
              values={this.state.values}
              probabilities={this.state.valuesFrequencies.map((freq: number) => freq / this.state.statisticalData.length)}
              elementId="GroupedRangeDistributionFormula"
            />

            <h3>График эмпирической функции распределения (по группированному ряду): </h3>
            <FunctionPlot
              xList={this.state.values}
              pList={this.state.valuesFrequencies.map((freq: number) => freq / this.state.statisticalData.length)}
              xUnit={0.1}
              elementId="GroupedRangeDistributionPlot"
            />
          </React.Fragment>
        }
        {this.state.showResults && 
          <React.Fragment>
            <h3>Эмпирическая функция распределения (по интервальному ряду): </h3>
            <EmpiricalDistributionFormula 
              values={Array.from(new Set(this.state.intervals.flat()))}
              probabilities={this.state.intervalsFrequencies.map((freq: number) => freq / this.state.statisticalData.length)}
              elementId="IntervalRangeDistributionFormula"
            />

            <h3>График эмпирической функции распределения (по интервальному ряду): </h3>
            <FunctionPlot
              xList={Array.from(new Set(this.state.intervals.flat())).slice(0, -1)}
              pList={this.state.intervalsFrequencies.map((freq: number) => freq / this.state.statisticalData.length)}
              xUnit={RoundNumber(this.state.intervals[0][1] - this.state.intervals[0][0], 3)}
              elementId="IntervalRangeDistributionPlot"
            />
          </React.Fragment>
        }

        { this.state.showResults &&
          <div id="frequenciesHistogram"></div>
        }

        {this.state.showResults && 
          <SelectionCharacteristics 
            values={IntervalsMids(this.state.intervals)}
            frequencies={this.state.intervalsFrequencies}
            dataSize={this.state.statisticalData.length}
          />
        }

        <button 
          className="submitButton" 
          onClick={this.state.inputType === DataInputType.File ? this.calculateWithIntervals : this.calculate}
          disabled={this.state.intervalsNumber == 0 || this.state.intervalsNumber == undefined}
        >Вычислить</button>
      </div>
    );
  }
}

export default BigDataDashboard;