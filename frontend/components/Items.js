import React, { Component } from "react";
// Query is actually a component
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Item from "./Item";

// recommended to do queries in the same component
const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

export default class Items extends Component {
  render() {
    return (
      <Center>
        <p>Items</p>
        {/* the only child of a query comp MUST be a function */}
        <Query query={ALL_ITEMS_QUERY}>
          {/* data, error and loading come from payload */}
          {({ data, error, loading }) => {
            // Important to check errors loading first!
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error}</p>;
            return (
              <ItemsList>
                {data.items.map(item => (
                  <Item key={item.id} item={item} />
                ))}
              </ItemsList>
            );
          }}
        </Query>
      </Center>
    );
  }
}
