import React from "react";
import "./Loading.scss";

class ScrollToTop extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return <></>;
  }
}

export default ScrollToTop;
