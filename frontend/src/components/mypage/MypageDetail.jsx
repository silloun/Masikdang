import React from "react";
import "./MypageDetail.scss";
import axios from "axios";

import AppBar from "../common/AppBar";
import Header from "../common/Header";
import { NavLink } from "react-router-dom";

class MypageDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      age: 1,
      gender: "",
      provider: "",
      nickname: "",
      survey_result: "",
      profile: [], // 새로운 이미지 파일
      base64: "", // 미리보기
    };
  }

  user = JSON.parse(window.sessionStorage.getItem("user"));

  componentDidMount() {
    if (this.user) {
      this.setState({
        login: true,
        age: this.user.age,
        gender: this.user.gender,
        provider: this.user.provider,
        nickname: this.user.nickname,
        survey_result: this.user.survey_result,
        base64: this.user.img,
      });
    } else {
      const { history } = this.props;
      history.push("/mypage");
    }
  }

  // 사진 변경 axios 연결
  handleClick = () => {
    // 이미지를 변경한 경우에만
    if (this.state.profile.length !== 0) {
      const path = new FormData();
      path.append("path", this.state.profile);
      axios({
        method: "post",
        url: `${process.env.REACT_APP_URL}/upload_profile/${this.user.id}`,
        headers: { "Content-Type": "multipart/form-data" },
        data: path,
      })
        .then((res) => {
          //console.log(res.data);
          this.user.img = res.data.img;
          window.sessionStorage.removeItem("user");
          window.sessionStorage.setItem("user", JSON.stringify(this.user));
          alert("프로필 이미지 변경이 완료되었습니다");
        })
        .catch((err) => {
          alert("이미지 수정 실패");
        });
    }
    // 이미지를 변경 안한 경우
    else {
      alert("이미지를 변경하지 않았습니다.");
    }
  };

  // 이미지 변경 함수
  InputChange = (e) => {
    //이미지 변경됐을 때 프리뷰
    let reader = new FileReader();
    reader.onloadend = () => {
      // 2. 읽기가 완료되면 아래코드가 실행
      const base64 = reader.result; //reader.result는 이미지를 인코딩(base64 ->이미지를 text인코딩)한 결괏값이 나온다.
      if (base64) {
        this.setState({
          base64: base64.toString(), // 파일 base64 상태 업데이트
        });
      }
    };
    if (e.target.files) {
      reader.readAsDataURL(e.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다. 저장후 onloadend 트리거
      this.setState({
        profile: e.target.files[0],
      });
    }
  };

  logout = () => {
    alert("로그아웃 되었습니다");
    window.sessionStorage.clear();
  };

  render() {
    return (
      <div className="Box">
        <Header></Header>
        <div className="MypageDetail">
          <div className="upper">
            <div className="profile_img">
              {this.state.base64 === null ? <img alt="프로필" src="https://d2x5ku95bkycr3.cloudfront.net/App_Themes/Common/images/profile/0_200.png" /> : <img alt="프로필" src={this.state.base64} />}
            </div>
            <div className="imgBox">
              <div className="upload_btn">
                <div className="filebox">
                  <label className="imgBtn">
                    프로필 사진 변경
                    <input type="file" accept="image/gif, image/jpeg, image/png" onChange={this.InputChange} />
                  </label>
                </div>
              </div>
              <span className="arrow">&nbsp;→&nbsp;</span>
              <div className="imgBtn" onClick={this.handleClick}>
                완료
              </div>
            </div>
          </div>
          <div className="profileBox">
            <div className="column">
              <div className="box">닉네임</div>
              <div className="box">가입 경로</div>
              <div className="box">성별</div>
              <div className="box">나이</div>
              <div className="box">마식는 타입</div>
            </div>
            <div className="value">
              <div className="box">{this.state.nickname}</div>
              <div className="box">{this.state.provider}</div>
              <div className="box">{this.state.gender}</div>
              <div className="box">{this.state.age}대</div>
              <div className="box">{this.state.survey_result}</div>
            </div>
          </div>
          <div className="btnBox">
            <NavLink className="btn" to={`/mypage`}>
              뒤로가기
            </NavLink>
            <NavLink className="btn" to={`/home`} onClick={this.logout}>
              로그아웃
            </NavLink>
          </div>
        </div>
        <AppBar></AppBar>
      </div>
    );
  }
}

export default MypageDetail;
