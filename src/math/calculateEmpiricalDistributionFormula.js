import math from 'mathjs';

function arraySum(arr, until) {
  let sum = 0;
  for (let i = 0; i < until && i < arr.length; ++i) {
    sum = math.add(sum, arr[i]);
  }
  return sum;
}

function makeIndex(i) {
  return "<sub>" + i + "</sub>";
}

function makeProbsString(index) {
  let string = "";
  for (let i = 0; i < index; ++i) {
    string += "w" + makeIndex(i + 1);
    if (i + 1 != index)
      string += " + ";
  }
  return string;
}

function getSpecificFormula(probs, values, index) {
  let length = probs.length;
  let string = "";
  if (index == 0) {
    string = "F(x) = 0 при (-∞; " + values[index] + "]";
    return string;
  }

  let probsString = makeProbsString(index);
  let sum = arraySum(probs, index);

  string += "F(x) = ";
  string += probsString;
  string += " = " + sum;

  string += " при (" + values[index - 1] + "; " + values[index] + "]";

  if (index == probs.length) {
    string += "<br>";
    let probsString = makeProbsString(index);
    string += "F(x) = ";
    string += probsString;
    string += " = 1";
    string += " при (" + values[index] + "; +∞)";
    
  }

  return string;
}

function getFormulas(probs, values, elemId) {
  let string = "";
  let length = probs.length;
  for (let i = 0; i < length + 1; ++i) {
    string += getSpecificFormula(probs, values, i) + "<br>";
  }

  document.getElementById(elemId).innerHTML += string;
}

export { getFormulas as GetEmpiricalDistributionFormula };