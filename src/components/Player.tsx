import { forwardRef, RefObject, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
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
  maxScale: number;
}

export interface PlayerElement {
  setTime: (time: number) => void;
  play: () => void;
  pause: () => void;
}

const Player = forwardRef<PlayerElement, PlayerProps>(({source, playbackRate, loopRegion, onTimeUpdate, onDurationChange, crop, onChangeCrop, maxScale}, ref) => {
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

  const handleVideoRefChange = useCallback((video: HTMLVideoElement | null) => {
    videoRef.current = video ?? undefined;
    if (video) {
      video.playbackRate = playbackRate;
    }
  }, [videoRef, playbackRate]);

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
      onTimeUpdate={(event) => {
        if (!event.currentTarget.paused) {
          onTimeUpdate(event.currentTarget.currentTime);
        }
      }}
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
