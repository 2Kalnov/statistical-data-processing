import React, { Component } from 'react';
import { GetDistributionFormula } from '../../math/calculateDistributionFormula';

interface DistributionFormulaSettings {
  values: number[];
  probabilities: number[];
  elementId: string;
};

class DistributionFormula extends Component<DistributionFormulaSettings, {}> {
  constructor(props: DistributionFormulaSettings) {
    super(props);
    console.log(this.props.values);
  }

  componentDidMount() {
    GetDistributionFormula(this.props.probabilities, this.props.values, this.props.elementId);
  }

  componentDidUpdate() {
    GetDistributionFormula(this.props.probabilities, this.props.values, this.props.elementId);
  }

  render() {
    return (
      <div id={this.props.elementId}></div>
    );
  }
}

export default DistributionFormula;