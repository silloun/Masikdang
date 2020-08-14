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

class Write extends React.Component {
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
      images: [],
      base64: [],
      filekey: 0,
    };
  }

  // componentDidMount, componentDidUpdate
  componentDidMount() {
    // 로그인 안했으면
    if (!this.user) {
      alert("로그인 후 이용해 주세요");
      // 뒤로가기
      this.props.history.goBack();
    }
    // 식당 통해서 안왔으면
    else if (this.props.location.params === undefined) {
      alert("평가할 식당 정보가 없습니다.");
      this.props.history.goBack();
    }
    // 조건 충족하면 state 적용
    else {
      this.setState({
        store: this.props.location.params.storeNo,
        user: this.user.id,
        user_nickname: this.user.nickname,
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

  // 이미지 변경 함수
  InputChange = (res) => {
    this.setState({
      filekey: this.state.filekey + 1,
    });

    let number = res.target.files?.length;
    let now = this.state.images.length;
    // 파일 업로드 하기
    if (number !== undefined && number !== 0) {
      // 파일 업로드 수 제한 하기
      if (number + now > 4) {
        alert("파일은 최대 4개까지 업로드 가능합니다.");
      }
      //이미지 파일 기존배열에 추가해주기
      else {
        var image = this.state.images;
        for (var i = 0; i < number; i++) {
          let file = res.target.files[i];
          image = image.concat(file);
        }

        this.setState({
          images: image,
        });

        //이미지 변경 함수 호출
        for (var j = this.state.images.length; j < image.length; j++) this.ChangeImage(image[j]);
      }
    }
  };

  //이미지 변경됐을 때 프리뷰
  ChangeImage = (e) => {
    let reader = new FileReader();
    reader.onloadend = (e) => {
      // 2. 읽기가 완료되면 아래코드가 실행
      const base64 = reader.result; //reader.result는 이미지를 인코딩(base64 ->이미지를 text인코딩)한 결괏값이 나온다.
      if (base64) {
        this.setState({
          base64: [...this.state.base64, base64.toString()], // 파일 base64 상태 업데이트
        });
      }
    };
    if (e) {
      reader.readAsDataURL(e); // 1. 파일을 읽어 버퍼에 저장합니다. 저장후 onloadend 트리거
    }
  };

  //이미지 삭제하기
  RemoveImg = (e) => {
    let forward = this.state.images.slice(0, e.target.id);
    let back = this.state.images.slice(Number(e.target.id) + 1, this.state.base64.length);

    let forward64 = this.state.base64.slice(0, e.target.id);
    let back64 = this.state.base64.slice(Number(e.target.id) + 1, this.state.base64.length);

    this.setState({
      images: forward.concat(back),
      base64: forward64.concat(back64),
    });
  };

  // 리뷰 취소 버튼
  confirm = () => {
    if (window.confirm("리뷰 작성을 취소하시겠습니까?\n입력한 내용은 모두 사라집니다.")) {
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
        method: "post",
        url: `${process.env.REACT_APP_URL}/review`,
        data: {
          store: this.state.store,
          user: this.state.user,
          user_nickname: this.state.user_nickname,
          total_score: this.state.total_score,
          taste_score: this.state.taste_score,
          price_score: this.state.price_score,
          service_score: this.state.service_score,
          content: this.state.content,
        },
      })
        .then((res) => {
          if (this.state.images.length !== 0) {
            let path = new FormData();
            for (let i = 0; i < this.state.images.length; i++) {
              path.append("path", this.state.images[i]);
            }
            axios({
              method: "post",
              url: `${process.env.REACT_APP_URL}/upload/${res.data.id}`,
              headers: { "content-type": "multipart/form-data" },
              data: path,
            })
              .then((res) => {
                this.props.history.push("/search/" + this.state.store);
                alert("리뷰 작성에 성공했습니다");
              })
              .catch((error) => {
                //console.log(error);
                alert("리뷰 작성에 실패했습니다");
                this.props.history.push("/search/" + this.state.store);
              });
          } else {
            this.props.history.push("/search/" + this.state.store);
          }
        })
        .catch((error) => {
          //console.log(error);
          alert("리뷰 작성에 실패했습니다");
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
            <div className="file_upload">
              <div className="topic">사진첨부</div>
              {/* 사진 업로드 버튼 */}
              <div className="upload_btn">
                <div className="filebox">
                  <label>
                    식당 사진 업로드
                    <input key={this.state.filekey} multiple type="file" name="images" accept="image/gif, image/jpeg, image/png" onChange={this.InputChange} />
                  </label>
                  <div className="write_filenum">
                    <span className="file_num">{this.state.images.length}</span>개 사진 업로드
                  </div>
                </div>
              </div>
              {/* 사진 미리보기 */}
              <div className="review_img_bundle">
                {this.state.base64.map((img, index) => (
                  <div key={index} className="review_img">
                    <div className="thumbnail">
                      <div className="centered">
                        <img className="store_img" alt="store_img" src={img}></img>
                        {/* 이미지 등록 취소 버튼 */}
                        <img alt="삭제" src="https://image.flaticon.com/icons/svg/458/458595.svg" className="X" id={index} onClick={this.RemoveImg}></img>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
export default Write;
