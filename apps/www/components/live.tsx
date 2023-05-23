
import { styled } from '@odpf/apsara';
import React from 'react';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import Editor from './editor';

export interface Props {
  code: string
  scope: {
    [key: string]: any
  }
}

const Wrapper = styled('div', {
  width: '100%',
  padding: "$4",
  display: "flex",
  gap: "$2",
  flexDirection: 'column',
})

const DynamicLive: React.FC<Props> = ({ code, scope }) => {
  return (
    <LiveProvider code={code} scope={scope}>
      <Wrapper>
        <LivePreview/>
        <LiveError className="live-error" />
      </Wrapper>
      <Editor code={code} />
    </LiveProvider>
  )
}

export default DynamicLive