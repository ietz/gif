import styled from 'styled-components';
import React, { DetailedHTMLProps, forwardRef, HTMLAttributes } from 'react';

export interface PositionIndicatorProps extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref'> {
  isDragging: boolean;
}

export const PositionIndicator = forwardRef<HTMLDivElement, PositionIndicatorProps>((props, ref) => (
  <Container ref={ref} {...props}>
    <DragArea>
      <Pointer />
    </DragArea>
  </Container>
));

const Container = styled.div<PositionIndicatorProps>`
  height: 100%;
  width: 0;
  position: relative;
  
  display: flex;
  justify-content: center;
  
  transition: ${props => props.isDragging ? 'none' : '0.07s transform linear'};
`;

const DragArea = styled.div`
  --indicator-size: 0.7rem;
  --margin-bottom: 0.2rem;
  --drag-area-padding-top: 1rem;
  
  position: absolute;
  padding-top: var(--drag-area-padding-top);
  top: calc(-1 * var(--indicator-size) - var(--margin-bottom) - var(--drag-area-padding-top));
  width: 8rem;

  display: flex;
  justify-content: center;
`;

const Pointer = styled.div`
  border-top: var(--indicator-size) solid var(--primary);
  border-left: var(--indicator-size) solid transparent;
  border-right: var(--indicator-size) solid transparent;
`;
