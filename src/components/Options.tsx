import styled from 'styled-components';
import RadioSelect from './RadioSelect';
import { SpeedOption, speedOptions } from '../config/options/speed';
import { ResolutionOption, resolutionOptions } from '../config/options/resolution';


export interface OptionsProps {
  speed: SpeedOption,
  selectSpeed: (option: SpeedOption) => void,
  resolution: ResolutionOption,
  selectResolution: (option: ResolutionOption) => void,
}

const Options = ({speed, selectSpeed, resolution, selectResolution}: OptionsProps) => {
  return (
    <>
      <Control>
        <Label>Speed</Label>
        <RadioSelect
          id='speed'
          options={speedOptions}
          selected={speed}
          onSelect={selectSpeed}
          renderContent={option => <span>{option.factor.toFixed(1)}&times;</span>}
        />
      </Control>

      <Control>
        <Label>Resolution</Label>
        <RadioSelect
          id='resolution'
          options={resolutionOptions}
          selected={resolution}
          onSelect={selectResolution}
          renderContent={option => <span>{option.text}</span>}
        />
      </Control>
    </>
  )
}

const Control = styled.div`
  margin-bottom: 1.2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.4rem;
  
  
  color: #555;
`;

export default Options;
