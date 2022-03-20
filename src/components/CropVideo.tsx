import ReactCrop, { Crop } from 'react-image-crop';
import styled from 'styled-components';
import {
  CSSProperties,
  DetailedHTMLProps,
  forwardRef,
  ReactEventHandler,
  useMemo,
  useState,
  VideoHTMLAttributes
} from 'react';


export interface CropVideoProps extends Omit<DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>, 'ref'> {
  crop: VideoCrop;
  onChangeCrop: (crop: VideoCrop) => void;
  source: string;
  maxScale: number;
}

const CropVideo = forwardRef<HTMLVideoElement, CropVideoProps>(({crop, onChangeCrop, source, maxScale, ...videoProps}, ref) => {
  const [videoSize, setVideoSize] = useState<Size>();

  const onLoadStart = useMemo(() => combineHandlers(
    (event) => event.target.dispatchEvent(new Event('medialoaded', { bubbles: true })),
    videoProps.onLoadStart,
  ), [videoProps.onLoadStart]);

  const onLoadedMetadata = useMemo(() => combineHandlers(
    (event) => setVideoSize(getHtmlVideoSize(event.currentTarget)),
    videoProps.onLoadedMetadata,
  ), [videoProps.onLoadedMetadata, setVideoSize]);


  return (
    <ReactCropStyled
      src=""
      crop={crop && videoSize ? videoCropToPercentageCrop(crop, videoSize) : {}}
      onChange={(_, newPctCrop) => {
        if (videoSize === undefined) throw Error('Video size is unknown');
        onChangeCrop(percentageCropToVideoCrop(newPctCrop as PercentageCrop, videoSize));
      }}
      style={{
        '--video-width': videoSize ? maxScale * videoSize.width : undefined,
        '--video-height': videoSize ? maxScale * videoSize.height : undefined,
      } as CSSVideoSizeStyle}
      renderComponent={
        <Video
          ref={ref}
          {...videoProps}
          onLoadStart={onLoadStart}
          onLoadedMetadata={onLoadedMetadata}
        >
          <source src={source} />
        </Video>
      }
    />
  )
});

const combineHandlers = (
  handler: ReactEventHandler<HTMLVideoElement>,
  parentHandler: ReactEventHandler<HTMLVideoElement> | undefined
): ReactEventHandler<HTMLVideoElement> => {
  if (!parentHandler) {
    return handler;
  }

  return event => {
    handler(event);
    parentHandler(event);
  }
}

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

export interface CSSVideoSizeStyle extends CSSProperties {
  '--video-width': number;
  '--video-height': number;
}

const ReactCropStyled = styled(ReactCrop)`
  --padding: 2rem;
  --aspect-ratio: calc(var(--video-width) / var(--video-height));
  --max-width: calc(min(var(--video-width) * 1px, 100vw - var(--options-width) - 2 * var(--padding)));
  --max-height: calc(min(var(--video-height) * 1px, 100vh - var(--controls-height) - 2 * var(--padding)));
  width: var(--max-width);
  height: calc(var(--max-width) / var(--aspect-ratio));
  max-width: calc(var(--max-height) * var(--aspect-ratio));
  max-height: var(--max-height);
`;

export default CropVideo;
