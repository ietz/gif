import { Range } from 'react-range';
import React, { useState } from 'react';
import styled from 'styled-components';
import { clamp, findChangedIndex } from '../utils';
import { PositionIndicator } from './PositionIndicator';


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
  step: number;
  disabled?: boolean;
  onMove: (position: number) => void;
  onMoveEnd: () => void;
}

const Timeline = ({slice, onSliceChange, position, onPositionChange, length, className, minSliceLength, step, disabled, onMove, onMoveEnd}: TimelineProps) => {
  const values = [slice.start, position, slice.end];
  const [changingRange, setChangingRange] = useState(false);

  return (
    <Range
      disabled={disabled}
      values={values}
      onChange={(newValues) => {
        setChangingRange(true);

        const changed = findChangedIndex(values, newValues);
        if (changed === 1) {
          const newPosition = clamp(newValues[1], slice.start, slice.end);
          onPositionChange(newPosition);
          onMove(newPosition);
        } else {
          const newSlice = changed === 0
            ? moveSliceStart(slice, newValues[0], minSliceLength, length)
            : moveSliceEnd(slice, newValues[2], minSliceLength);
          onSliceChange(newSlice);

          onPositionChange(clamp(position, newSlice.start, newSlice.end));

          onMove(changed === 0 ? newSlice.start : newSlice.end);
        }
      }}
      onFinalChange={() => {
        setChangingRange(false);
        onMoveEnd();
      }}
      step={step}
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
          ? <PositionIndicator isDragging={changingRange} {...props} />
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
    start: Math.min(slice.start, newEnd - minSliceLength),
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


export default Timeline;