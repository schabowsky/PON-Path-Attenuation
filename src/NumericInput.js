import React from 'react';

const NumericInput = ({onChange, value}) => {
    return (
        <input type="number" min={0} step={1} value={value}
               onChange={e => onChange(e.target.value)}/>
    )
};

export default NumericInput;
