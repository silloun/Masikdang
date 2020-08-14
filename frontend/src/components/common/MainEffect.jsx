import React from "react";
import "./MainEffect.scss";

class MainEffect extends React.Component {
  render() {
    return (
      <div className="MainEffect">
        <div className="text">마식당은</div>
        <div className="animated-text">
          <div className="line">마식는 스타일을</div>
          <div className="line">오늘 뭐 먹을지</div>
          <div className="line">내 근처 식당을</div>
          <div className="line">나만의 추천 맛집을</div>
        </div>
        <div className="text">알려줍니다</div>
      </div>
    );
  }
}

export default MainEffect;
