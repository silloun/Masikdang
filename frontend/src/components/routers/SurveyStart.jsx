import React from "react";
import { NavLink } from "react-router-dom";
import "./SurveyStart.scss";

const SurveyStart = () => {
  const Emoji = (props) => (
    <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
      {props.symbol}
    </span>
  );

  return (
    <div className="SurveyStartComponent">
      <div className="first">열심히 일한 당신, 떠나라!</div>
      <div className="second">장기 프로젝트가 끝난 당신에게</div>
      <div className="second">
        <Emoji label="party" symbol="🎊" />
        포상 휴가
        <Emoji label="party" symbol="🎉" />가 주어졌습니다.
      </div>
      <div className="third">(휴가 기간은 자유롭게 상상해보세요)</div>
      <br />
      <div className="second">오랜만에 여행을 떠나려는 당신,</div>
      <div className="second">함께 계획을 세워볼까요?</div>
      <NavLink className="btn" to={`/survey`}>
        시작하기 <Emoji label="next" symbol="👉" />
      </NavLink>
      <div className="explain">
        <div>내 마식는 타입을</div>
        <div>알아보기 위한</div>
        <div>심리 테스트입니다!</div>
      </div>
    </div>
  );
};

export default SurveyStart;
