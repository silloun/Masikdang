import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AppBar from "../common/AppBar";
import Header from "../common/Header";
import store_img from "../../img/store.png";
import "./MypageMore.scss";

const MypageMore = (props) => {
  const Emoji = (props) => (
    <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
      {props.symbol}
    </span>
  );

  const [list, setList] = useState([]);
  const [path, setPath] = useState("");
  let history = useHistory();

  useEffect(() => {
    setPath(props.location.pathname);

    if (window.sessionStorage.getItem("user")) {
      let user = JSON.parse(window.sessionStorage.getItem("user"));

      // 즐겨찾기 목록 가져오기
      if (path === "/mypage/favorite") {
        axios({
          method: "get",
          url: `${process.env.REACT_APP_URL}/user/like_list/${user.id}`,
        })
          .then((res) => {
            //console.log(res.data);
            setList(res.data);
          })
          .catch((error) => {
            //console.log(error);
          });
      }

      // 리뷰 목록 가져오기
      else if (path === "/mypage/review") {
        axios({
          method: "get",
          url: `${process.env.REACT_APP_URL}/review/user/${user.id}`,
        })
          .then((res) => {
            //console.log(res.data);
            setList(res.data);
          })
          .catch((error) => {
            //console.log(error);
          });
      }
    } else {
      history.push(`/mypage`);
    }
  }, [history, path, props.location.pathname]);

  const go = (val) => {
    history.push("/search/" + val);
  };

  return (
    <div className="Box">
      <Header />
      <div className="MyPageMore">
        {path === "/mypage/favorite" && (
          <>
            <div className="title">
              <Emoji label="like" symbol="❤️" /> 즐겨찾기 목록
            </div>
            <div className="fcontent">
              {list.length === 0 ? (
                <div className="empty">즐겨찾기한 식당이 없습니다.</div>
              ) : (
                list.map((store, idx) => (
                  <div
                    className="fbox"
                    onClick={function () {
                      go(store.id);
                    }}
                    key={idx}
                  >
                    <div className="imgBox">{store.img !== null ? <img src={store.img} alt="store" /> : <img src={store_img} alt="store" />}</div>
                    <div className="storeName">{store.store_name}</div>
                    <div className="storeArea">{store.area !== null ? store.area : "-"}</div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        {path === "/mypage/review" && (
          <>
            <div className="title">
              <Emoji label="star" symbol="📝" /> 리뷰 목록
            </div>
            <div className="rcontent">
              {list.length === 0 ? (
                <div className="empty">리뷰를 작성한 식당이 없습니다.</div>
              ) : (
                list.map((store, idx) => (
                  <div
                    className="rbox"
                    onClick={function () {
                      go(store.store);
                    }}
                    key={idx}
                  >
                    <div className="rtop">
                      <div className="storeName">{store.store_name}</div>
                      <div className="totalScore">
                        <Emoji label="star" symbol="⭐️" />
                        {store.total_score}
                      </div>
                      <div className="detailScore">
                        맛 {store.taste_score} &nbsp;가격 {store.price_score} &nbsp;서비스 {store.service_score}
                      </div>
                    </div>
                    <div className="rbottom">{store.content}</div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
      <AppBar />
    </div>
  );
};

export default MypageMore;
