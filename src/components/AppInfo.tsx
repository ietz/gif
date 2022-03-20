import { Info } from 'react-feather';
import React, { useState } from 'react';
import styled from 'styled-components';

export const AppInfo = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div onMouseLeave={() => setIsOpen(false)}>
      <IconButton onClick={() => setIsOpen(prev => !prev)}>
        <Info color="rgb(0 0 0 / 35%)" />
      </IconButton>

      {isOpen && (
        <Popover>
          <p>
            <ParagraphLabel>What?</ParagraphLabel>
            This website allows you to convert videos into gifs without uploading anything.
            Everything happens inside your browser.
            Check for yourself by using the page while offline, watching your browser's devtools, or reading through the code on <a href="https://github.com/ietz/gif">GitHub</a>.
          </p>

          <p>
            <ParagraphLabel>Why?</ParagraphLabel>
            We developed this site because we needed a way to easily edit company-internal recordings.
            We use it to for screen captures, creating small demos to attach to our our issue tracking system.
            Hint: If you're on Windows, use the pre-installed Game Bar to record a window.
          </p>

          <p>
            <ParagraphLabel>How?</ParagraphLabel>
            You can set the video speed and resolution in the left sidebar.
            Use the video timeline at the bottom to include only a part of the original video.
            You can also crop the video by clicking and dragging on the preview.
            When you're happy with the results, press the "Convert" button at the bottom of the sidebar.
            The conversion will likely take longer compared to when using a beefy remote server, but that's expected.
          </p>
        </Popover>
      )}
    </div>
  )
}

const IconButton = styled.button`
  display: flex;
  padding: 0.4rem;
  
  border: none;
  background: none;
  cursor: pointer;
`;

const Popover = styled.div`
  position: absolute;
  left: 10rem;
  right: 15rem;
  max-width: 40rem;
  margin-top: -0.2rem;
  z-index: 5;
  
  border: 1px solid rgb(0 0 0 / 30%);
  border-radius: 0.3rem;
  background-color: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 3px 3px 0 rgb(0 0 0 / 10%), 0 6px 10px 0 rgb(0 0 0 / 15%);
`;

const ParagraphLabel = styled.strong`
  margin-right: 0.5rem;
`;
