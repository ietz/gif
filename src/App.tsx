import React, { useState } from 'react';
import styled from 'styled-components';
import Options from './components/Options';
import Player from './components/Player';
import Controls from './components/Controls';
import { defaultSpeedOption } from './config/options/speed';
import { defaultResolutionOption } from './config/options/resolution';

const App = () => {
  const [speed, setSpeed] = useState(defaultSpeedOption);
  const [resolution, setResolution] = useState(defaultResolutionOption);

  return (
    <Container>
      <Options
        speed={speed}
        selectSpeed={setSpeed}
        resolution={resolution}
        selectResolution={setResolution}
      />

      <Player />
      <Controls />
    </Container>
  );
}

const Container = styled.div`
  --options-width: 25rem;
  --controls-height: 12rem;
  
  display: grid;
  grid-template: 
    "options player" 1fr
    "controls controls" var(--controls-height) / var(--options-width) 1fr;

  height: 100%;
  
  background-color: #f7f7f8;
  color: #444;
`;

export default App;
