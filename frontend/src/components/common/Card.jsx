import React from "react";
import "./Card.scss";
import { withRouter } from "react-router-dom";
import Liked from "../common/Liked";
import store_img from "../../img/store.png";

const Emoji = (props) => (
  <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
    {props.symbol}
  </span>
);

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      store: this.props.store,
    };
  }

  clickItem = (res) => {
    const { history } = this.props;
    if (res.target.id === "evaluation") {
      history.push({
        pathname: "/write",
        params: {
          storeNo: this.state.store.id,
        },
      });
    } else if (res.target.id !== "liked") history.push("/search/" + this.state.store.id);
  };

  render() {
    return (
      <div className="Card">
        <div id="square" className="bounceIn flipInY animated" onClick={this.clickItem}>
          <div className="thumbnail">
            <div className="centered">
              <img alt="food" className="img" src={this.state.store.img ? this.state.store.img : store_img} />
            </div>
          </div>
          <div className="text">
            <div className="title">{this.state.store.store_name}</div>
            <div id="liked" className="liked_item">
              <Liked like={this.state.store.like} store={this.state.store.id}></Liked>
            </div>
            <div className="category category_bottom">
              {String(this.state.store.category).replace("|", ", ").replace("null", "")}
              &nbsp;
            </div>
            <div className="category">
              <Emoji label="search" symbol="⭐" />
              {this.state.store.avg_score}&nbsp;&nbsp;
              <Emoji label="search" symbol="🌼" />
              {this.state.store.area ? <>{this.state.store.area}</> : " - "}
            </div>
            <div id="evaluation" className="evaluation">
              평가하기
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Card);
