import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css'
import CropVideo, { VideoCrop } from './CropVideo';


export interface PlayerProps {
  playbackRate: number;
}

const Player = ({playbackRate}: PlayerProps) => {
  const [crop, setCrop] = useState<VideoCrop>({x: 0, y: 0, width: 0, height: 0});

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, videoRef.current]);


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

const Container = styled.div`
  grid-area: player;
  background-color: #f7f7f8;
  
  display: flex;
  align-items: center;
  justify-content: center;
`;


export default Player;
