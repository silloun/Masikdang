import React from "react";
import "./Write.scss";
import axios from "axios";

import AppBar from "../common/AppBar";
import Header from "../common/Header";
import HeaderSearch from "../common/HeaderSearch";
import ScrollToTop from "../common/ScrollToTop";

import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

const Emoji = (props) => (
  <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
    {props.symbol}
  </span>
);

class Update extends React.Component {
  // user id 값 확인
  user = JSON.parse(window.sessionStorage.getItem("user"));

  constructor(props) {
    super(props);
    this.state = {
      store: 0,
      user: 0,
      user_nickname: "",
      total_score: 3,
      taste_score: 3,
      price_score: 3,
      service_score: 3,
      content: "",
      date: new Date(),
    };
  }

  // componentDidMount, componentDidUpdate
  componentDidMount() {
    //console.log(this.props);
    // 로그인 안했으면
    if (!this.user) {
      alert("로그인 후 이용해 주세요");
      // 뒤로가기
      this.props.history.goBack();
    }
    // 리뷰 통해서 안왔으면
    else if (this.props.location.params === undefined) {
      alert("수정할 리뷰 정보가 없습니다.");
      this.props.history.goBack();
    }
    // 로그인 정보랑 받아온 정보가 다르면
    else if (this.props.location.params.review.user !== this.user.id) {
      alert("작성자가 일치하지 않습니다.");
      this.props.history.goBack();
    }
    // 조건 충족하면 state 적용
    else {
      let review = this.props.location.params.review;
      //console.log(review);
      // null 값인거 default 값으로 수정해서 넣기
      if (review.total_score == null) review.total_score = 3;
      if (review.taste_score == null) review.taste_score = 3;
      if (review.price_score == null) review.price_score = 3;
      if (review.service_score == null) review.service_score = 3;
      this.setState({
        reviewNo: review.id,
        store: review.store,
        user: review.user,
        user_nickname: review.nickname,
        total_score: review.total_score,
        taste_score: review.taste_score,
        price_score: review.price_score,
        service_score: review.service_score,
        content: review.content,
      });
    }
  }

  score_list = [
    ["taste_score", "맛"],
    ["price_score", "가격"],
    ["service_score", "서비스"],
  ];

  select_text = [
    ["", "사줘도안감", "사주면 감", "보통", "가끔 갈 맛", "매일 갈 맛"],
    ["", "창렬하다", "불만족", "보통", "만족", "혜자스럽다"],
    ["", "절대 안 감", "불친절", "보통", "친절함", "Angel👼"],
  ];

  chageValues = (res) => {
    var input = res.target.value;
    if (res.target.name !== "content") {
      input = parseInt(res.target.value);
    }

    this.setState({
      [res.target.name]: input,
    });
  };

  // 리뷰 취소 버튼
  confirm = () => {
    if (window.confirm("리뷰 수정을 취소하시겠습니까?\n입력한 내용은 모두 사라집니다.")) {
      this.props.history.goBack();
    }
  };

  // 리뷰 제출
  reviewSubmit = () => {
    // 제출 조건
    if (this.state.content.length < 10 || this.state.content.length > 3000) {
      alert("최소 10자 이상 3000자 이하로 작성해주세요");
    }
    // axios 호출
    else {
      axios({
        method: "put",
        url: `${process.env.REACT_APP_URL}/review/${this.state.reviewNo}/`,
        data: {
          store: this.state.store,
          user: this.state.user,
          user_nickname: this.state.user_nickname,
          total_score: this.state.total_score,
          taste_score: this.state.taste_score,
          price_score: this.state.price_score,
          service_score: this.state.service_score,
          content: this.state.content,
          reg_time: this.state.date.toLocaleTimeString(),
        },
      })
        .then((res) => {
          //console.log(res);
          this.props.history.push("/search/" + this.state.store);
        })
        .catch((error) => {
          //console.log(error);
          alert("리뷰 수정에 실패했습니다");
        });
    }
  };

  render() {
    return (
      <div className="Box">
        <Header></Header>
        <HeaderSearch></HeaderSearch>
        <ScrollToTop></ScrollToTop>
        <div className="Write">
          <div className="write_explain">
            <div className="smile">
              <Emoji label="sad" symbol="😊" />
            </div>
            <div className="text">
              평가 참여를 통해 결과의 신뢰도를 높여주세요!
              <br />※ 홍보 및 비방 등의 부적절한 평가는 제외될수있습니다.
            </div>
          </div>
          <div className="write_form">
            {/* 전체 평점 표시 */}
            <div className="totla_score">
              <div className="topic">전체 평점</div>
              <div className="total_score_select">
                <Box mb={3} borderColor="transparent">
                  <Rating precision={1} value={this.state.total_score} name="total_score" onChange={this.chageValues} />
                </Box>
              </div>
            </div>
            <hr />
            {/* 항목별 평점 표시 */}
            <div className="detail_score container-fluid">
              <div className="topic">항목별 평점</div>
              {this.score_list.map((score, index) => (
                <div key={index} className="row">
                  <div className="col-1"></div>
                  <div className="col-3">{score[1]}</div>
                  <div className="col-4">
                    <div className="detail_score_select">
                      <Box mb={3} borderColor="transparent">
                        <Rating name={score[0]} precision={1} value={this.state[score[0]]} onChange={this.chageValues} />
                      </Box>
                    </div>
                  </div>
                  <div className="col-1"></div>
                  <div className="col-3 right">{this.select_text[index][this.state[score[0]]]}</div>
                </div>
              ))}
            </div>
            <hr />
            {/* 방문 후기 작성 */}
            <div className="content">
              <div className="topic">방문후기</div>
              <textarea name="content" className="content_box" value={this.state.content} placeholder="최소 10자 이상 작성해 주세요" onChange={this.chageValues}></textarea>
            </div>
            <hr />
            {/* 사진 업로드 */}
            <div className="file_upload">사진은 변경할 수 없습니다</div>
            <hr />
            {/* 클릭 버튼 */}
            <div className="btn_bundle">
              <div className="rbtn complete_btn" onClick={this.reviewSubmit}>
                평가완료
              </div>
              <div className="rbtn cancel" onClick={this.confirm}>
                취소
              </div>
            </div>
          </div>
        </div>
        <AppBar></AppBar>
      </div>
    );
  }
}
export default Update;
