import React from "react";
import "./Liked.scss";
import axios from "axios";

import { withRouter } from "react-router-dom";
import { SearchContext } from "../../contexts/search";

const Emoji = (props) => (
  <span id="liked" className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
    {props.symbol}
  </span>
);

class Liked extends React.Component {
  static contextType = SearchContext;

  constructor(props) {
    super(props);
    this.state = {
      check: 0,
      store: 0,
    };
  }

  componentDidMount() {
    this.setState({
      check: this.props.like,
      store: this.props.store,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.store === undefined && this.props.store !== prevProps.store) {
      this.setState({
        check: this.props.like,
        store: this.props.store,
      });
    }
  }

  user = JSON.parse(window.sessionStorage.getItem("user"));

  clickItem = (res) => {
    // 로그인 체크
    if (this.user) {
      if (res.target.id === "liked") {
        // 클릭 했으면 반대로
        let check = 0;
        if (this.state.check === 0) {
          check = 1;
        } else check = 0;

        // axios 호출
        axios({
          method: "get",
          url: `${process.env.REACT_APP_URL}/store/like/${this.state.store}/${this.user.id}`,
        })
          .then((res) => {
            // 뒤로 가기 했을 때 값 변경 되도록 처리
            this.context.actions.editlike(this.state.store);
            this.setState({
              check: check,
            });
          })
          .catch((error) => {
            //console.log(error);
            if (check === 1) alert("즐겨찾기 등록에 실패했습니다.");
            else alert("즐겨찾기 취소에 실패했습니다.");
          });
      }
    }
    // 로그인을 안했으면
    else {
      if (window.confirm("로그인을 해야 사용 가능한 기능입니다.\n로그인하시겠습니까?")) {
        this.props.history.push("/login");
      }
    }
  };

  render() {
    return (
      <div id="liked" className="Liked" onClick={this.clickItem}>
        {this.state.check === 1 ? (
          <div id="liked" className="liked">
            <Emoji id="liked" label="luv" symbol="❤️" />
          </div>
        ) : (
          <div id="liked" className="liked">
            <Emoji id="liked" label="luv" symbol="💙" />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Liked);
