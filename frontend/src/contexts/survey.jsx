import React, { Component, createContext } from "react";
import createUseConsumer from "../libs/createUseConsumer";

const SurveyContext = createContext();

const { Provider } = SurveyContext;

class SurveyProvider extends Component {
  state = {
    index: 0,
    question: [
      "누구와 여행 갈까요?",
      "장소는 어디가 좋을까요?",
      "몇 시부터 움직일까요?",
      "이동 수단은 어떡할까요?",
      "여행 첫 날, \n 어디를 먼저 가볼까요?",
      "그 지역 술에 대해 \n 파악하고 가나요?",
      "맛집이 동선이랑 \n 좀 떨어질 것 같은데..",
      "사진 잘 나오는 코스는 필수?!",
      "입장 대기 시간이 \n 긴 관광지는 어떡할까요?",
    ],
    options: [
      ['"혼자"만의 시간이 필요해', '마음맞는 "친구"랑 가고싶어', '"연인"이랑 가는게 최고지', '"가족"이랑 추억 쌓을래'],
      [
        '"국내"에 숨겨진 명소가 많아!!',
        '"유럽이나 미국" 정도는 가줘야지~',
        '대륙 클라쓰 느끼러 "중국" 가볼까?',
        '부담없고 가까운 "일본"?',
        '가까우면서 물가도 저렴한 "동남아"!',
        '"집" 근처, 당일치기로 다녀올래',
      ],
      ["부지런히 아침부터!", "쉬엄쉬엄 다니자"],
      ["오래 걸려도 저렴한게 낫지", "비싸도 빠른 이동!"],
      ["사람이 많은 도심 탐험", "뻥 뚫려 시원한 바다", "하늘을 나는 기분! 패러글라이딩", "녹음이 우거진 숲길", "어디던 발 닿는대로~"],
      ["지역별 술 마셔보는거 좋아!", "굳이..? 술 안좋아함"],
      ["맛있으면 시간내서 먹으러 갈래", "거기 말고도 맛있는 데는 많아~"],
      ["완전 필수! 남는건 사진뿐!", "꼭 멋질 필욘 없어, 의미가 더 중요해"],
      ["그만큼 유명하다는거니까 꼭 가보자", "기다리다 지쳐.. 다른데 알아볼래"],
    ],
    meaning: [
      ["혼자", "친구와", "연인과", "가족과"],
      ["한식", "양식", "중식", "일식", "동남아 음식", "분식"],
      ["오전", "오후"],
      ["가성비", "가심비"],
      ["육류", "해산물", "닭, 오리", "채소", "모든"],
      ["음주를 즐기", "음주를 즐기지 않"],
      ["맛집이 있다면 멀리도 가", "일부러 멀리까지 가지 않으"],
      ["비주얼", "비주얼보다는 맛"],
      ["웨이팅도 거리끼지 않는", "굳이 웨이팅은 하지 않는"],
    ],
    answer: [],
    survey_result: "",
  };

  actions = {
    reset: () => {
      this.setState(() => ({ index: 0, answer: [] }));
    },
    increment: () => {
      this.setState(({ index }) => ({ index: index + 1 }));
    },
    decrement: () => {
      this.setState(({ index }) => ({ index: index - 1 }));
    },
    add: (select) => {
      this.setState(({ answer }) => ({ answer: answer.concat(select) }));
    },
    edit: (select) => {
      this.setState(({ answer, index }) => ({ answer: answer.map((item, idx) => (idx === index ? select : item)) }));
    },
    surveyResult: (result) => {
      this.setState(() => ({ survey_result: result }));
    },
  };

  render() {
    const { state, actions } = this;
    const value = { state, actions };

    return <Provider value={value}>{this.props.children}</Provider>;
  }
}

const { Consumer: SurveyConsumer } = SurveyContext;
const useSurvey = createUseConsumer(SurveyConsumer);

export { SurveyProvider, SurveyConsumer, useSurvey, SurveyContext };
