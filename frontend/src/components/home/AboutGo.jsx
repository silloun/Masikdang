import React from "react";
import "./AboutGo.scss";
import { withRouter } from "react-router-dom";

class AboutGo extends React.Component {
  render() {
    return (
      <div className="AboutGo" onClick={() => this.props.history.push("/about")}>
        <p>ABOUT&nbsp;&nbsp;&nbsp;US</p>
      </div>
    );
  }
}

export default withRouter(AboutGo);
