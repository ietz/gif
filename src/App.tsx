import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import Options from './components/Options';
import Player, { PlayerElement } from './components/Player';
import { defaultSpeedOption } from './config/options/speed';
import { defaultResolutionOption } from './config/options/resolution';
import Timeline, { VideoSlice } from './components/Timeline';

const App = () => {
  const [duration, setDuration] = useState(100);
  const [position, setPosition] = useState(0);
  const [loopRegion, setLoopRegion] = useState<VideoSlice>({start: 0, end: 100});
  const [speed, setSpeed] = useState(defaultSpeedOption);
  const [resolution, setResolution] = useState(defaultResolutionOption);

  const playerRef = useRef<PlayerElement>(null);

  const onSeek = useCallback((newPosition: number) => {
    if (playerRef.current) {
      setPosition(newPosition);
      playerRef.current.setTime(newPosition);
    }
  }, [playerRef, setPosition]);

  return (
    <Container>
      <Options
        speed={speed}
        selectSpeed={setSpeed}
        resolution={resolution}
        selectResolution={setResolution}
      />

      <Player
        ref={playerRef}
        playbackRate={speed.factor}
        loopRegion={loopRegion}
        onTimeUpdate={setPosition}
        onDurationChange={(newDuration) => {
          setDuration(newDuration);
          setLoopRegion({start: 0, end: newDuration});
        }}
      />

      <Controls>
        <Timeline
          slice={loopRegion}
          onSliceChange={setLoopRegion}
          position={position}
          onPositionChange={onSeek}
          length={duration}
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
