import React from 'react';
import styled from 'styled-components';
import Options from './components/Options';
import Player from './components/Player';
import Controls from './components/Controls';

const App = () => {
  return (
    <Container>
      <Options />
      <Player />
      <Controls />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template: 
    "options player" 1fr
    "controls controls" 12rem / 25rem 1fr;

  height: 100%;
  
  background-color: #f7f7f8;
`;

export default App;
