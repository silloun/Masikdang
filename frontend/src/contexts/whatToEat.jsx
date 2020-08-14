import React, { Component, createContext } from "react";
import createUseConsumer from "../libs/createUseConsumer";

const WhatToEatContext = createContext();

const { Provider } = WhatToEatContext;

class WhatToEatProvider extends Component {
  state = {
    windex: 0,
    wquestion: ["누구와 먹나요?", "어디서 먹나요?", "어떤 음식이 당기나요?", "매운 음식 좋아하나요?", "국물이 생각나나요?", "술 마실까요?"],
    woptions: [
      ["혼밥 예정이에요", "둘이서 먹어요", "여럿이 먹어요"],
      ["", ""],
      ["육식! 소고기, 돼지고기, 닭고기!", "깔끔하게 해산물, 야채!"],
      ["네, 매운거 먹을래요", "오늘은 안매운거 먹을래요"],
      ["따끈한 국물 먹고 싶네요", "국물 없는걸로 부탁해요"],
      ["술 한잔할 거예요", "지금은 술 안 마셔요"],
    ],
    wanswer: [],
  };

  actions = {
    wreset: () => {
      this.setState(() => ({ windex: 0, wanswer: [] }));
    },
    wincrement: () => {
      this.setState(({ windex }) => ({ windex: windex + 1 }));
    },
    wdecrement: () => {
      this.setState(({ windex }) => ({ windex: windex - 1 }));
    },
    wadd: (select) => {
      this.setState(({ wanswer }) => ({ wanswer: wanswer.concat(select) }));
    },
    wedit: (select) => {
      this.setState(({ wanswer, windex }) => ({ wanswer: wanswer.map((item, idx) => (idx === windex ? select : item)) }));
    },
  };

  render() {
    const { state, actions } = this;
    const value = { state, actions };

    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

const { Consumer: WhatToEatConsumer } = WhatToEatContext;
const useWhatToEat = createUseConsumer(WhatToEatConsumer);

export { WhatToEatProvider, WhatToEatConsumer, useWhatToEat, WhatToEatContext };
