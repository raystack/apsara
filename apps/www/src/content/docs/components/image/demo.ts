"use client";

import { getPropsString } from "@/lib/utils";

export const getCode = (props: any) => {
  return `<Image${getPropsString(props)}/>`;
};

export const playground = {
  type: "playground",
  controls: {
    src: {
      type: "text",
      initialValue:
        "https://images.unsplash.com/photo-1447690709975-318628b14c57",
    },
    alt: { type: "text", initialValue: "Placeholder Image" },
    fit: {
      type: "select",
      options: ["contain", "cover", "fill"],
      defaultValue: "cover",
    },
    radius: {
      type: "select",
      options: ["none", "small", "medium", "full"],
      defaultValue: "none",
    },
    width: { type: "text", initialValue: "200px" },
    height: { type: "text", initialValue: "200px" },
  },
  getCode,
};

export const fitDemo = {
  type: "code",
  code: `
  <Flex gap="large" align="center">
    <Image 
    src="https://images.unsplash.com/photo-1447690709975-318628b14c57"
    alt="Nature landscape"
    width={200}
    height={150}
    fit="contain"
    />
    <Image 
    src="https://images.unsplash.com/photo-1447690709975-318628b14c57"
    alt="Nature landscape"
    width={200}
    height={150}
    fit="cover"
    />
    <Image 
    src="https://images.unsplash.com/photo-1447690709975-318628b14c57"
    alt="Nature landscape"
    width={200}
    height={150}
    fit="fill"
    />
  </Flex>`,
};
export const radiusDemo = {
  type: "code",
  code: `
  <Flex gap="large">
    <Image 
    src="https://images.unsplash.com/photo-1447690709975-318628b14c57"
    alt="Nature"
    width={100}
    height={100}
    radius="none"
    />
    <Image 
    src="https://images.unsplash.com/photo-1447690709975-318628b14c57"
    alt="Nature"
    width={100}
    height={100}
    radius="small"
    />
    <Image 
    src="https://images.unsplash.com/photo-1447690709975-318628b14c57"
    alt="Nature"
    width={100}
    height={100}
    radius="medium"
    />
    <Image 
    src="https://images.unsplash.com/photo-1447690709975-318628b14c57"
    alt="Nature"
    width={100}
    height={100}
    radius="full"
    />
  </Flex>`,
};
export const fallbackDemo = {
  type: "code",
  code: `
  <Flex gap="large">
    <Image 
    src="invalid-image-url.jpg"
    fallback="https://images.unsplash.com/photo-1447690709975-318628b14c57"
    alt="With fallback"
    width={200}
    height={150}
    fit="cover"
    radius="medium"
    />
  </Flex>`,
};
