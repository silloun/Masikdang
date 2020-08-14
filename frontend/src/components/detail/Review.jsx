import React from "react";
import "./Review.scss";
import ReadScore from "../detail/ReadScore";
import { withRouter } from "react-router-dom";
import axios from "axios";

// 841번!!
class Review extends React.Component {
  user = JSON.parse(window.sessionStorage.getItem("user"));

  // 리뷰 취소 버튼
  confirm = () => {
    if (window.confirm("리뷰를 삭제하시겠습니까?")) {
      axios({
        method: "delete",
        url: `${process.env.REACT_APP_URL}/review/${this.props.review.id}/`,
      })
        .then((res) => {
          alert("해당 리뷰가 삭제 되었습니다.");
          if (this.props.changeReview) {
            this.props.changeReview();
          }
        })
        .catch((error) => {
          //console.log(error);
        });
    }
  };

  // 리뷰 수정 버튼
  edit = () => {
    const { history } = this.props;
    history.push({
      pathname: "/update",
      params: {
        review: this.props.review,
      },
    });
  };

  // 최대 10개까지만 이미지 보이게 하기
  render() {
    const review = this.props.review;
    return (
      <div className="Review">
        <div className="user_info">
          <img className="profile" alt="profile" src="https://d2x5ku95bkycr3.cloudfront.net/App_Themes/Common/images/profile/0_200.png"></img>
          <span className="user_name">{review.user_nickname}</span>
          <ReadScore score={review.total_score}></ReadScore>
          <span className="tscore">({review.total_score ? review.total_score : "0"})</span>
        </div>
        <div className="score_bundle">
          맛&nbsp;<span>★</span>
          {review.taste_score}
          &nbsp;&nbsp;&nbsp;&nbsp;가격&nbsp;
          <span>★</span>
          {review.price_score}
          &nbsp;&nbsp;&nbsp;&nbsp;서비스&nbsp;
          <span>★</span>
          {review.service_score}
        </div>
        <div className="content">{review.content}</div>
        {/* 리뷰 이미지 들어가는 부분 1:1 */}
        {review.imgs && review.imgs.length > 0 && (
          <div className="review_img_bundle">
            {review.imgs.map((img, index) => (
              <div key={index} className="review_img">
                <div className="thumbnail">
                  <div className="centered">
                    <img
                      className="store_img"
                      alt="store_img"
                      src={img}
                      onClick={() => {
                        window.open(img);
                      }}
                    ></img>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 작성자랑 같은지 확인 user_nickname 으로 비교 */}
        {this.user && this.user.nickname === review.user_nickname ? (
          <>
            <div className="edit_button" onClick={this.confirm}>
              삭제
            </div>
            &nbsp;
            <div className="edit_button" onClick={this.edit}>
              수정
            </div>
            {review.reg_time && <div className="date">{review.reg_time.split("T")[0]}</div>}
          </>
        ) : (
          <>
            {review.reg_time && (
              <>
                <div className="edit_button nbsp">&nbsp;</div>
                <div className="date">{review.reg_time.split("T")[0]}</div>
              </>
            )}
          </>
        )}
      </div>
    );
  }
}

export default withRouter(Review);
