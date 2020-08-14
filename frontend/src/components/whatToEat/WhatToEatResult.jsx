import React from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { SearchContext } from "../../contexts/search";
import Loading from "../map/Loading";
import "./WhatToEat.scss";

const Emoji = (props) => (
  <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
    {props.symbol}
  </span>
);

class WhatToEatResult extends React.Component {
  static contextType = SearchContext;

  constructor(props) {
    super(props);

    this.state = {
      login: false,
      select: this.props.location.state,
      menu: [],
      location: "",
      loading: false,
    };
  }

  componentDidMount() {
    //console.log(this.state.select);
    let result = this.state.select.join("");
    let word = result.slice(-4);
    this.setState({ location: this.state.select[1], loading: true });

    axios({
      method: "get",
      url: `${process.env.REACT_APP_URL}/survey/search`,
      params: {
        data: word,
      },
    })
      .then((res) => {
        this.setState({ menu: res.data, loading: false });
        // //console.log(this.state.menu);
      })
      .catch((error) => {
        //console.log(error);
      });

    if (window.sessionStorage.getItem("user")) {
      this.setState({ login: true });
    }
  }

  search = (val) => {
    // //console.log(val.target.id);
    const { history } = this.props;
    let search = this.state.location + " " + val.target.id;
    // //console.log(search);
    this.context.actions.resetstore();
    this.context.actions.changesubject("total");
    this.context.actions.changeword(search);
    history.push("/search");
  };

  render() {
    return (
      <div className="WhatToEatResultComponent">
        <div className="top">오늘 뭐먹지? 선택 결과</div>
        <div className="mentionBox">
          <div className="mentionTop">오늘의 추천 메뉴는 </div>
          <div className="select">
            {this.state.loading ? (
              <Loading></Loading>
            ) : (
              <>
                {this.state.menu.map((m, idx) => (
                  <div className="menu" key={idx} id={m} onClick={this.search}>
                    {m}
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="mentionBottom">입니다.</div>
        </div>

        <div className="mentionBox">
          <div className="mention">
            <Emoji label="yum" symbol="🤤" />
            <u>먹고 싶은 메뉴</u>를 선택하면
          </div>
          <div className="mention">
            맛있는 <Emoji label="yum" symbol="🍝" />
            <u>
              <NavLink className="home" to={`/home`}>
                마식당
              </NavLink>
            </u>
            을 추천해드려요!
          </div>
        </div>

        <NavLink className="retryBtn" to={`/whatToEat`}>
          다시 검색하기
        </NavLink>
        {/* 로그인 하지 않았으면 */}
        {!this.state.login && (
          <div className="memberBox">
            <NavLink className="memberBtn" to="/signup">
              회원가입
            </NavLink>
            <NavLink className="memberBtn" to="/login">
              로그인
            </NavLink>
          </div>
        )}
      </div>
    );
  }
}

export default WhatToEatResult;
