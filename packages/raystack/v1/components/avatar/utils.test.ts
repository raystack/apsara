import { getAvatarColor, getAvatarProps } from "./utils";
import { Avatar } from "./avatar";
import React from "react";

describe("getAvatarColor", () => {
  it("should return same color for the same name", () => {
    const color = getAvatarColor("John Doe");
    expect(color).toBe("purple");
  });

  it("should return color for uuid", () => {
    const id = "66c24439-a33b-4217-a113-e400f8165de8";
    const color = getAvatarColor(id);
    expect(color).toBe("iris");
  });

  it("should return color for empty string", () => {
    const id = "";
    const color = getAvatarColor(id);
    expect(color).toBe("indigo");
  });

  it("should parse string with symbols", () => {
    const id = "John_Doe!@#$%^&";
    const color = getAvatarColor(id);
    expect(color).toBe("grass");
  });
});

describe("getAvatarProps", () => {
  it("should return props directly from Avatar component", () => {
    const props = {
      size: 5 as const,
      color: "indigo" as const,
      fallback: "GS",
    };
    const element = React.createElement(Avatar, props);
    const result = getAvatarProps(element);
    expect(result).toEqual(props);
  });

  it("should return props from Avatar wrapped in another component", () => {
    const avatarProps = {
      size: 5 as const,
      color: "mint" as const,
      fallback: "GS",
    };
    const avatar = React.createElement(Avatar, avatarProps);
    const wrapper = React.createElement('div', {}, avatar);
    const result = getAvatarProps(wrapper);
    expect(result).toEqual(avatarProps);
  });

  it("should return props from deeply nested Avatar", () => {
    const avatarProps = {
      size: 7 as const,
      color: "sky" as const,
      fallback: "GS",
    };
    const avatar = React.createElement(Avatar, avatarProps);
    const innerWrapper = React.createElement('div', {}, avatar);
    const outerWrapper = React.createElement('div', {}, innerWrapper);
    const result = getAvatarProps(outerWrapper);
    expect(result).toEqual(avatarProps);
  });

  it("should return empty object when children is not a valid element", () => {
    const element = React.createElement('div', {}, 'text content');
    const result = getAvatarProps(element);
    expect(result).toEqual({});
  });
});
