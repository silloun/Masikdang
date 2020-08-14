import React from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import store_img from "../../img/store.png";
import Loading from "../map/Loading";
import "./Recommend.scss";
import CarouselSlider from "../common/CarouselSlider";

class Recommend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: [],
      login: false,
      loading: false,
    };
  }

  componentDidMount() {
    let user = "";
    let type = "";

    if (window.sessionStorage.getItem("user")) {
      this.setState({ login: true, loading: true });
      user = JSON.parse(window.sessionStorage.getItem("user"));
      let typeArr = user.survey_result.split(" ");
      if (typeArr[typeArr.length - 1] === "터키") {
        type = "로스티드%20터키";
      } else type = typeArr[typeArr.length - 1];

      axios({
        method: "get",
        url: `${process.env.REACT_APP_URL}/filter/type`,
        params: {
          type: type,
          user: user.id,
        },
      })
        .then((res) => {
          //console.log(res.data);

          let storeInfo = [];
          for (var i = 0; i < res.data.store_id.length; i++) {
            var store = {};
            store.id = res.data.store_id[i];
            store.store_name = res.data.store_name[i];
            if (res.data.store_img[i] !== null) store.img = res.data.store_img[i];
            else store.img = store_img;
            store.area = res.data.store_area[i];
            storeInfo[i] = store;
          }

          this.setState({ info: storeInfo, loading: false });
        })
        .catch((error) => {
          //console.log(error);
        });
    }
  }

  render() {
    return (
      <div className="Recommend">
        {this.state.login ? (
          this.state.loading ? (
            <Loading></Loading>
          ) : (
            <CarouselSlider similar={this.state.info}></CarouselSlider>
          )
        ) : (
          !this.state.login && (
            <div className="needLogin">
              <div className="mention">로그인 후 서비스를 이용해보세요!</div>
              <br />
              <div className="memberBox">
                <NavLink className="joinBtn" to="/signup">
                  회원가입
                </NavLink>
                <NavLink className="loginBtn" to="/login">
                  로그인
                </NavLink>
              </div>
            </div>
          )
        )}
      </div>
    );
  }
}

export default Recommend;
