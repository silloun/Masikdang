import React from "react";
import "./Search.scss";
import axios from "axios";

import Card from "../common/Card";
import AppBar from "../common/AppBar";
import Header from "../common/Header";
import HeaderSearch from "../common/HeaderSearch";
import Loading from "../common/Loading";
import TopButton from "../common/TopButton";

import { SearchContext } from "../../contexts/search";

const Emoji = (props) => (
  <span className="emoji" role="img" aria-label={props.label ? props.label : ""} aria-hidden={props.label ? "false" : "true"}>
    {props.symbol}
  </span>
);

class Search extends React.Component {
  static contextType = SearchContext;

  constructor(props) {
    super(props);
    this.state = {
      word: "",
      subject: "name",
      stores: [],
      store_len: -1, // 로딩 표시 해주기 위해서
      page: 1,
      maxPage: 1,
      num_store: 0,
    };
  }

  // 무한 스크롤링 구현
  infiniteScroll = () => {
    const { innerHeight } = window;
    const { scrollHeight } = document.body;
    // IE에서는 document.documentElement 를 사용.
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    // 스크롤링 했을때, 브라우저의 가장 밑에서 100정도 높이가 남았을때에 실행하기위함.
    if (scrollHeight - innerHeight - scrollTop < 200 && this.state.store_len >= 0 && this.state.page < this.state.maxPage) {
      // axios loading 체크
      this.setState({ store_len: -2 });
      this.getStores(this.state.page + 1);
      this.setState({ page: this.state.page + 1 });
    }
  };

  // 처음에 입력값 기준으로 값 받아오기
  componentDidMount() {
    // 무한 스크롤링
    window.addEventListener("scroll", this.infiniteScroll);

    // axios loading 체크
    this.setState({ store_len: -1 });

    // 뒤로 가기면 안부르기
    var store = this.context.state.store;
    if (store.length === 0) {
      window.scrollTo(0, 0);
      this.getStores(1);
    } else {
      this.setState({
        stores: store,
        store_len: store.length,
        word: this.context.state.word,
        subject: this.context.state.subject,
        page: store.length / 20 + 1,
        maxPage: this.context.state.maxlength / 20 + 1,
        num_store: this.context.state.maxlength,
      });
    }
  }

  componentWillUnmount() {
    // 언마운트 될때에, 스크롤링 이벤트 제거
    window.removeEventListener("scroll", this.infiniteScroll);
  }

  // 값 바겼을 때 체크
  componentDidUpdate() {
    // 입력된 값이 바겼을 때만
    if (this.state.word !== this.context.state.word || (this.context.state.word !== "" && this.state.subject !== this.context.state.subject)) {
      this.setState({
        store_len: -1,
        page: 1,
        maxPage: 1,
      });
      this.getStores(1);
    }
  }

  user = JSON.parse(window.sessionStorage.getItem("user"));

  // 새로운 식당 정보 받아오기
  getStores = (e) => {
    var word = this.context.state.word;
    var subject = this.context.state.subject;

    this.setState({
      word: word,
      subject: subject,
    });

    // 입력 값이 없을 때의 초기 값
    if (word === "") {
      word = "역삼";
      subject = "area";
    }

    let id = "";
    if (this.user) id = this.user.id;
    //axios 호출
    axios({
      method: "get",
      url: `${process.env.REACT_APP_URL}/store/search/${subject}/${word}?user_id=${id}&page=${e}`,
    })
      // 받아온 store 정보
      .then((res) => {
        //console.log(res);
        this.context.actions.getmaxlength(res.data.num_store);
        if (e === 1) {
          this.context.actions.getstore(res.data.data);
          this.setState({
            stores: res.data.data,
            store_len: res.data.num_page,
            maxPage: res.data.num_page,
            num_store: res.data.num_store,
          });
        } else {
          this.context.actions.getstore(this.state.stores.concat(res.data.data));
          this.setState({
            stores: this.state.stores.concat(res.data.data),
            store_len: res.data.num_page,
            maxPage: res.data.num_page,
            num_store: res.data.num_store,
          });
        }
      })
      .catch((error) => {
        //console.log(error);
        this.setState({
          store_len: 0,
        });
        alert("현재 식당정보를 받아오지 못하고 있습니다.\n잠시 뒤 다시 시도해주세요");
      });
  };

  render() {
    return (
      <div className="Box">
        <Header></Header>
        <HeaderSearch></HeaderSearch>
        <TopButton />
        <div className="Search">
          {this.state.store_len === -1 ? (
            // 로딩 표시
            <div className="store_len">
              <Loading></Loading>
            </div>
          ) : (
            <>
              {this.state.num_store === 0 ? (
                <div className="store_len">
                  <Emoji label="sad" symbol="😥" />
                  <span> 검색된 식당이 없습니다.</span>
                </div>
              ) : (
                <>
                  <div className="store_len">
                    <Emoji label="search" symbol="🏠" />
                    &nbsp;
                    <span className="store_num">{this.state.num_store}</span> 개의 식당이 검색되었습니다.
                  </div>
                  {this.state.stores.map((store, index) => (
                    <div className="card_item" key={index}>
                      <Card store={store}></Card>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
        <AppBar></AppBar>
      </div>
    );
  }
}

export default Search;

//https://velog.io/@killi8n/Dnote-6-1.-React-%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4%EB%A7%81-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84.-79jmep7xes
