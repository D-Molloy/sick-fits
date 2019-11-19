/**
 * -THIS IS HOW YOU TEST AN APOLLO QUERY
 */

// need to mount in order to test the components (like the query component) and all of their content as well
import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import SingleItem, { SINGLE_ITEM_QUERY } from "../components/SingleItem";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeItem } from "../lib/testUtils";

describe("<SingleItem />", () => {
  it("renders with proper data", async () => {
    // this fails because there is no Apollo Provider wrapping the component
    // const wrapper = mount(<SingleItem id={123} />);

    // mocks are pairs or request and resulting data
    const mocks = [
      {
        // when someone makes a request with a matching request and id, return the specified value
        request: {
          query: SINGLE_ITEM_QUERY,
          variables: { id: "123" }
        },
        // can do this, but not realistic
        // delay: 55,
        // return this data
        result: {
          data: {
            item: fakeItem()
          }
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );

    //This initially shows loading because it's querying the database
    // console.log(wrapper.debug());

    expect(wrapper.text()).toContain("Loading...");

    await wait();
    wrapper.update();
    // console.log(wrapper.debug());

    // This snapshot is huge.  Need to individually snapshot tests
    // expect(toJSON(wrapper)).toMatchSnapshot();
    expect(toJSON(wrapper.find("h2"))).toMatchSnapshot();
    expect(toJSON(wrapper.find("img"))).toMatchSnapshot();
    expect(toJSON(wrapper.find("p"))).toMatchSnapshot();
  });

  it("errors with a not found item", async () => {
    const mocks = [
      {
        request: {
          query: SINGLE_ITEM_QUERY,
          variables: { id: "123" }
        },

        result: {
          errors: [{ message: "Items not found" }]
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    // use data-test attributes on elements you may have trouble grabbing
    const item = wrapper.find('[data-test="graphql-error"]');
    // console.log(item.text()); //Shoot!Items not found
    expect(item.text()).toContain("Items not found"); //pass

    expect(toJSON(item)).toMatchSnapshot();
  });
});
