import { createFFmpeg, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';
import { VideoSlice } from '../components/Timeline';

export class Converter {
  private ffmpeg: FFmpeg;

  constructor(corePath: string) {
    this.ffmpeg = createFFmpeg({log: true, corePath});
  }

  load = () => this.ffmpeg.load();

  convert = async (options: ConvertOptions): Promise<string> => {
    console.log('@@@@ write file')
    this.ffmpeg.FS('writeFile', 'demo.mp4', await fetchFile('demo.mp4'));
    console.log('@@@@ run ffmpeg')
    await this.ffmpeg.run(
      '-ss',
      options.slice.start.toString(),
      '-to',
      options.slice.end.toString(),
      '-i',
      'demo.mp4',
      '-vf',
      `setpts=PTS/1.5,fps=${options.framerate},split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse`,
      '-loop',
      '0',
      'output.gif'
    );
    console.log('@@@@ read file')
    const data = this.ffmpeg.FS('readFile', 'output.gif');
    console.log('@@@@ create blob')
    return URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}));
  }

}

export interface ConvertOptions {
  slice: VideoSlice;
  framerate: number;
}
