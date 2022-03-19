import styled from 'styled-components';

export interface ConvertButtonProps {
  onClick: () => void;
}

export const ConvertButton = ({onClick}: ConvertButtonProps) => {
  return (
    <Button
      type='button'
      onClick={onClick}
    >
      <span>Convert</span>
      <span>&rarr;</span>
    </Button>
  )
}

const Button = styled.button`
  display: flex;
  //width: 15rem;
  height: 4rem;
  padding: 0 2rem;
  margin: 0 2rem 2rem;
  
  border: 1px solid #e0e0e0;
  border-radius: 2rem;
  background-color: white;
  box-shadow: 0 2px 2px 0 #0000000d, 0 3px 5px 0 #00000000;
  
  color: #747474;
  font-size: 1.15rem;
  font-family: inherit;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;
