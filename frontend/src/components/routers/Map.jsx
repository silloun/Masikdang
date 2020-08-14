import React from "react";
import "./Map.scss";

import AppBar from "../common/AppBar";
import Header from "../common/Header";
import NearMap from "../map/NearMap";
import TopButton from "../common/TopButton"
import ScrollToTop from "../common/ScrollToTop";

const Emoji = (props) => (
  <span
    className="emoji"
    role="img"
    aria-label={props.label ? props.label : ""}
    aria-hidden={props.label ? "false" : "true"}
  >
    {props.symbol}
  </span>
);

class Map extends React.Component {

  render() {
    return (
      <div className="Box">
        <Header></Header>
        <TopButton></TopButton>
        <ScrollToTop/>
        <div className="Map">
          <div className="title"><Emoji label="map" symbol="🗺️" /> 내 주변 맛집 정보</div>
          <div className="map_content"><NearMap></NearMap></div>
        </div>
        <AppBar></AppBar>
      </div>
    );
  }
}

export default Map;
