import React, { Component, createContext } from "react";
import createUseConsumer from "../libs/createUseConsumer";

const UserContext = createContext();

const { Provider } = UserContext;

class UserProvider extends Component {
  state = {
    review: 0,
    favorite: 0,
  };

  actions = {
    reviewCnt: (cnt) => {
      this.setState(() => ({ review: cnt }));
    },
    favoriteCnt: (cnt) => {
      this.setState(() => ({ favorite: cnt }));
    },
  };

  render() {
    const { state, actions } = this;
    const value = { state, actions };

    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

const { Consumer: UserConsumer } = UserContext;
const useUser = createUseConsumer(UserConsumer);

export { UserProvider, UserConsumer, useUser, UserContext };
