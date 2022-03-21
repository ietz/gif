import { Info } from 'react-feather';
import React, { useState } from 'react';
import styled from 'styled-components';


const GITHUB_URL = 'https://github.com/ietz/gif';

export const AppInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div onMouseLeave={() => setIsOpen(false)}>
      <IconButton onClick={() => setIsOpen(prev => !prev)}>
        <Info color="rgb(0 0 0 / 35%)" />
      </IconButton>

      <Popover open={isOpen}>
        <p>
          <ParagraphLabel>What?</ParagraphLabel>
          This tool allows you to edit videos and convert them into gifs without uploading anything.
          Everything happens inside your browser.
          Check for yourself by using the page while offline, watching your browser's devtools, or reading through the code on <a href={GITHUB_URL}>GitHub</a>.
        </p>

        <p>
          <ParagraphLabel>Why?</ParagraphLabel>
          We developed this tool because we needed a way to easily edit company-internal recordings.
          We use it to for screen captures, creating small demos to attach to our Jira issues.
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

        <p>
          <ParagraphLabel>Where?</ParagraphLabel>
          This tool lives on <a href={GITHUB_URL}>GitHub</a>.
          If you encounter any bugs, feel free to create an issue there.
          The project is MIT licensed, so feel free to use the tool and the code for pretty much whatever you want.
        </p>
      </Popover>
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

interface PopoverProps {
  open: boolean;
}

const Popover = styled.div<PopoverProps>`
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
  
  transition: 0.2s opacity, 0.2s visibility;
  opacity: ${props => props.open ? 1 : 0};
  visibility: ${props => props.open ? 'visible' : 'hidden'};
`;

const ParagraphLabel = styled.strong`
  margin-right: 0.5rem;
`;
