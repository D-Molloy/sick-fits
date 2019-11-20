// withApollo is a high order component which exposes the client via a prop
// because we're doing server-side rendering, we have to use it
import withApollo from "next-with-apollo";
// apollo boost - bundling all the functionality of apollo-client, http requests, error handling, etc https://www.npmjs.com/package/apollo-boost
import ApolloClient from "apollo-boost";
import { endpoint, prodEndpoint } from "../config";
import { LOCAL_STATE_QUERY } from "../components/Cart";
// headers has to do with authentication
function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
    // request is similar to express middleware
    // changed from headers by itself to the below:
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: "include"
        },
        headers: { cookie: headers && headers.cookie }
      });
    },
    // local data - set on initial load
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, { cache }) {
            // 1 - read the cartOpen value from the cache
            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY
            });

            // write the cart state to the opposite
            const data = {
              data: { cartOpen: !cartOpen }
            };
            cache.writeData(data);
            return data;
          }
        }
      },
      defaults: {
        cartOpen: false
      }
    }
  });
}

export default withApollo(createClient);
