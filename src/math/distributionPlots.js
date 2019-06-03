import Plotly from 'plotly.js-basic-dist';

const setupLayout = (xMin, xMax, xUnit) => {
  let range = xMax - xMin;
  let defaultTickFontSize = 12;
  let tickFontSize;
  if(range > 80)
    tickFontSize = 10;
  else if(range > 100)
    tickFontSize = 8;
  else 
    tickFontSize = defaultTickFontSize;

  const layoutSettings = {
    showlegend: false,
    xaxis: {
      title: "x",
      titlefont: {size: 16},
      autotick: false,
      tick0: xMin - xUnit,
      dtick: xUnit,
      range: [xMin - xUnit, xMax + xUnit],
      tickfont: {
        size: tickFontSize
      }
    },
    yaxis: {
      title: "p",
      titlefont: {size: 16},
      autotick: false,
      tick0: 0,
      dtick: 0.1,
      range: [0, 1],
      tickfont: {
        size: 12
      }
    }
  };

  return layoutSettings;
}

const defineXUnit = (xList) => {
  let xIsFloat = false;
  xList.forEach(x => {
    xIsFloat = !Number.isInteger(x);
  });

  return xIsFloat ? 0.1 : 1;
}

const distributionFunction = (xList, pList, xUnit, domElement) => {
  let data = [];
  let y = 0;
  const xListWithBounds = [], pListWithBounds = [];

  const layout = setupLayout(Math.min(...xList), Math.max(...xList), xUnit);
  layout.yaxis.range = [0];

  // Creating new advanced array of X values
  xListWithBounds.push(Math.min(...xList) - 2 * xUnit);
  xList.forEach(x => {
    xListWithBounds.push(x);
  });
  xListWithBounds.push(Math.max(...xList) + 2 * xUnit);

  // Creating new advanced array of P values
  pListWithBounds.push(0);
  pList.forEach(p => {
    pListWithBounds.push(p);
  });
  pListWithBounds.push(1);

  // Creating traces with dots
  xListWithBounds.slice(0, -1).forEach((x, index, list) => {
    y += pListWithBounds[index];
    let trace = {
      x: [x, xListWithBounds[index + 1]],
      y: [y, y],
      type: 'scatter',
      mode: 'lines',
      line: {color: '#000'}
    };
    let leftDot = {
      x: [x],
      y: [y],
      type: 'scatter', 
      mode: 'markers',
      marker: { size: 6, color: "#000", symbol: 'triangle-left'}
    };
    let rightDot = {
      x: [list[index + 1]],
      y: [y],
      type: 'scatter', 
      mode: 'markers',
      marker: { size: 6, color: "#000", symbol: 'circle-dot'}
    };
    data.push(trace);

    if(index == 0)
      data.push(rightDot);
    else if(index == list.length - 1)
      data.push(leftDot);
    else
      data.push(leftDot, rightDot);
  });

  Plotly.newPlot(domElement, data, layout, {responsive: true});
}

const distributionPolygon = (xList, pList, domElement) => {
  let trace = {
    x: xList,
    y: pList,
    type: 'scatter',
    mode: 'lines+markers',
    line: {color: "#000"},
  };

  const xUnit = defineXUnit(xList);
  const layout = setupLayout(Math.min(...xList) - 1, Math.max(...xList) + 1, xUnit);
  const data = [trace];
  Plotly.newPlot(domElement, data, layout, {responsive: true});
}

const distributionFunctionAnalyticalExpression = (xList, pList) => {
  let inequality;
  let inequalities = [];
  let segmentProbability = 0;
  xList.forEach((x, index, list) => {
    if(index != 0 && index != list.length - 1) {
      inequality = `\text{${segmentProbability} при $${x}<x${list[index + 1]}\leqslant$}\\`;
      segmentProbability += pList[index];
    }
    else if(index == 0) {
      inequality = `\text{${segmentProbability} при $x\leqslant${x}$}\\`;
      segmentProbability += pList[index];
    }
    else if(index = list.length - 1) 
      inequality = `\text{${segmentProbability} при $x>${x}$}`;
    inequalities.push(inequality);
  });

  let distributionFunctionExpression = `$$F(x)=\n\\begin{cases}`;
  inequalities.forEach(inequality => distributionFunctionExpression + inequality);
  distributionFunctionExpression += "\\end{cases}$$";

  return distributionFunctionExpression;
}

export {distributionPolygon as DistributionPolygon};
export {distributionFunction as DistributionFunction};
