import App, { Container } from "next/app";
import Page from "../components/Page";
import { ApolloProvider } from "react-apollo";
import withData from "../lib/withData";
class MyApp extends App {
  // getInitialProps is a lifecycle method from next.js
  // getInitialProps needs to be done due to server-side rendering
  // it runs before the initial render, allowing us to pull off pageProps off of props in the render
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    // if the page we're trying to render has initial props, surface them via the page props
    if (Component.getInitialProps) {
      // every single page is crawled for queries and mutations and those get run before we render
      pageProps = await Component.getInitialProps(ctx);
    }
    // this exposes the query to the user
    pageProps.query = ctx.query;
    return { pageProps };
  }

  render() {
    const { Component, apollo, pageProps } = this.props;
    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            {/* component will be the current page */}
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    );
  }
}
// withData gives up this.props.apollo
export default withData(MyApp);
