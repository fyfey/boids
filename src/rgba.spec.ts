import { Color } from "./color";

describe("Rgba", () => {
  it("Creates instance from hex", () => {
    expect(Color.fromHex("#000000").toHex()).toEqual("rgba(0, 0, 0, 1)");
    expect(Color.fromHex("#ffffff").toHex()).toEqual("rgba(255, 255, 255, 1)");
    expect(Color.fromHex("#ffffff00").toHex()).toEqual(
      "rgba(255, 255, 255, 0)"
    );
    expect(Color.fromHex("#ffffff80").toHex()).toEqual(
      "rgba(255, 255, 255, 0.5)"
    );
    expect(Color.fromHex("#ffffffaa").toHex()).toEqual(
      "rgba(255, 255, 255, 0.67)"
    );
    expect(Color.fromHex("#ffffffcc").toHex()).toEqual(
      "rgba(255, 255, 255, 0.8)"
    );
    expect(Color.fromHex("#ffffffee").toHex()).toEqual(
      "rgba(255, 255, 255, 0.93)"
    );
    expect(Color.fromHex("#ffffffff").toHex()).toEqual(
      "rgba(255, 255, 255, 1)"
    );
  });
});
