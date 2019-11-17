import formatMoney from "../lib/formatMoney";

describe("formatMoney Function", () => {
  it("it works with fractional dollars", () => {
    expect(formatMoney(1)).toEqual("$0.01");
    expect(formatMoney(10)).toEqual("$0.10");
    expect(formatMoney(9)).toEqual("$0.09");
    expect(formatMoney(40)).toEqual("$0.40");
    expect(formatMoney(333)).toEqual("$3.33");
  });

  it("Leaves cents off for whole dollars", () => {
    expect(formatMoney(5000)).toEqual("$50");
    expect(formatMoney(100)).toEqual("$1");
  });

  it("works with whole and fractional $$s", () => {
    expect(formatMoney(5010)).toEqual("$50.10");
    expect(formatMoney(5000)).toEqual("$50");
    expect(formatMoney(13232131646468)).toEqual("$132,321,316,464.68");
  });
});
