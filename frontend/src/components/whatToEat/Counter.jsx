import React from "react";
import { useWhatToEat } from "../../contexts/whatToEat";
import "./WhatToEat.scss";

const Counter = ({ windex, wquestion, wdecrement }) => {
  return (
    <div className="bottom">
      {windex > 0 ? (
        <button className="backBtn" onClick={wdecrement}>
          {" "}
          👈{" "}
        </button>
      ) : (
        <span />
      )}
      <span>
        <b>
          {" "}
          {windex + 1} / {wquestion.length}{" "}
        </b>
      </span>
      {windex > 0 ? <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : <span />}
    </div>
  );
};

// 어떤 값을 props에 넣어줄 지 정해주기
export default useWhatToEat(({ state, actions }) => ({
  windex: state.windex,
  wquestion: state.wquestion,
  wdecrement: actions.wdecrement,
}))(Counter);
