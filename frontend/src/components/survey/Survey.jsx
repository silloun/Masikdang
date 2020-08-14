import React from "react";
import { useSurvey } from "../../contexts/survey";
import { NavLink } from "react-router-dom";
import "./Survey.scss";

const Survey = ({ reset, index, question, options, answer, increment, add, edit }) => {
  const answering = (idx) => {
    answer.length === index ? add(idx) : edit(idx); // 첫 응답 : 응답 수정
    increment();
  };

  const done = (idx) => {
    add(idx);
  };

  const optionList = options[index].map((option, idx) => (
    <div key={idx} className="option">
      {answer.length === question.length ? reset() : ""}
      {index !== question.length - 1 ? (
        <NavLink
          to={`/survey`}
          onClick={function () {
            // 응답 진행중
            answering(idx);
          }}
          className="optionLink"
        >
          {option}
        </NavLink>
      ) : (
        <NavLink
          to={`/surveyResult`}
          onClick={function () {
            // 마지막 문항 완료
            done(idx);
          }}
          className="optionLink"
        >
          {" "}
          {option}{" "}
        </NavLink>
      )}
    </div>
  ));

  return (
    <div className="sbox">
      <div className="question">{question[index]}</div>
      <div className="answer">{optionList}</div>
    </div>
  );
};

export default useSurvey(({ state, actions }) => ({
  reset: actions.reset,
  index: state.index,
  question: state.question,
  options: state.options,
  answer: state.answer,
  add: actions.add,
  edit: actions.edit,
  increment: actions.increment,
}))(Survey);
