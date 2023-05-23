
import { styled } from '@stitches/react'
import dynamic from 'next/dynamic'
import React from 'react'

const DynamicLive = dynamic(() => import('./live'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '32px 16px', fontSize: "12px", borderRadius: "6px",
    border: '1px solid #ededed' }}>
      loading...
    </div>
  ),
})

export type PlaygroundProps = {
  title?: React.ReactNode | string
  desc?: React.ReactNode | string
  code: string
  scope: {
    [key: string]: any
  }
}

const defaultProps = {
  code: '',
  scope: {},
}

const StyledPlayground = styled("div", {
  borderRadius: "$2",
  border: '1px solid $gray4'
})

const Playground: React.FC<PlaygroundProps> = React.memo(
  ({
    code: inputCode,
    scope,
  }: PlaygroundProps & typeof defaultProps) => {
    
    const code = inputCode.trim()
    return (
      <>
        <StyledPlayground>
          <DynamicLive code={code} scope={scope} />
        </StyledPlayground>
      </>
    )
  },
)

Playground.defaultProps = defaultProps
Playground.displayName = 'Playground'
export default Playground