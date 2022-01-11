import { Rgba } from "./rgba";

describe("Rgba", () => {
  it("Creates instance from hex", () => {
    expect(Rgba.fromHex("#000000").toHex()).toEqual("rgba(0, 0, 0, 1)");
    expect(Rgba.fromHex("#ffffff").toHex()).toEqual("rgba(255, 255, 255, 1)");
    expect(Rgba.fromHex("#ffffff00").toHex()).toEqual("rgba(255, 255, 255, 0)");
    expect(Rgba.fromHex("#ffffff80").toHex()).toEqual(
      "rgba(255, 255, 255, 0.5)"
    );
    expect(Rgba.fromHex("#ffffffaa").toHex()).toEqual(
      "rgba(255, 255, 255, 0.67)"
    );
    expect(Rgba.fromHex("#ffffffcc").toHex()).toEqual(
      "rgba(255, 255, 255, 0.8)"
    );
    expect(Rgba.fromHex("#ffffffee").toHex()).toEqual(
      "rgba(255, 255, 255, 0.93)"
    );
    expect(Rgba.fromHex("#ffffffff").toHex()).toEqual("rgba(255, 255, 255, 1)");
  });
});
