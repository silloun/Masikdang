import React from "react";
import "./Loading.scss";

class Loading extends React.Component {
  render() {
    return (
      <div className="Loadings">
        <div className="lcontainer">
          <div className="loader">
            <div className="loader--dot"></div>
            <div className="loader--dot"></div>
            <div className="loader--dot"></div>
            <div className="loader--dot"></div>
            <div className="loader--dot"></div>
            <div className="loader--dot"></div>
            <div className="loader--text"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Loading;
