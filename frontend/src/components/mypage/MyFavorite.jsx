import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useUser } from "../../contexts/user";
import "../routers/Mypage.scss";

const MyFavorite = ({ favorite, favoriteCnt }) => {
  const Emoji = (props) => (
    <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
      {props.symbol}
    </span>
  );

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    let user = JSON.parse(window.sessionStorage.getItem("user"));
    // //console.log(user.id);

    axios({
      method: "get",
      url: `${process.env.REACT_APP_URL}/user/like_list/${user.id}`,
    })
      .then((res) => {
        //console.log(res.data);
        favoriteCnt(res.data.length);

        var size = res.data.length > 5 ? 5 : res.data.length;
        var arr = [];
        for (var i = 0; i < size; i++) {
          var store = {};
          store.id = res.data[i].id;
          store.store_name = res.data[i].store_name;
          if (res.data[i].category === null || res.data[i].category === "" || res.data[i].category === undefined) store.category = "-";
          else store.category = res.data[i].category.split("|")[0];
          if (res.data[i].area !== null) store.area = res.data[i].area;
          else store.area = "-";
          arr[i] = store;
        }

        setFavorites(arr);
      })
      .catch((error) => {
        //console.log(error);
      });
  }, [favoriteCnt]);

  return (
    <div className="favoriteBox">
      <div className="favoriteTitle">
        <Emoji label="like" symbol="❤️" /> 최근 즐겨찾기 추가 식당
      </div>
      {favorite > 0 ? (
        <div className="contentBox">
          {favorites.map((f) => (
            <div className="fcontent" key={f.id}>
              <NavLink to={`/search/` + f.id} className="fname">
                {f.store_name}
              </NavLink>
              <div className="fcategory">{f.category}</div>
              <div className="farea">{f.area}</div>
            </div>
          ))}
          {favorite > 5 && (
            <NavLink to={`/mypage/favorite`} className="moreBox">
              <div className="fmore">더보기</div>
            </NavLink>
          )}
        </div>
      ) : (
        <>
          <div className="empty">좋아하는 식당이 없습니다</div>
        </>
      )}
    </div>
  );
};

export default useUser(({ state, actions }) => ({
  favorite: state.favorite,
  favoriteCnt: actions.favoriteCnt,
}))(MyFavorite);
