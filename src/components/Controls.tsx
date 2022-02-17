import styled from 'styled-components';
import React, { useState } from 'react';
import Timeline, { VideoSlice } from './Timeline';

const Controls = () => {
  const [videoSlice, setVideoSlice] = useState<VideoSlice>({start: 20, end: 80});
  const [position, setPosition] = useState(30);

  return (
    <Container>
      <Timeline
        slice={videoSlice}
        onSliceChange={setVideoSlice}
        position={position}
        onPositionChange={setPosition}
        length={100}
      />
    </Container>
  )
}

const Container = styled.div`
  grid-area: controls;
  background-color: #ffffff;
  border-top: 1px solid #00000029;
`;


export default Controls;
