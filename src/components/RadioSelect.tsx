import styled from 'styled-components';
import { Fragment, ReactElement } from 'react';

export interface RadioOption {
  id: string;
}

export interface RadioSelectProps<T> {
  id: string
  options: T[];
  selected: T;
  onSelect: (option: T) => void;
  renderContent: (option: T) => ReactElement,
}

export const RadioSelect = <T extends RadioOption,>({id, options, selected, onSelect, renderContent}: RadioSelectProps<T>) => {
  return (
    <div>
      {options.map(item => (
        <Fragment key={item.id}>
          <HiddenInput
            type="radio"
            name={id}
            id={item.id}
            value={item.id}
            checked={selected.id === item.id}
            onChange={() => onSelect(item)}
          />
          <Label htmlFor={item.id}>
            {renderContent(item)}
          </Label>
        </Fragment>
      ))}
    </div>
  )
}


const Label = styled.label`
  display: inline-block;
  border: 1px solid #e3e3e3;
  padding: 0.4rem 0.8rem;
  border-radius: 0.3rem;
  box-shadow: 0 2px 2px 0 #0000000d, 0 3px 5px 0 #00000000;
  
  cursor: pointer;
  
  &:not(:first-of-type) {
    margin-left: 0.4rem;
  }
`;

const HiddenInput = styled.input`
  display: none;
  
  &:not(:checked) + ${Label} {
    color: #888;
  }
  
  &:checked + ${Label} {
    border-color: var(--primary);
  }
`;

export default RadioSelect;
