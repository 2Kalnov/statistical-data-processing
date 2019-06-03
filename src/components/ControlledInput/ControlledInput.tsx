import React from 'react';

type InputProps = {
  labelText: string,
  value: any,
  inputName: string,
  handler: (e: any) => void,
  options: any
};

const controlledInput = (props: InputProps) => {
  return (
    <label>
      {props.labelText}
      <input type="text" value={props.value} name={props.inputName} onChange={(e) => props.handler(e)} {...props.options}/>
    </label>
  );
}

export default controlledInput; 