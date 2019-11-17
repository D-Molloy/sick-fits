import ItemComponent from "../components/Item";
import { shallow } from "enzyme";
const fakeItem = {
  id: "ABC123",
  title: "A Cool Item",
  price: 4000,
  description: "This item is really cool!",
  image: "dog.jpg",
  largeImage: "largedog.jpg"
};

// This is shallow rendering - it renders the top level component
// It would should the button component name, not the actual button inside that component
// console.log(PriceTag.text()); -> logs <PriceTag />
// dive will shallow render one level deeper
// console.log(PriceTag.dive().text()); // $40
// .children will give you the actual child
// console.log(PriceTag.children().text());
describe("<Item/>", () => {
  it("renders PriceTag and Title properly properly", () => {
    // Mounting the wrapper
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    // debug - show all of the html this component would display
    // console.log(wrapper.debug());
    const PriceTag = wrapper.find("PriceTag");

    // expect(PriceTag.children().text()).toBe("$50"); //test fail
    expect(PriceTag.children().text()).toBe("$40"); //test pass
    // using fakeItem.title instead a string literal is better test writing
    expect(wrapper.find("Title a").text()).toBe(fakeItem.title);
  });

  it("renders images properly", () => {
    // Mounting the wrapper
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const img = wrapper.find("img");
    expect(img.props().src).toBe(fakeItem.image);
    expect(img.props().alt).toBe(fakeItem.title);
  });

  it("renders out the buttons properly", () => {
    // Mounting the wrapper, then search and check if things render correctly
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const buttonList = wrapper.find(".buttonList");

    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find("Link")).toHaveLength(1);
    expect(buttonList.find("Link").exists()).toBeTruthy();
    expect(buttonList.find("Link").exists()).toBe(true);
    expect(buttonList.find("AddToCart").exists()).toBe(true);
    // expect(buttonList.find("RemoveFromCart").exists()).toBe(true); //false
    expect(buttonList.find("DeleteItem").exists()).toBe(true);
  });
});
