import React, { Component } from 'react';
import { DistributionFunction } from '../../../math/distributionPlots';
import '../Plot.css';

interface FunctionPlotSettings {
  xList: number[];
  pList: number[];
  xUnit: number;
  elementId: string;
};

class FunctionPlot extends Component<FunctionPlotSettings, any> {
  constructor(props: FunctionPlotSettings) {
    super(props);
  }

  componentDidMount() {
    if(this.props.xList.length != 0 && this.props.pList.length != 0) // && this.props.xList.length == this.props.pList.length) {
      DistributionFunction(this.props.xList, this.props.pList, this.props.xUnit, this.props.elementId);
  }

  componentDidUpdate() {
    if(this.props.xList.length != 0 && this.props.pList.length != 0) // && this.props.xList.length == this.props.pList.length)
      DistributionFunction(this.props.xList, this.props.pList, this.props.xUnit, this.props.elementId);
  }

  render() {
    return <div id={this.props.elementId}></div>;
  }
}

export default FunctionPlot;