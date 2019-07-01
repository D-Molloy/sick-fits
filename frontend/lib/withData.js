// withApollo is a high order component which exposes the client via a prop
// because we're doing server-side rendering, we have to use it
import withApollo from "next-with-apollo";
// apollo boost - bundling all the functionality of apollo-client, http requests, error handling, etc https://www.npmjs.com/package/apollo-boost
import ApolloClient from "apollo-boost";
import { endpoint } from "../config";

// headers has to do with authentication
function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === "development" ? endpoint : endpoint,
    // request is similar to express middleware
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: "include"
        },
        headers
      });
    }
  });
}

export default withApollo(createClient);
