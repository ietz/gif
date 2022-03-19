import styled from 'styled-components';
import { RefObject, useEffect, useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css'
import CropVideo, { VideoCrop } from './CropVideo';
import { VideoSlice } from './Timeline';


export interface PlayerProps {
  playbackRate: number;
  loopRegion: VideoSlice;
  onTimeUpdate: (time: number) => void;
}

const Player = ({playbackRate, loopRegion, onTimeUpdate}: PlayerProps) => {
  const [crop, setCrop] = useState<VideoCrop>({x: 0, y: 0, width: 0, height: 0});

  const videoRef = useRef<HTMLVideoElement>(null);
  usePlaybackRate(videoRef, playbackRate);
  useLoopRegion(videoRef, loopRegion);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const listener = () => onTimeUpdate(videoElement.currentTime);
      videoElement.addEventListener('timeupdate', listener);
      return () => videoElement.removeEventListener('timeupdate', listener);
    }
  }, [onTimeUpdate, videoRef.current])

  return (
    <Container>
      <CropVideo
        ref={videoRef}
        crop={crop}
        onChangeCrop={setCrop}
        source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      />
    </Container>
  )
}

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
