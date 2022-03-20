import { createFFmpeg, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';
import { VideoSlice } from '../components/Timeline';
import { VideoCrop } from '../components/CropVideo';

export class Converter {
  private ffmpeg: FFmpeg;

  constructor(corePath: string) {
    this.ffmpeg = createFFmpeg({corePath});
  }

  load = () => this.ffmpeg.load();

  convert = async ({file, slice, ...imageOptions}: ConvertOptions): Promise<string> => {
    this.ffmpeg.FS('writeFile', file.name, await fetchFile(file));

    await this.ffmpeg.run(
      '-ss',
      slice.start.toString(),
      '-to',
      slice.end.toString(),
      '-i',
      file.name,
      '-vf',
      this.getVideoImageFilter(imageOptions),
      '-loop',
      '0',
      'output.gif',
    );
    const data = this.ffmpeg.FS('readFile', 'output.gif');
    return URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}));
  }

  private getVideoImageFilter = ({framerate, playbackRate, scaleFactor, crop}: ImageOptions) => {
    const videoFilterParts = []

    if (crop) {
      videoFilterParts.push(`crop=${crop.width}:${crop.height}:${crop.x}:${crop.y}`);
    }

    videoFilterParts.push(
      `scale=iw*${scaleFactor}:-1`,
      `setpts=PTS/${playbackRate}`,
      `fps=${framerate}`,
      `split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse`,
    )

    return videoFilterParts.join(',')
  }
}

export const replaceFileExtension = (fileName: string, extension: string): string => {
  const fileStem = fileName.replace(/\.[^/.]+$/, "");
  return `${fileStem}.${extension}`;
}

interface ImageOptions {
  playbackRate: number;
  scaleFactor: number;
  framerate: number;
  crop: VideoCrop;
}

export interface ConvertOptions extends ImageOptions {
  file: File;
  slice: VideoSlice;
}
