// a "test suite" is a describe
// test() and it() are the same thing
describe("sample test 101", () => {
  it("works as expected", () => {
    // can have as many expects as you need for a particular item
    const age = 100;
    expect(1).toEqual(1);
    expect(age).toEqual(100);
  });

  //Ways to skip a test
  // it.skip("handles ranges just find", () => {
  // xit("handles ranges just find", () => {
  it("handles ranges just find", () => {
    const age = 200;
    expect(age).toBeGreaterThan(100);
  });

  //Ways to run only this test
  // it.only("makes a list of dog names", () => {
  // fit("makes a list of dog names", () => {
  it("makes a list of dog names", () => {
    const dogs = ["snickers", "hugo"];

    expect(dogs).toEqual(dogs);
    expect(dogs).toContain("snickers");
  });
});
