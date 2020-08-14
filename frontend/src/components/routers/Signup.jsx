import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import GoogleLogin from "react-google-login";
import KakaoLogin from "react-kakao-login";

import AuthTemplate from "../auth/AuthTemplate";
import "./Auth.scss";
import { SurveyContext } from "../../contexts/survey";

class Signup extends React.Component {
  static contextType = SurveyContext;

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      provider: "",
    };
  }

  componentDidMount() {
    const { history } = this.props;

    // 만약 로그인을 했으면
    if (window.sessionStorage.getItem("user")) {
      alert("로그아웃 후 진행해주세요");
      history.goBack("");
    } else if (this.context.state.answer.length !== 9) {
      alert("마식는 테스트를 먼저 진행해주세요");
      history.push("/surveyStart");
    }
  }

  // 회원 가입 되어있는 건지 확인
  checkId = () => {
    const { history } = this.props;

    //axios 호출
    axios({
      method: "get",
      url: `${process.env.REACT_APP_URL}/user/join_check/${this.state.provider}/${this.state.id}`,
    })
      // 회원 가입 안되있는 거면
      .then((res) => {
        //console.log(res);
        // 회원가입이 되어 있으면
        if (res.data === "YES") alert("이미 가입된 유저입니다");
        // 회원가입이 안되있으면
        else {
          history.push({
            pathname: "/signup/detail",
            state: {
              api_id: this.state.id,
              provider: this.state.provider,
              answer: this.context.state.answer,
              survey_result: this.context.state.survey_result,
            },
          });
          this.context.actions.reset();
        }
      })
      .catch((error) => {
        alert("회원가입에 실패했습니다.");
      });
  };

  // Google Login
  responseGoogle = (res) => {
    this.setState({
      id: res.googleId,
      name: res.profileObj.name,
      provider: "google",
    });

    // 토큰 삭제
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then();
    auth2.disconnect();

    this.checkId();
  };

  // Kakao Login
  responseKakao = (res) => {
    //console.log(res);
    this.setState({
      id: res.profile.id,
      name: res.profile.properties.nickname,
      provider: "kakao",
    });

    // 토큰 삭제
    window.Kakao.API.request({
      url: "/v1/user/unlink",
    });
    // window.Kakao.Auth.logout();
    this.checkId();
  };

  // Login Fail
  responseFail = (err) => {
    console.error(err);
  };

  render() {
    return (
      <div className="Signup">
        <AuthTemplate>
          <div className="main_letter">회원가입</div>
          <GoogleLogin
            id="google"
            className="easy_login"
            clientId={process.env.REACT_APP_GOOGLE}
            buttonText="Google"
            icon=""
            onSuccess={this.responseGoogle}
            onFailure={this.responseFail}
            cookiePolicy={"single_host_origin"}
          />

          <KakaoLogin id="kakao" className="easy_login" jsKey={process.env.REACT_APP_KAKAO} buttonText="Kakao" onSuccess={this.responseKakao} onFailure={this.responseFail} getProfile="true" />

          <div className="link_btn">
            <Link to="/login">로그인</Link>
          </div>
        </AuthTemplate>
      </div>
    );
  }
}

export default Signup;
