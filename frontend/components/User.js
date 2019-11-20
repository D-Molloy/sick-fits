import { Query } from "react-apollo";
import gql from "graphql-tag";
import propTypes from "prop-types";

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
      orders {
        id
      }
      cart {
        id
        quantity
        item {
          id
          price
          image
          title
          description
        }
      }
    }
  }
`;

const User = props => {
  // need to spread all the props that maybe passed
  return (
    <Query {...props} query={CURRENT_USER_QUERY}>
      {payload => props.children(payload)}
    </Query>
  );
};
//.children(payload) allows us to pass the payload from the query to any User component:
//   <User>{payload=> }</User>

User.propTypes = {
  children: propTypes.func.isRequired
};

export default User;
export { CURRENT_USER_QUERY };
