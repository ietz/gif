import styled from 'styled-components';

export interface DropHintProps {
  isDragActive: boolean;
}

export const DropHint = ({isDragActive}: DropHintProps) => {
  return (
      <Container isDragActive={isDragActive}>
        <DropText>{isDragActive ? 'Drop' : 'Drag'} your video here</DropText>
        Supports mp4 &#8729; avi &#8729; webm &#8729; wmv and more
      </Container>
  )
}

interface ContainerProps {
  isDragActive: boolean;
}

const Container = styled.div<ContainerProps>`
  padding: 2rem;
  pointer-events: none;
  
  text-align: center;
  
  transition: 0.3s color, 0.3s transform;
  color: rgb(0 0 0 / ${props => props.isDragActive ? '80%' : '40%'});
  transform: ${props => props.isDragActive ? 'scale(1.05)' : 'none'};
  transform-origin: center;
`;

const DropText = styled.span`
  display: block;
  margin-bottom: 0.3rem;
  
  font-weight: 600;
  font-size: 1.8em;
`;
