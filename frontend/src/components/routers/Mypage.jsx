import React from "react";
import { NavLink } from "react-router-dom";
import AppBar from "../common/AppBar";
import Header from "../common/Header";
import MyFavorite from "../mypage/MyFavorite";
import MyReview from "../mypage/MyReview";
import { UserContext } from "../../contexts/user";

import "./Mypage.scss";

const Emoji = (props) => (
  <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
    {props.symbol}
  </span>
);

class Mypage extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);

    this.state = {
      login: false,
      nickname: "",
      survey_result: "",
    };
  }

  componentDidMount() {
    if (window.sessionStorage.getItem("user")) {
      let user = JSON.parse(window.sessionStorage.getItem("user"));
      //console.log(user);

      this.setState({
        login: true,
        nickname: user.nickname,
        survey_result: user.survey_result,
        img: user.img,
      });
    }
  }

  render() {
    return (
      <div className="Box">
        <Header />
        {this.state.login ? (
          <div className="Mypage">
            <div className="profileBox">
              <div className="imgBox">
                {this.state.img !== null ? <img alt="프로필" src={this.state.img} /> : <img alt="프로필" src="https://d2x5ku95bkycr3.cloudfront.net/App_Themes/Common/images/profile/0_200.png" />}
                <NavLink className="btn" to={`/mypage/detail`}>
                  내 정보 조회
                </NavLink>
              </div>
              <div className="textBox">
                <div className="nickname">{this.state.nickname}</div>
                <div className="type">{this.state.survey_result}</div>
                <div className="cntBox">
                  <NavLink to={`/mypage/favorite`} className="fcnt">
                    <Emoji label="like" symbol="❤️" />
                    즐겨찾기&nbsp;&nbsp;{this.context.state.favorite}
                  </NavLink>
                  <NavLink to={`/mypage/review`} className="rcnt">
                    <Emoji label="star" symbol="📝" />
                    리뷰&nbsp;&nbsp;{this.context.state.review}
                  </NavLink>
                </div>
              </div>
            </div>
            <MyFavorite />
            <MyReview />
          </div>
        ) : (
          <div className="loginBox">
            <a className="joinBtn" href="/signup">
              회원가입
            </a>
            <a className="loginBtn" href="/login">
              로그인
            </a>
          </div>
        )}
        <AppBar />
      </div>
    );
  }
}

export default Mypage;
