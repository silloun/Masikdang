import React from "react";
import "./Feature.scss";
import { withRouter } from "react-router-dom";

class Feature extends React.Component {
  render() {
    const { feature } = this.props;
    return (
      <div className="Feature">
        <div className="subject">
          <span>{feature.title}. </span>
          {feature.subtitle}
        </div>
        {feature.id === "person" ? (
          <div
            className="centralize"
          >
            <h1>BEST☆</h1>
          </div>
        ) : (
          <div
            className="centralize"
            onClick={() => this.props.history.push(feature.path)}
          >
            <h1>해보기→</h1>
          </div>
        )}

        <div className="content">
          {feature.algorithm !== "" && <span>{feature.algorithm}</span>}
          <div>{feature.content}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(Feature);
