import math from 'mathjs';

function arraySum(arr, until) {
  let sum = math.bignumber(0);
  for (let i = 0; i < until && i < arr.length; ++i) {
    sum = math.add(sum, math.bignumber(arr[i]));
  }
  return math.number(sum);
}

function makeIndex(i) {
  return "<sub>" + i + "</sub>";
}

function makeProbsString(index) {
  let string = "";
  for (let i = 0; i < index; ++i) {
    string += "p" + makeIndex(i + 1);
    if (i + 1 != index)
      string += " + ";
  }
  return string;
}

function getSpecificFormula(probs, values, index) {
  let length = probs.length;
  let string = "";
  if (index == 0) {
    string = "F(x) = 0 при x < " + values[index];
    return string;
  }

  let probsString = makeProbsString(index);
  let sum = arraySum(probs, index);

  string += "F(x) = ";
  string += probsString;
  string += " = " + sum;

  string += " при " + values[index - 1] + " < x ≤ " + values[index];

  if (index + 1 == probs.length) {
    string += "<br>";
    let probsString = makeProbsString(index + 1);
    string += "F(x) = ";
    string += probsString;
    string += " = 1";
    string += " при x > " + values[index];
    
  }

  return string;
}

function getFormulas(probs, values, elemId) {
  let string = "";
  let length = probs.length;
  for (let i = 0; i < length; ++i) {
    string += getSpecificFormula(probs, values, i) + "<br>";
  }

  document.getElementById(elemId).innerHTML += string;
}

export { getFormulas as GetDistributionFormula };