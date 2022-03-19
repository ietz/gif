import { createFFmpeg, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';
import { VideoSlice } from '../components/Timeline';

export class Converter {
  private ffmpeg: FFmpeg;

  constructor(corePath: string) {
    this.ffmpeg = createFFmpeg({corePath});
  }

  load = () => this.ffmpeg.load();

  convert = async ({file, slice, framerate, playbackRate, scaleFactor}: ConvertOptions): Promise<string> => {
    this.ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    await this.ffmpeg.run(
      '-ss',
      slice.start.toString(),
      '-to',
      slice.end.toString(),
      '-i',
      file.name,
      '-vf',
      `scale=iw*${scaleFactor}:ih*${scaleFactor},setpts=PTS/${playbackRate},fps=${framerate},split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse`,
      '-loop',
      '0',
      'output.gif',
    );
    const data = this.ffmpeg.FS('readFile', 'output.gif');
    return URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}));
  }
}

export const replaceFileExtension = (fileName: string, extension: string): string => {
  const fileStem = fileName.replace(/\.[^/.]+$/, "");
  return `${fileStem}.${extension}`;
}

export interface ConvertOptions {
  file: File;
  slice: VideoSlice;
  playbackRate: number;
  scaleFactor: number;
  framerate: number;
}
