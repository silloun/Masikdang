import React from "react";
import { NavLink } from "react-router-dom";
import { useSurvey } from "../../contexts/survey";
import "./Main.scss";
import "../../assets/css/main.scss";
import "../../assets/css/noscript.css";

import MainEffect from "../common/MainEffect";

const Main = ({ reset }) => {
  const Emoji = (props) => (
    <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
      {props.symbol}
    </span>
  );

  return (
    <div>
      <div id="wrapper" className="Mainpage">
        <div id="bg" />
        <div id="overlay" />
        <div id="main">
          <div id="header">
            <NavLink to={`/home`} className="logoBtn">
              <img alt="logo" className="logoImg" src="/logo.png" />
            </NavLink>
            <br />
            <br />
            <div className="pBox">
              <MainEffect></MainEffect>
            </div>
            <br />
            <div className="moveBox">
              <NavLink to={`/surveyStart`} className="moveBtn" onClick={reset}>
                <Emoji label="food" symbol="🍝" /> 마식는 테스트
              </NavLink>
              <NavLink to={`/whatToEatStart`} className="moveBtn">
                <Emoji label="burger" symbol="🍔" /> 오늘 뭐 먹지?
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default useSurvey(({ actions }) => ({
  reset: actions.reset,
}))(Main);
