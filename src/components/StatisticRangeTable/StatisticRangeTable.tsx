import React from 'react';
import ControlledInput from '../ControlledInput/ControlledInput';
import './StatisticRangeTable.css';

type RangeTableProps = {
  valuesNumber: number;
  x: Array<any>;
  n: Array<any>;
  xListHandler: (event: any) => void;
  nListHandler: (event: any) => void;
  cellsOptions: {};
  mappedValueName: string;
  valueName: any
};

const statisticRangeTable = (props: RangeTableProps) => {
  let valuesNumber;
  valuesNumber = Number.parseInt(props.valuesNumber.toString());
  if(Number.isNaN(valuesNumber) || valuesNumber === undefined)
    valuesNumber = 0;
  let xListCells = new Array(valuesNumber).fill(undefined),
      nListCells = new Array(valuesNumber).fill(undefined);

  xListCells = xListCells.map((_, index) => {
    let key = `x${index}`;
    return <td key={key}><ControlledInput 
                inputName={key} 
                labelText=''
                value={props.x[index]}
                handler={props.xListHandler}
                options={props.cellsOptions}
              /></td>
  });

  nListCells = nListCells.map((_, index) => {
    let key = `n${index}`;
    return <td key={key}><ControlledInput 
                inputName={key} 
                labelText=''
                value={props.n[index]}
                handler={props.nListHandler}
                options={props.cellsOptions}
              /></td>
  });

  return (
    <div className="rangeForm">
      <table className="range">
        <tbody>
          <tr className="xList">
            <td>{props.valueName}</td>
            {xListCells}
          </tr>
          <tr className="pList">
            <td>{props.mappedValueName}<sub>i</sub></td>
            {nListCells}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default statisticRangeTable;