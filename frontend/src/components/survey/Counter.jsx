import React from "react";
import { useSurvey } from "../../contexts/survey";
import "./Survey.scss";

const Counter = ({ index, question, decrement }) => {
  return (
    <div className="bottom">
      {index > 0 && (
        <button className="backBtn" onClick={decrement}>
          {" "}
          👈{" "}
        </button>
      )}
      <span>
        <b>
          {" "}
          {index + 1} / {question.length}{" "}
        </b>
      </span>
      {index > 0 ? <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : <span />}
    </div>
  );
};

// 어떤 값을 props에 넣어줄 지 정해주기
export default useSurvey(({ state, actions }) => ({
  index: state.index,
  question: state.question,
  decrement: actions.decrement,
}))(Counter);
