import styled from 'styled-components';

export interface ConvertButtonProps {
  onClick: () => void;
  progress?: number;
}

export const ConvertButton = ({onClick, progress}: ConvertButtonProps) => {
  return (
    <Button
      type='button'
      onClick={onClick}
      disabled={progress !== undefined}
    >
      <ProgressIndicator progress={progress} />
      <ButtonText>Convert</ButtonText>
      <ButtonText>&rarr;</ButtonText>
    </Button>
  )
}

const Button = styled.button`
  display: flex;
  //width: 15rem;
  height: 4rem;
  padding: 0 2rem;
  margin: 0 2rem 2rem;
  
  position: relative;
  overflow: hidden;
  
  border: 1px solid #e0e0e0;
  border-radius: 2rem;
  background-color: white;
  box-shadow: 0 2px 2px 0 #0000000d, 0 3px 5px 0 #00000000;
  
  color: #747474;
  font-size: 1.15rem;
  font-family: inherit;
  align-items: center;
  justify-content: space-between;
  
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
`;

interface ProgressIndicatorProps {
  progress: number | undefined;
}

const ProgressIndicator = styled.div.attrs<ProgressIndicatorProps>(props => ({
  style: {
    width: props.progress !== undefined ? `${10+90*props.progress}%` : '100%',
  },
}))<ProgressIndicatorProps>`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #f1f1f1;
  opacity: ${props => props.progress !== undefined ? 1 : 0};
  transition: 0.5s width ease, 0.8s 0.5s opacity;
`;

const ButtonText = styled.span`
  z-index: 1;
`;
