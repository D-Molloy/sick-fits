import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import CartCount from "../components/CartCount";

describe("<CartCount/>", () => {
  it("renders", () => {
    shallow(<CartCount count={10} />); //dont need an expect because if it doesn't render the test will fail
  });

  it("matches the snapshot", () => {
    const wrapper = shallow(<CartCount count={11} />);
    // can take snapshots of multiple pieces using .find, etc
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it("updates via props", () => {
    const wrapper = shallow(<CartCount count={11} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.setProps({ count: 10 });
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  // MOUNT (below) SHALLOW (above)
  it("updates via props", () => {
    // mounting gives real html elements
    const wrapper = mount(<CartCount count={11} />);
    // console.log(wrapper.debug());

    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.setProps({ count: 10 });
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
