import { getAvatarColor } from "./utils";
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
