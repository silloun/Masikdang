import React from "react";
import axios from "axios";

import "./SignupDetail.scss";
import "./Auth.scss";

import AgeSlider from "../common/AgeSlider";
import AuthTemplate from "../auth/AuthTemplate";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

class SignupDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      age: 30,
      gender: "여자",
      nickname: "",
      isnicknameVaild: true,
      open: false,
      provider: "",
      api_id: "",
      answer: [],
    };
  }

  componentDidMount() {
    // 만약 값이 없으면 이동
    const { history, location } = this.props;
    if (location.state === undefined) {
      alert("인증된 회원 정보가 없습니다.");
      history.push({ pathname: "/" });
    } else {
      this.setState({
        provider: location.state.provider,
        api_id: location.state.api_id,
        answer: location.state.answer,
        survey_result: location.state.survey_result,
      });
    }
    //console.log(location.state.survey_result)
  }

  handleChange = (event) => {
    this.setState({
      gender: event.target.value,
    });
  };

  changeAge = (res) => {
    if (res !== this.state.age) {
      this.setState({
        age: res,
      });
    }
  };

  changeNickname = (res) => {
    // 글자수가 모자르면
    if (res.target.value.length < 3) {
      this.setState({
        nickname: res.target.value,
      });
    }
    // 글자수가 초과지 않을때만
    else if (res.target.value.length <= 10) {
      // 여기에서 닉네임 중복 체크하기
      this.checkNickname(res.target.value);
      this.setState({
        nickname: res.target.value,
      });
    }
  };

  // 있는 닉네임인지 확인
  checkNickname = (res) => {
    //axios 호출
    axios({
      method: "get",
      url: `${process.env.REACT_APP_URL}/user/dup_check/${res}`,
    })
      .then((res) => {
        // 닉네임 없는 거면
        if (res.data === "NO") {
          this.setState({
            isnicknameVaild: true,
          });
        }
        // 있는 거면
        else {
          this.setState({
            isnicknameVaild: false,
          });
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  clickSignup = () => {
    const { history } = this.props;

    // 3자 이상 입력됐을 때만
    if (this.state.nickname.length < 3) {
      alert("닉네임은 3자 이상 입력해주세요");
    }

    // 중복된 닉네임이 아닐때만
    else if (!this.state.isnicknameVaild) {
      alert("중복된 닉네임입니다");
    }
    // 회원가입 axios 호출
    else {
      // axios 호출로 보내주기
      axios({
        method: "post",
        url: `${process.env.REACT_APP_URL}/user`,
        data: {
          provider: this.state.provider,
          nickname: this.state.nickname,
          age: this.state.age,
          gender: this.state.gender,
          api_id: this.state.api_id,
          survey_array: this.state.answer.join(""),
          survey_result: this.state.survey_result,
        },
      })
        .then((res) => {
          //console.log(res);
          alert("회원가입이 완료되었습니다");
          history.push("/login");
        })
        .catch((error) => {
          //console.log(error);
        });
    }
  };

  // 회원 가입 취소 버튼
  confirm = () => {
    if (window.confirm("회원가입을 종료하시겠습니까? 입력한 내용이 모두 사라집니다.")) {
      this.props.history.push("/");
    }
  };

  render() {
    const { isnicknameVaild } = this.state;

    return (
      <div className="SignupDetail">
        <AuthTemplate>
          <div className="main_letter">추가 정보 입력</div>
          <input
            className={isnicknameVaild | (this.state.nickname.length < 3) ? "input_nickname" : "input_nickname_duplicate"}
            placeholder="닉네임을 입력해주세요 (3~10자)"
            value={this.state.nickname}
            onChange={this.changeNickname}
          ></input>

          {isnicknameVaild | (this.state.nickname.length < 3) ? "" : <p className="nickname_check">중복된 닉네임입니다</p>}

          <div className="div_age">나이 : {this.state.age}</div>
          <div className="age_slider">
            <AgeSlider changeAge={this.changeAge}></AgeSlider>
          </div>

          <FormControl component="fieldset">
            <RadioGroup aria-label="gender" name="gender1" value={this.state.gender} onChange={this.handleChange}>
              <FormControlLabel value="여자" control={<Radio />} label="여자" />
              <FormControlLabel value="남자" control={<Radio />} label="남자" />
            </RadioGroup>
          </FormControl>

          <div className="bnt_bundle">
            <div className="link_btn" onClick={this.clickSignup}>
              완료
            </div>
            <div className="link_gab"></div>
            <div className="link_btn" onClick={this.confirm}>
              취소
            </div>
          </div>
        </AuthTemplate>
      </div>
    );
  }
}

export default SignupDetail;
