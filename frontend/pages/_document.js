import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
/**
 *  Document is provided by Next.js.  Without using _document.js, the intial page will render, then styled components will kick, causing the page to flicker between not styled /styled.
 *  _document crawls the DOM and loads all the necessary styles first, then the server renders the page
 */

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html>
        <Head>{this.props.styleTags}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
