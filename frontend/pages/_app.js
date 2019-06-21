import App, { Container } from "next/app";

import Page from "../components/Page";

class MyApp extends App {
  render() {
    const { Component } = this.props;
    return (
      <Container>
        <Page>
          {/* component will be the current page */}
          <Component />
        </Page>
      </Container>
    );
  }
}

export default MyApp;
