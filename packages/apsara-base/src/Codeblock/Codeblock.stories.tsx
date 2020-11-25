import React from "react";

import Codeblock from "./Codeblock";

export default {
    title: "General/Codeblock",
    component: Codeblock,
};

export const codeblock = () => (
    <>
        <Codeblock lang="yaml">
            {`
hello: world
foo: 
  - bar 
  - baz
`}
        </Codeblock>
        <br />
        <Codeblock lang="json">
            {`
{
  "hello": "world"
  "foo": ["bar", "baz"] 
}
`}
        </Codeblock>
        <br />
        <Codeblock>
            {`
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper auctor neque vitae tempus quam pellentesque nec nam aliquam. Faucibus et molestie ac feugiat sed lectus vestibulum. Adipiscing at in tellus integer feugiat scelerisque varius morbi enim. Non quam lacus suspendisse faucibus interdum posuere lorem ipsum.

  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper auctor neque vitae tempus quam pellentesque nec nam aliquam. Faucibus et molestie ac feugiat sed lectus vestibulum. Adipiscing at in tellus integer feugiat scelerisque varius morbi enim. Non quam lacus suspendisse faucibus interdum posuere lorem ipsum.

  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper auctor neque vitae tempus quam pellentesque nec nam aliquam. Faucibus et molestie ac feugiat sed lectus vestibulum. Adipiscing at in tellus integer feugiat scelerisque varius morbi enim. Non quam lacus suspendisse faucibus interdum posuere lorem ipsum.
`}
        </Codeblock>
    </>
);

export const withCopy = () => (
    <>
        <Codeblock lang="yaml" copy>
            {`
hello: world
foo: 
  - bar 
  - baz
`}
        </Codeblock>
        <br />
        <Codeblock lang="json" copy>
            {`
{
  "hello": "world"
  "foo": ["bar", "baz"] 
}
`}
        </Codeblock>
    </>
);
