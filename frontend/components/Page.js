import React, { Component } from "react";
import styled, { ThemeProvider, injectGlobal } from "styled-components";

import Header from "./Header";
import Meta from "./Meta";

const theme = {
  red: "#FF0000",
  black: "#393939",
  grey: "#3A3A3A",
  lightgrey: "#E1E1E1",
  offWhite: "#EDEDED",
  maxWidth: "1000px",
  // bs === box-shadow
  bs: "0 12px 24px 0 rgba(0, 0, 0, 0.09)"
};

// Need to call injectGlobal in order for it to inject the theme globally
injectGlobal`
  @font-face {
    font-family: "radnika_next" ;
    src: url("/static/radnikanext-medium-webfont.woff2")
    format("woff2");
    font-weight: normal;
    font-style: normal;
  }
  html{
    box-sizing: border-box;
    font-size: 10px;
  }
/* the best way to setup box-sizing: border box.  Setup on root (above) and set EVERYTHING to inherit that (below)  */
  *, *:before, *:after{
    box-sizing: inherit;
  }

  body{
    padding: 0;
    margin: 0;
    /* b/c font size is set to 10px, that means that all fonts will be base-10, meaning 1.5rem will be 15px */
    font-size: 1.5rem;
    line-height: 2;
    font-family:"radnika_next";
  }
  a{
    text-decoration: none;
    color: ${theme.black}
  }
`;

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
`;

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <Meta />
          <Header />
          <Inner>{this.props.children}</Inner>
        </StyledPage>
      </ThemeProvider>
    );
  }
}
export default Page;

/*  Styled component example
const MyButton = styled.button`
  background: red;
  font-size: ${props => (props.huge ? "100px" : "50px")};
  .poop {
    font-size: 100px;
  }
`;

class Page extends Component {
  render() {
    return (
      <div>
        <Meta />
        <Header />
        <MyButton huge>
          Click Me!<span className="poop">💩</span>
        </MyButton>
        // no `huge` attribute
        <MyButton>
          Click Me!<span className="poop">💩</span>
        </MyButton>
        {this.props.children}
      </div>
    );
  }
}
*/
