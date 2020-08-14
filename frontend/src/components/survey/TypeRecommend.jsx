import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import store_img from "../../img/store.png";
import Loading from "../map/Loading";
import "./Survey.scss";

const TypeRecommend = (props) => {
  const Emoji = (props) => (
    <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
      {props.symbol}
    </span>
  );

  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios({
      method: "get",
      url: `${process.env.REACT_APP_URL}/filter/type`,
      params: {
        type: props.type,
      },
    })
      .then((res) => {
        //console.log(res.data);

        let storeInfo = [];
        for (var i = 0; i < res.data.store_id.length; i++) {
          var store = {};
          store.store_id = res.data.store_id[i];
          store.store_name = res.data.store_name[i];
          if (res.data.store_img[i] !== null) store.store_img = res.data.store_img[i];
          else store.store_img = store_img;
          store.store_area = res.data.store_area[i];
          storeInfo[i] = store;
        }

        setInfo(storeInfo);
        setLoading(false);
      })
      .catch((error) => {
        //console.log(error);
      });
  }, [props.type]);

  let history = useHistory();
  const go = (val) => {
    history.push("/search/" + val);
  };

  return (
    <>
      <div className="typeTitle">
        <Emoji label="food" symbol="🍛" /> 내 타입이 좋아하는 마식당
      </div>
      <div className="typeBox">
        {loading ? (
          <Loading></Loading>
        ) : (
          <>
            {info.length > 0 &&
              info.map((store, idx) => (
                <div
                  className="type col-6 col-md-4"
                  onClick={function () {
                    go(store.store_id);
                  }}
                  key={idx}
                >
                  <div className="typeImgBox">
                    <img className="typeImg" src={store.store_img} alt="store" />
                  </div>
                  <div className="storeName">{store.store_name}</div>
                </div>
              ))}
          </>
        )}
      </div>
    </>
  );
};

export default TypeRecommend;
