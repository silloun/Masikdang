import React from "react";
import { NavLink } from "react-router-dom";
import "./WhatToEatStart.scss";

const WhatToEatStart = () => {
  const Emoji = (props) => (
    <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
      {props.symbol}
    </span>
  );

  return (
    <div className="WhatToEatStart">
      <div className="first">오늘 뭐 먹지?</div>
      <div className="second">뭘 먹을지</div>
      <div className="second">고민되나요?</div>
      <br />
      <div className="second">터치 몇 번으로</div>
      <div className="second">
        <Emoji label="food1" symbol="🍙" />
        메뉴
        <Emoji label="food1" symbol="🍞" />를
      </div>
      <div className="second">추천해드려요!</div>
      <NavLink className="btn" to={`/whatToEat`}>
        시작하기 <Emoji label="next" symbol="👉" />
      </NavLink>
    </div>
  );
};

export default WhatToEatStart;
