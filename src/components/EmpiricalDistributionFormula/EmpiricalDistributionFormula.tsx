import React, { Component } from 'react';
import { GetEmpiricalDistributionFormula } from '../../math/calculateEmpiricalDistributionFormula';

interface DistributionFormulaSettings {
  values: number[];
  probabilities: number[];
  elementId: string;
};

class EmpiricalDistributionFormula extends Component<DistributionFormulaSettings, {}> {
  constructor(props: DistributionFormulaSettings) {
    super(props);
    console.log(this.props.values);
  }

  componentDidMount() {
    GetEmpiricalDistributionFormula(this.props.probabilities, this.props.values, this.props.elementId);
  }

  componentDidUpdate() {
    GetEmpiricalDistributionFormula(this.props.probabilities, this.props.values, this.props.elementId);
  }

  render() {
    return (
      <div id={this.props.elementId}></div>
    );
  }
}

export default EmpiricalDistributionFormula;