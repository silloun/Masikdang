import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useWhatToEat } from "../../contexts/whatToEat";
import { NavLink } from "react-router-dom";
import Location from "./Location";
import "./WhatToEat.scss";

const WhatToEat = ({ wreset, windex, wquestion, woptions, wanswer, wincrement, wadd, wedit }) => {
  const [loc, setLoc] = useState("");

  const onChangeLoc = (e) => {
    setLoc(e.target.value);
  };

  const answering = (option) => {
    wanswer.length === windex ? wadd(option) : wedit(option); // 첫 응답 : 응답 수정
    // //console.log(wanswer);
    wincrement();
  };

  const answeringLoc = () => {
    var pattern = /([^가-힣\x20])/i; // 한글 판단
    var special_pattern = /[`~!@#$%^&*|'";:/?]/gi; // 특수문자 판단

    if (special_pattern.test(loc) || loc === "" || pattern.test(loc)) {
      alert("입력한 위치를 다시 확인해주세요.");
      document.getElementById("loc").value = "";
    } else {
      wanswer.length === windex ? wadd(loc) : wedit(loc); // 첫 응답 : 응답 수정
      // //console.log(wanswer);
      // //console.log(loc);
      wincrement();
    }
  };

  let history = useHistory();

  const done = (option) => {
    wadd(option);

    var select = wanswer.concat(option);
    history.push({
      pathname: "/whatToEatResult",
      state: select,
    });
  };

  const optionList = woptions[windex].map((option, idx) => (
    <div key={idx} className="option">
      {wanswer.length === wquestion.length && wreset()}
      {
        // 보통 설문
        windex !== wquestion.length - 1 && option !== "" ? (
          <NavLink
            to={`/whatToEat`}
            onClick={function () {
              // 응답 진행중
              answering(idx);
            }}
            className="optionLink"
          >
            {option}
          </NavLink>
        ) : // 현위치 받는 설문
        windex !== wquestion.length - 1 && option === "" ? (
          // 현위치
          idx === 0 ? (
            <Location />
          ) : (
            // 직접 입력
            <div>
              <input className="locInput" id="loc" placeholder="예) 역삼역 or 강남구 역삼동" val={loc} onChange={onChangeLoc} />
              &nbsp;
              <button
                className="locBtn"
                onClick={function () {
                  // 응답 진행중
                  answeringLoc();
                }}
              >
                입력
              </button>
            </div>
          )
        ) : (
          // 마지막 설문
          <div
            onClick={function () {
              // 마지막 문항 완료
              done(idx);
            }}
            className="optionLink"
          >
            {" "}
            {option}{" "}
          </div>
        )
      }
    </div>
  ));

  return (
    <div className="content">
      <h3 className="question">{wquestion[windex]}</h3>
      <div className="answer">{optionList}</div>
    </div>
  );
};

export default useWhatToEat(({ state, actions }) => ({
  wreset: actions.wreset,
  windex: state.windex,
  wquestion: state.wquestion,
  woptions: state.woptions,
  wanswer: state.wanswer,
  wadd: actions.wadd,
  wedit: actions.wedit,
  wincrement: actions.wincrement,
}))(WhatToEat);
