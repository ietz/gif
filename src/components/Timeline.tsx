import { getTrackBackground, Range } from 'react-range';
import React from 'react';
import styled from 'styled-components';


export interface VideoSlice {
  start: number;
  end: number;
}

export interface TimelineProps {
  slice: VideoSlice;
  onSliceChange: (slice: VideoSlice) => void;
  position: number;
  onPositionChange: (position: number) => void;
  length: number;
}

const Timeline = ({slice, onSliceChange, position, onPositionChange, length}: TimelineProps) => {
  const values = [slice.start, position, slice.end];

  return (
    <Range
      values={values}
      onChange={(values) => {
        const newPosition = values[1];
        const newSlice: VideoSlice = {start: values[0], end: values[2]};

        if (slice.start !== newSlice.start || slice.end !== newSlice.end) {
          onSliceChange(newSlice);
        }

        if (position !== newPosition) {
          onPositionChange(newPosition);
        }
      }}
      step={1}
      min={0}
      max={length}
      renderTrack={({props: {style, ...restProps}, children}) => (
        <Track
          {...restProps}
          style={{
            ...style,
            background: getTrackBackground({
              values,
              colors: ['#ccc', '#3167cb', '#3167cb', '#ccc'],
              min: 0,
              max: 100,
              rtl: false,
            }),
          }}
        >
          {children}
        </Track>
      )}
      renderThumb={({props, isDragged, index}) => (
        index === 1
          ? <PositionIndicatorContainer  {...props}> <PositionIndicator /> </PositionIndicatorContainer>
          : <ThumbContainer {...props} ><ThumbCenter isDragged={isDragged} /></ThumbContainer>
      )}
    />
  )
}

const Track = styled.div`
  height: 3.2rem;
  width: 100%;
`;

const ThumbContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  padding: 0.5rem 0.4rem;
  background-color: #fff;

  border-radius: 0.3rem;
  border: 1px solid rgba(0, 0, 0, 0.09);
  box-shadow: 0 3px 3px 0 rgb(0 0 0 / 22%), 0 5px 8px 0 rgb(0 0 0 / 12%);
  
  &:active, &:focus {
    outline: none;
  }
`;

export interface ThumbCenterProps {
  isDragged: boolean;
}

const ThumbCenter = styled.div<ThumbCenterProps>`
  width: 0.15rem;
  height: 1rem;
  background-color: ${props => props.isDragged ? '#00b' : '#999'};
`;

const PositionIndicatorContainer = styled.div`
  height: 100%;
  width: 0;
  position: relative;
  
  display: flex;
  justify-content: center;
`;

const PositionIndicator = styled.div`
  --indicator-size: 0.7rem;
  --margin-bottom: 0.2rem;
  
  position: absolute;
  top: calc(-1 * var(--indicator-size) - var(--margin-bottom));

  border-top: var(--indicator-size) solid red;
  border-left: var(--indicator-size) solid transparent;
  border-right: var(--indicator-size) solid transparent;
`;

export default Timeline;