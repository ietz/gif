import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import Options from './components/Options';
import Player, { PlayerElement } from './components/Player';
import { defaultSpeedOption } from './config/options/speed';
import { defaultResolutionOption } from './config/options/resolution';
import Timeline, { VideoSlice } from './components/Timeline';
import { Converter } from './common/convert';
import { DropHint } from './components/DropHint';
import { useDropzone } from 'react-dropzone';

const App = () => {
  const [videoFile, setVideoFile] = useState<VideoFile>();
  const [duration, setDuration] = useState(100);
  const [position, setPosition] = useState(0);
  const [loopRegion, setLoopRegion] = useState<VideoSlice>({start: 0, end: 100});
  const [speed, setSpeed] = useState(defaultSpeedOption);
  const [resolution, setResolution] = useState(defaultResolutionOption);

  const onDropFile = useCallback((files: File[]) => {
    const file = files[0];
    setVideoFile({
      name: file.name,
      url: URL.createObjectURL(file),
    })
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
      <Options
        speed={speed}
        selectSpeed={setSpeed}
        resolution={resolution}
        selectResolution={setResolution}
      />

      <PlayerArea>
        {!videoFile ? <DropHint isDragActive={isDragActive} /> : (
          <Player
            ref={playerRef}
            source={videoFile.url}
            playbackRate={speed.factor}
            loopRegion={loopRegion}
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
          slice={loopRegion}
          onSliceChange={setLoopRegion}
          position={position}
          onPositionChange={onSeek}
          length={duration}
          minSliceLength={10}
          step={0.05}
        />
        <button
          type='button'
          onClick={download}
        >
          Convert
        </button>
      </Controls>

      <input {...getInputProps()} />
    </Container>
  );
}

interface VideoFile {
  name: string;
  url: string;
}

const download = async () => {
  const converter = new Converter('https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js');
  await converter.load();
  const url = await converter.convert({
    slice: {start: 2, end: 5},
    framerate: 20,
  });
  console.log(url);
}

const Container = styled.div`
  --primary: #5c9fe7;
  
  --options-width: 25rem;
  --controls-height: 12rem;
  
  display: grid;
  grid-template: 
    "options player" 1fr
    "controls controls" var(--controls-height) / var(--options-width) 1fr;

  height: 100%;
  
  background-color: #f7f7f8;
  color: #444;
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

export default App;
