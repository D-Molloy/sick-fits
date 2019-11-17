function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(this.foods), 2000);
  });
};

// mocking things like requests
describe("Mocking learning", () => {
  it("mocks a reg function", () => {
    const fetchDogs = jest.fn();
    fetchDogs("Louis");
    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith("Louis");
    fetchDogs("Louis");
    expect(fetchDogs).toHaveBeenCalledTimes(2);
  });

  it("can create a person", () => {
    const denis = new Person("Denis", ["burgers", "MOAR BURGERS"]);
    expect(denis.name).toBe("Denis");
  });

  it("can fetch foods", async () => {
    const denis = new Person("Denis", ["burgers", "MOAR BURGERS"]);
    // mock the favFoods function
    denis.fetchFavFoods = jest.fn().mockResolvedValue(["sushi", "ramen"]);
    const favFoods = await denis.fetchFavFoods();
    expect(favFoods).toContain("sushi");
  });
});
