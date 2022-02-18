import { Range } from 'react-range';
import React from 'react';
import styled from 'styled-components';
import { clamp, findChangedIndex } from '../utils';


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
  className?: string;
  minSliceLength: number;
}

const Timeline = ({slice, onSliceChange, position, onPositionChange, length, className, minSliceLength}: TimelineProps) => {
  const values = [slice.start, position, slice.end];

  return (
    <Range
      values={values}
      onChange={(newValues) => {
        const changed = findChangedIndex(values, newValues);
        if (changed === 1) {
          onPositionChange(clamp(newValues[1], slice.start, slice.end));
        } else {
          const newSlice = changed === 0
            ? moveSliceStart(slice, newValues[0], minSliceLength, length)
            : moveSliceEnd(slice, newValues[2], minSliceLength);
          onSliceChange(newSlice);

          onPositionChange(clamp(position, newSlice.start, newSlice.end));
        }
      }}
      step={1}
      min={0}
      max={length}
      allowOverlap={true}
      renderTrack={({props: {style, ...restProps}, children}) => (
        <Track
          {...restProps}
          className={className}
          style={{
            ...style,
          }}
        >
          <TrackActiveRegion
            style={{
              left: `${slice.start / length * 100}%`,
              right: `${100 - slice.end / length * 100}%`,
            }}
          />
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

const moveSliceStart = (slice: VideoSlice, target: number, minSliceLength: number, maxEnd: number): VideoSlice => {
  const newStart = Math.min(target, maxEnd - minSliceLength);
  return {
    start: newStart,
    end: Math.max(slice.end, newStart + minSliceLength),
  };
};

const moveSliceEnd = (slice: VideoSlice, target: number, minSliceLength: number): VideoSlice => {
  const newEnd = Math.max(target, minSliceLength);
  return {
    start: Math.min(slice.start, target - minSliceLength),
    end: newEnd,
  };
};

const Track = styled.div`
  --border-radius: 0.3rem;
  
  height: 3.2rem;
  width: 100%;
  background-color: #eee;
  box-shadow: inset 0 0 0 1px #ddd;
  border-radius: var(--border-radius);
`;

const TrackActiveRegion = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  
  pointer-events: none;
  border-radius: var(--border-radius);
  background-color: var(--primary);
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
  background-color: ${props => props.isDragged ? 'var(--primary)' : '#999'};
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

  border-top: var(--indicator-size) solid var(--primary);
  border-left: var(--indicator-size) solid transparent;
  border-right: var(--indicator-size) solid transparent;
`;

export default Timeline;