import ReactCrop, { Crop } from 'react-image-crop';
import styled from 'styled-components';
import { CSSProperties, forwardRef, useImperativeHandle, useRef, useState } from 'react';


export interface CropVideoProps {
  crop: VideoCrop;
  onChangeCrop: (crop: VideoCrop) => void;
  source: string;
}

const CropVideo = forwardRef<HTMLVideoElement, CropVideoProps>(({crop, onChangeCrop, source}, ref) => {
  const [videoSize, setVideoSize] = useState<Size>();

  const videoRef = useRef<HTMLVideoElement>(null);

  useImperativeHandle(
    ref,
    () => videoRef.current as HTMLVideoElement,
    [videoRef.current],
  )

  return (
    <ReactCropStyled
      src=""
      crop={crop && videoSize ? videoCropToPercentageCrop(crop, videoSize) : {}}
      onChange={(_, newPctCrop) => {
        if (videoSize === undefined) throw Error('Video size is unknown');
        onChangeCrop(percentageCropToVideoCrop(newPctCrop as PercentageCrop, videoSize));
      }}
      style={{'--aspect-ratio': videoSize ? videoSize.width / videoSize.height : undefined} as CSSAspectRatioStyle}
      renderComponent={
        <Video
          ref={videoRef}
          muted
          autoPlay
          loop
          onLoadStart={e => e.target.dispatchEvent(new Event('medialoaded', { bubbles: true }))}
          onLoadedMetadata={() => setVideoSize(getHtmlVideoSize(videoRef.current!))}
        >
          <source src={source} />
        </Video>
      }
    />
  )
});

export interface Size {
  width: number;
  height: number;
}

export interface VideoCrop extends Size {
  x: number;
  y: number;
}

const getHtmlVideoSize = (element: HTMLVideoElement): Size => ({
  width: element.videoWidth,
  height: element.videoHeight,
})

interface PercentageCrop extends Crop {
  unit: '%';
}

const percentageCropToVideoCrop = (crop: PercentageCrop, videoSize: Size): VideoCrop => ({
  x: crop.x * videoSize.width / 100,
  y: crop.y * videoSize.height / 100,
  width: crop.width * videoSize.width / 100,
  height: crop.height * videoSize.height / 100,
})

const videoCropToPercentageCrop = (videoCrop: VideoCrop, videoSize: Size): PercentageCrop => ({
  unit: '%',
  x: videoCrop.x / videoSize.width * 100,
  y: videoCrop.y / videoSize.height * 100,
  width: videoCrop.width / videoSize.width * 100,
  height: videoCrop.height / videoSize.height * 100,
})

const Video = styled.video`
  display: block;
  max-width: 100%;
`;

export interface CSSAspectRatioStyle extends CSSProperties {
  '--aspect-ratio': number;
}

const ReactCropStyled = styled(ReactCrop)`
  --padding: 2rem;
  --max-width: calc(100vw - var(--options-width) - 2 * var(--padding));
  --max-height: calc(100vh - var(--controls-height) - 2 * var(--padding));
  width: var(--max-width);
  height: calc(var(--max-width) / var(--aspect-ratio));
  max-width: calc(var(--max-height) * var(--aspect-ratio));
  max-height: var(--max-height);
  
  background-color: black;
`;

export default CropVideo;