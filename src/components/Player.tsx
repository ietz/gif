import styled from 'styled-components';
import { forwardRef, RefObject, useEffect, useImperativeHandle, useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css'
import CropVideo, { VideoCrop } from './CropVideo';
import { VideoSlice } from './Timeline';


export interface PlayerProps {
  playbackRate: number;
  loopRegion: VideoSlice;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void,
}

export interface PlayerElement {
  setTime: (time: number) => void;
}

const Player = forwardRef<PlayerElement, PlayerProps>(({playbackRate, loopRegion, onTimeUpdate, onDurationChange}, ref) => {
  const [crop, setCrop] = useState<VideoCrop>({x: 0, y: 0, width: 0, height: 0});

  const videoRef = useRef<HTMLVideoElement>(null);
  usePlaybackRate(videoRef, playbackRate);
  useLoopRegion(videoRef, loopRegion);

  useImperativeHandle(ref, () => ({
    setTime: (time: number) => {
      if (!videoRef.current) {
        throw Error('Video player is not initialized');
      }

      videoRef.current.currentTime = time;
    }
  }), [videoRef]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const listener = () => onTimeUpdate(videoElement.currentTime);
      videoElement.addEventListener('timeupdate', listener);
      return () => videoElement.removeEventListener('timeupdate', listener);
    }
  }, [onTimeUpdate, videoRef.current]);

  return (
    <Container>
      <CropVideo
        ref={videoRef}
        autoPlay
        muted
        crop={crop}
        onChangeCrop={setCrop}
        onLoadedMetadata={(event) => onDurationChange(event.currentTarget.duration)}
        source="demo.mp4"
      />
    </Container>
  )
})

const usePlaybackRate = (videoRef: RefObject<HTMLVideoElement>, playbackRate: number) => {
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, videoRef.current]);
}

const useLoopRegion = (videoRef: RefObject<HTMLVideoElement>, loopRegion: VideoSlice) => {
  useEffect(() => {
    const setPositionInsideLoop = () => {
      const videoElement = videoRef.current;
      if (videoElement && (videoElement.currentTime < loopRegion.start || loopRegion.end <= videoElement.currentTime)) {
        videoElement.currentTime = loopRegion.start;
      }
    }

    const intervalId = setInterval(setPositionInsideLoop, 20);
    return () => clearInterval(intervalId);
  }, [videoRef, loopRegion]);
}

const Container = styled.div`
  grid-area: player;
  background-color: #f7f7f8;
  
  display: flex;
  align-items: center;
  justify-content: center;
`;


export default Player;
