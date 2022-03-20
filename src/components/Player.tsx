import { forwardRef, RefObject, useEffect, useImperativeHandle, useRef } from 'react';
import 'react-image-crop/dist/ReactCrop.css'
import CropVideo, { VideoCrop } from './CropVideo';
import { VideoSlice } from './Timeline';


export interface PlayerProps {
  source: string;
  playbackRate: number;
  loopRegion: VideoSlice;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void,
  crop: VideoCrop;
  onChangeCrop: (crop: VideoCrop) => void;
}

export interface PlayerElement {
  setTime: (time: number) => void;
}

const Player = forwardRef<PlayerElement, PlayerProps>(({source, playbackRate, loopRegion, onTimeUpdate, onDurationChange, crop, onChangeCrop}, ref) => {
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

  return (
    <CropVideo
      ref={videoRef}
      source={source}
      muted
      autoPlay
      loop
      crop={crop}
      onChangeCrop={onChangeCrop}
      onLoadedMetadata={(event) => onDurationChange(event.currentTarget.duration)}
      onTimeUpdate={(event) => onTimeUpdate(event.currentTarget.currentTime)}
    />
  )
})

const usePlaybackRate = (videoRef: RefObject<HTMLVideoElement>, playbackRate: number) => {
  // TODO: Fix dependency on videoRef - handle ref changing
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [videoRef, playbackRate]);
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


export default Player;
