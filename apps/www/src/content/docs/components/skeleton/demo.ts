"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `<Skeleton${getPropsString(props)} />`;
};

export const playground = {
  type: "playground",
  controls: {
    width: {
      type: "text",
      initialValue: "200px",
    },
    height: {
      type: "text",
      initialValue: "15px",
    },
    count: {
      type: "number",
      initialValue: 3,
    },
    enableAnimation: {
      type: "checkbox",
      initialValue: true,
    },
    duration: {
      type: "number",
      initialValue: 1.5,
    },
    inline: {
      type: "checkbox",
      initialValue: false,
    }
  },
  getCode,
};

export const basicDemo = {
  type: "code",
  code: `
  <Flex direction="column" gap="medium">
    <Skeleton width={200} height={15} />
  </Flex>`,
};

export const multipleDemo = {
  type: "code",
  code: `
  <Flex direction="column" gap="medium">
    <Skeleton width={200} height={15} count={3} />
  </Flex>`,
};

export const customStylesDemo = {
  type: "code",
  code: `
  <Flex direction="column" gap="medium">
    <Skeleton 
      width={200} 
      height={20} 
      baseColor="var(--rs-color-background-accent-primary)"
      highlightColor="var(--rs-color-background-accent-emphasis)"
    />
  </Flex>`,
};

export const animationDemo = {
  type: "code",
  code: `
  <Flex direction="column" gap="medium">
    <Skeleton width={200} height={20} duration={2.5} />
    <Skeleton width={200} height={20} enableAnimation={false} />
  </Flex>`,
};

export const cardDemo = {
  type: "code",
  code: `
  <Flex direction="column" gap="medium" style={{ width: '300px' }}>
    <Skeleton height={200} /> {/* Image placeholder */}
    <Skeleton height={20} width="80%" /> {/* Title placeholder */}
    <Skeleton height={15} count={3} /> {/* Text lines placeholder */}
  </Flex>`,
}; 