import React from "react";
import "./Intro.scss";

class Intro extends React.Component {

  render() {
    return (
      <div className="Intro">
        마식당은 <p onClick={this.props.onClickBig}>빅데이터 알고리즘</p> 기반<br/>식당 추천 사이트입니다
      </div>
    );
  }
}

export default Intro;