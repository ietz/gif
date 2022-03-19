import { createFFmpeg, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';
import { VideoSlice } from '../components/Timeline';

export class Converter {
  private ffmpeg: FFmpeg;

  constructor(corePath: string) {
    this.ffmpeg = createFFmpeg({log: true, corePath});
  }

  load = () => this.ffmpeg.load();

  convert = async ({file, slice, framerate}: ConvertOptions): Promise<string> => {
    const fileStem = file.name.replace(/\.[^/.]+$/, "");
    const outputFileName = `${fileStem}.gif`;
    console.log('@@@@ write file')
    this.ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    console.log('@@@@ run ffmpeg')
    await this.ffmpeg.run(
      '-ss',
      slice.start.toString(),
      '-to',
      slice.end.toString(),
      '-i',
      file.name,
      '-vf',
      `setpts=PTS/1.5,fps=${framerate},split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse`,
      '-loop',
      '0',
      outputFileName,
    );
    console.log('@@@@ read file')
    const data = this.ffmpeg.FS('readFile', outputFileName);
    console.log('@@@@ create blob')
    return URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}));
  }
}

export interface ConvertOptions {
  file: File;
  slice: VideoSlice;
  framerate: number;
}
