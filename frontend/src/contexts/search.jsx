import React, { Component, createContext } from "react";
import createUseConsumer from "../libs/createUseConsumer";

const SearchContext = createContext();

const { Provider } = SearchContext;

class SearchProvider extends Component {
  state = {
    word: "",
    subject: "total",
    store: [],
    maxlength: 0, // 실제로는
  };

  actions = {
    reset: () => {
      this.setState(() => ({ word: "", subject: "total", store: [] }));
    },
    changeword: (select) => {
      this.setState(() => ({ word: select }));
    },
    changesubject: (select) => {
      this.setState(() => ({ subject: select }));
    },
    getstore: (select) => {
      this.setState(() => ({ store: select }));
    },
    resetstore: () => {
      this.setState(() => ({ store: [] }));
    },
    getmaxlength: (select) => {
      this.setState(() => ({ maxlength: select }));
    },
    // 뒤로 가기 했을 때 값 변경 되도록 처리
    editlike: (select) => {
      const modifiy = this.state.store.map((item) =>
        item.id === select
          ? item.like === 1
            ? { ...item, like: 0 }
            : { ...item, like: 1 }
          : item
      );
      this.setState(() => ({ store: modifiy }));
    },
  };

  render() {
    const { state, actions } = this;
    const value = { state, actions };

    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

const { Consumer: SearchConsumer } = SearchContext;
const useSearch = createUseConsumer(SearchConsumer);

export { SearchProvider, SearchConsumer, useSearch, SearchContext };
