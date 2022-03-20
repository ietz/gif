import React, { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Options from './components/Options';
import Player, { PlayerElement } from './components/Player';
import { defaultSpeedOption } from './config/options/speed';
import { defaultResolutionOption } from './config/options/resolution';
import Timeline, { VideoSlice } from './components/Timeline';
import { Converter, replaceFileExtension } from './common/convert';
import { DropHint } from './components/DropHint';
import { useDropzone } from 'react-dropzone';
import { ConvertButton } from './components/ConvertButton';
import { download } from './common/download';
import { VideoCrop } from './components/CropVideo';
import { AppInfo } from './components/AppInfo';

const App = () => {
  const [videoFile, setVideoFile] = useState<VideoFile>();
  const [duration, setDuration] = useState(100);
  const [position, setPosition] = useState(0);
  const [crop, setCrop] = useState<VideoCrop>({x: 0, y: 0, width: 0, height: 0});
  const [loopRegion, setLoopRegion] = useState<VideoSlice>({start: 0, end: 100});
  const [speed, setSpeed] = useState(defaultSpeedOption);
  const [resolution, setResolution] = useState(defaultResolutionOption);
  const [conversionProgress, setConversionProgress] = useState<number>();

  const converter = useMemo(() => {
    const conv = new Converter('https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js');
    conv.load();
    return conv;
  }, []);

  const convert = useCallback(async () => {
    if (videoFile) {
      setConversionProgress(0);
      download(
        await converter.convert({
          file: videoFile.file,
          slice: loopRegion,
          crop: crop.width > 0 && crop.height > 0 ? crop : undefined,
          scaleFactor: resolution.factor,
          playbackRate: speed.factor,
          framerate: 20,
        }, setConversionProgress),
        replaceFileExtension(videoFile.file.name, 'gif'),
      );
      setConversionProgress(undefined);
    }
  }, [setConversionProgress, videoFile, crop, converter, resolution, speed, loopRegion]);

  const onDropFile = useCallback((files: File[]) => {
    const file = files[0];
    setVideoFile({file, url: URL.createObjectURL(file)})
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDropAccepted: onDropFile,
    noClick: true,
    accept: 'video/*',
    multiple: false,
  })

  const playerRef = useRef<PlayerElement>(null);

  const onSeek = useCallback((newPosition: number) => {
    if (playerRef.current) {
      setPosition(newPosition);
      playerRef.current.setTime(newPosition);
    }
  }, [playerRef, setPosition]);

  return (
    <Container {...getRootProps()}>
      <Sidebar>
        <div>
          <TitleContainer>
            <Title>Options</Title>
            <AppInfo />
          </TitleContainer>

          <Options
            speed={speed}
            selectSpeed={setSpeed}
            resolution={resolution}
            selectResolution={setResolution}
          />
        </div>

        <ConvertButton
          onClick={convert}
          progress={conversionProgress}
          disabled={!videoFile || conversionProgress !== undefined}
        />
      </Sidebar>

      <PlayerArea>
        {!videoFile ? <DropHint isDragActive={isDragActive} /> : (
          <Player
            ref={playerRef}
            source={videoFile.url}
            playbackRate={speed.factor}
            loopRegion={loopRegion}
            crop={crop}
            onChangeCrop={setCrop}
            maxScale={resolution.factor}
            timeUpdateIntervalMs={50}
            onTimeUpdate={setPosition}
            onDurationChange={(newDuration) => {
              setDuration(newDuration);
              setLoopRegion({start: 0, end: newDuration});
            }}
          />
        )}
      </PlayerArea>


      <Controls>
        <Timeline
          disabled={!videoFile}
          slice={loopRegion}
          onSliceChange={setLoopRegion}
          position={position}
          onPositionChange={onSeek}
          onMove={(movePosition) => {
            if (playerRef.current) {
              playerRef.current.pause();
              playerRef.current.setTime(movePosition);
            }
          }}
          onMoveEnd={() => {
            if (playerRef.current) {
              playerRef.current.setTime(position);
              playerRef.current.play();
            }
          }}
          length={duration}
          minSliceLength={1}
          step={0.05}
        />
      </Controls>

      <input {...getInputProps()} />
    </Container>
  );
}

interface VideoFile {
  file: File;
  url: string;
}

const Container = styled.div`
  --primary: #5c9fe7;
  
  --options-width: 25rem;
  --controls-height: 12rem;
  
  display: grid;
  grid-template: 
    "sidebar player" 1fr
    "controls controls" var(--controls-height) / var(--options-width) 1fr;

  height: 100%;
  
  background-color: #f7f7f8;
  color: #444;
`;

const Sidebar = styled.div`
  grid-area: sidebar;
  background-color: #ffffff;
  border-right: 1px solid #00000029;
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 2rem;
`;

const Controls = styled.div`
  grid-area: controls;
  background-color: #ffffff;
  border-top: 1px solid #00000029;
  
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5rem;
`;

const PlayerArea = styled.div`
  grid-area: player;
  background-color: #f7f7f8;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 1.6rem;
  color: #333;
`;

export default App;
