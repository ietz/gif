import styled from 'styled-components';

const Player = () => {
  return (
    <Container>
      <Video muted autoPlay>
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
      </Video>
    </Container>
  )
}

const Container = styled.div`
  grid-area: player;
  background-color: #f7f7f8;
  
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  
  box-sizing: border-box;
  padding: 2rem;
  
  object-fit: scale-down;
`;

export default Player;
