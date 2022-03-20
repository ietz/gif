import { forwardRef, RefObject, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import 'react-image-crop/dist/ReactCrop.css'
import CropVideo, { VideoCrop } from './CropVideo';
import { VideoSlice } from './Timeline';


export interface PlayerProps {
  source: string;
  playbackRate: number;
  loopRegion: VideoSlice;
  timeUpdateIntervalMs: number;
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void,
  crop: VideoCrop;
  onChangeCrop: (crop: VideoCrop) => void;
  maxScale: number;
}

export interface PlayerElement {
  setTime: (time: number) => void;
  play: () => void;
  pause: () => void;
}

const Player = forwardRef<PlayerElement, PlayerProps>(({source, playbackRate, loopRegion, onTimeUpdate, timeUpdateIntervalMs, onDurationChange, crop, onChangeCrop, maxScale}, ref) => {
  const videoRef = useRef<HTMLVideoElement | undefined>(undefined);
  useLoopRegion(videoRef, loopRegion);

  useImperativeHandle(ref, () => ({
    setTime: (time: number) => {
      if (!videoRef.current) {
        throw Error('Video player is not initialized');
      }

      videoRef.current.currentTime = time;
    },
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
  }), [videoRef]);

  const timeUpdateIntervalHandleRef = useRef<number>();
  const handleVideoRefChange = useCallback((video: HTMLVideoElement | null) => {
    if (timeUpdateIntervalHandleRef.current) {
      clearInterval(timeUpdateIntervalHandleRef.current);
    }

    videoRef.current = video ?? undefined;
    if (video) {
      video.playbackRate = playbackRate;

      timeUpdateIntervalHandleRef.current = window.setInterval(() => {
        if (!video.paused) {
          onTimeUpdate(video.currentTime);
        }
      }, timeUpdateIntervalMs);
    }
  }, [videoRef, playbackRate, timeUpdateIntervalMs, timeUpdateIntervalHandleRef]);

  return (
    <CropVideo
      ref={handleVideoRefChange}
      source={source}
      muted
      autoPlay
      loop
      crop={crop}
      onChangeCrop={onChangeCrop}
      maxScale={maxScale}
      onLoadedMetadata={(event) => onDurationChange(event.currentTarget.duration)}
    />
  )
})

const useLoopRegion = (videoRef: VideoRef, loopRegion: VideoSlice) => {
  useEffect(() => {
    const setPositionInsideLoop = () => {
      const videoElement = videoRef.current;
      if (videoElement && !videoElement.paused && (videoElement.currentTime < loopRegion.start || loopRegion.end <= videoElement.currentTime)) {
        videoElement.currentTime = loopRegion.start;
      }
    }

    const intervalId = setInterval(setPositionInsideLoop, 20);
    return () => clearInterval(intervalId);
  }, [videoRef, loopRegion]);
}

type VideoRef = RefObject<HTMLVideoElement | undefined>;


export default Player;
