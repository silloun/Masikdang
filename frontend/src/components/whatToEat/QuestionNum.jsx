import React from "react";
import { useHistory } from "react-router-dom";
import "./WhatToEat.scss";
import { useWhatToEat } from "../../contexts/whatToEat";

const Counter = ({ windex, wreset }) => {
  const Emoji = (props) => (
    <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
      {props.symbol}
    </span>
  );

  let history = useHistory();

  const confirm = (val) => {
    if (window.confirm("테스트를 종료하시겠습니까?")) {
      wreset();
      val === "main" ? history.push("/") : history.push("/home");
    }
  };

  return (
    <div className="top">
      <button
        className="back"
        onClick={function () {
          confirm("main");
        }}
      >
        <Emoji label="home" symbol="🏠" />
        메인
      </button>
      {/* </button> */}
      <span>
        <b>{windex + 1}번 질문!</b>
      </span>
      <button
        className="back"
        onClick={function () {
          confirm("home");
        }}
      >
        <Emoji label="restaurant" symbol="🍝" />
        마식당
      </button>
    </div>
  );
};

// 어떤 값을 props에 넣어줄 지 정해주기
export default useWhatToEat(({ state, actions }) => ({
  windex: state.windex,
  wquestion: state.wquestion,
  wreset: actions.wreset,
}))(Counter);
