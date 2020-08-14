import React from "react";
import { Link } from "react-router-dom";

import "./Auth.scss";

import AuthTemplate from "../auth/AuthTemplate";
import axios from "axios";

import GoogleLogin from "react-google-login";
import KakaoLogin from "react-kakao-login";

import { SurveyContext } from "../../contexts/survey";

class Login extends React.Component {
  static contextType = SurveyContext;

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      provider: "",
    };
  }

  componentDidMount() {
    // 만약 로그인을 했으면
    if (window.sessionStorage.getItem("user")) {
      alert("이미 로그인되어있습니다");
      this.props.history.goBack();
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
        // 회원가입이 되어 있으면
        if (res.data === "YES") {
          axios({
            method: "get",
            url: `${process.env.REACT_APP_URL}/user/${this.state.id}`,
          })
            // 로그인 성공하면 메인으로 보내기
            .then((res) => {
              //console.log(res.data);
              this.context.actions.reset();
              window.sessionStorage.setItem("user", JSON.stringify(res.data));
              history.push("/home");
            })
            .catch((error) => {
              //console.log(error);
            });
        }
        // 회원가입이 안되있으면
        else {
          alert("회원가입이 안된 유저입니다");
          history.push("/signup");
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  // Google Login
  responseGoogle = (res) => {
    // //console.log(res);
    this.setState({
      id: res.googleId,
      provider: "google",
    });

    // 토큰 삭제
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut();
    auth2.disconnect();

    this.checkId();
  };

  // Kakao Login
  responseKakao = (res) => {
    //console.log(res);
    this.setState({
      id: res.profile.id,
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
      <div className="Login">
        <AuthTemplate>
          <div className="main_letter">로그인</div>
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
            <Link to="/signup">회원가입</Link>
          </div>
        </AuthTemplate>
      </div>
    );
  }
}

export default Login;
