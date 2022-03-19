import React, { useState } from 'react';
import styled from 'styled-components';
import Options from './components/Options';
import Player from './components/Player';
import { defaultSpeedOption } from './config/options/speed';
import { defaultResolutionOption } from './config/options/resolution';
import Timeline, { VideoSlice } from './components/Timeline';

const App = () => {
  const [position, setPosition] = useState(30);
  const [loopRegion, setLoopRegion] = useState<VideoSlice>({start: 20, end: 80});
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

      <Player
        playbackRate={speed.factor}
        loopRegion={loopRegion}
      />

      <Controls>
        <Timeline
          slice={loopRegion}
          onSliceChange={setLoopRegion}
          position={position}
          onPositionChange={setPosition}
          length={100}
          minSliceLength={10}
        />
      </Controls>
    </Container>
  );
}

const Container = styled.div`
  --primary: #5c9fe7;
  
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

const Controls = styled.div`
  grid-area: controls;
  background-color: #ffffff;
  border-top: 1px solid #00000029;
`;

export default App;
