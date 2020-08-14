import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useUser } from "../../contexts/user";
import "../routers/Mypage.scss";

const MyReview = ({ review, reviewCnt }) => {
  const Emoji = (props) => (
    <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
      {props.symbol}
    </span>
  );

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let user = JSON.parse(window.sessionStorage.getItem("user"));
    // //console.log(user.id);
    // 297에 리뷰 많음

    axios({
      method: "get",
      url: `${process.env.REACT_APP_URL}/review/user/${user.id}`,
    })
      .then((res) => {
        // //console.log(res.data);
        reviewCnt(res.data.length);
        res.data.length > 5 ? setReviews(res.data.slice(0, 5)) : setReviews(res.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  }, [reviewCnt]);

  return (
    <div className="reviewBox">
      <div className="reviewTitle">
        <Emoji label="star" symbol="📝" /> 최근 작성 리뷰
      </div>
      {/* {//console.log(reviews)} */}
      {review > 0 ? (
        <div className="contentBox">
          {reviews.map((r) => (
            <div className="content" key={r.id}>
              <NavLink to={`/search/` + r.store} className="name">
                {r.store_name}
              </NavLink>
              <NavLink to={`/search/` + r.store} className="detail">
                {r.content}
              </NavLink>
              <div className="score">
                <Emoji label="star" symbol="⭐️" />
                {r.total_score}
              </div>
            </div>
          ))}
          {review > 5 && (
            <NavLink to={`/mypage/review`} className="moreBox">
              <div className="more">더보기</div>
            </NavLink>
          )}
        </div>
      ) : (
        <div className="empty">작성한 리뷰가 없습니다</div>
      )}
    </div>
  );
};

export default useUser(({ state, actions }) => ({
  review: state.review,
  reviewCnt: actions.reviewCnt,
}))(MyReview);
