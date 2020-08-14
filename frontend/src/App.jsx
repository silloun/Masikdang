import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { SurveyProvider } from "./contexts/survey";
import { SearchProvider } from "./contexts/search";
import { WhatToEatProvider } from "./contexts/whatToEat";
import { UserProvider } from "./contexts/user";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import Main from "./components/routers/Main";
import Home from "./components/routers/Home";
import Login from "./components/routers/Login";
import Signup from "./components/routers/Signup";
import SignupDetail from "./components/routers/SignupDetail";
import Mypage from "./components/routers/Mypage";
import MypageMore from "./components/routers/MypageMore";
import MypageDetail from "./components/mypage/MypageDetail";
import Search from "./components/routers/Search";
import Map from "./components/routers/Map";
import Surveypage from "./components/routers/Surveypage";
import SurveyStart from "./components/routers/SurveyStart";
import SurveyResult from "./components/survey/SurveyResult";
import WhatToEatpage from "./components/routers/WhatToEatpage";
import WhatToEatStart from "./components/routers/WhatToEatStart";
import WhatToEatResult from "./components/whatToEat/WhatToEatResult";
import Detail from "./components/routers/Detail";
import Write from "./components/routers/Write";
import Update from "./components/routers/Update";
import About from "./components/routers/About";

// Context 갯수가 많아져도 Provider 적용 위해 코드 구조가 깊어질 필요 없음
// context를 props로 전달해주면 됨
const AppProvider = ({ contexts, children }) =>
  contexts.reduce(
    (prev, context) =>
      React.createElement(context, {
        children: prev,
      }),
    children
  );

const App = () => {
  return (
    <AppProvider contexts={[SurveyProvider, SearchProvider, WhatToEatProvider, UserProvider]}>
      <BrowserRouter>
        <Switch>
          {/* 접속 페이지 */}
          <Route path="/" component={Main} exact />
          {/* 마식당 홈페이지 */}
          <Route path="/home" component={Home} />
          {/* 로그인 페이지 */}
          <Route path="/login" component={Login} />
          {/* 회원가입 페이지 */}
          <Route path="/signup" component={Signup} exact />
          {/* 회원정보 추가 입력 페이지 */}
          <Route path="/signup/detail" component={SignupDetail} />
          {/* 회원가입 설문 시작 페이지 */}
          <Route path="/surveyStart" component={SurveyStart} />
          {/* 회원가입 설문 페이지 */}
          <Route path="/survey" component={Surveypage} />
          {/* 회원가입 설문 결과 페이지 */}
          <Route path="/surveyResult" component={SurveyResult} />
          {/* 마이페이지 */}
          <Route path="/mypage" component={Mypage} exact />
          {/* 마이페이지 상세조회 */}
          <Route path="/mypage/detail" component={MypageDetail} exact />
          {/* 즐겨찾기, 리뷰 더보기 리스트 */}
          <Route path="/mypage/:option" component={MypageMore} />
          {/* 검색 페이지 */}
          <Route path="/search" component={Search} exact />
          {/* 가게 상세 페이지 */}
          <Route path="/search/:storeNo" component={Detail} />
          {/* 지도 페이지 */}
          <Route path="/map" component={Map} />
          {/* 오늘 뭐먹지 설문 시작 페이지 */}
          <Route path="/whatToEatStart" component={WhatToEatStart} />
          {/* 오늘 뭐먹지 설문 페이지 */}
          <Route path="/whatToEat" component={WhatToEatpage} />
          {/* 오늘 뭐먹지 설문 결과 페이지 */}
          <Route path="/whatToEatResult" component={WhatToEatResult} />
          {/* 리뷰 / 평가 작성 페이지 */}
          <Route path="/write" component={Write} />
          {/* 리뷰 수정 페이지 */}
          <Route path="/update" component={Update} />
          {/* 홈페이지 설명 페이지 */}
          <Route path="/about" component={About} />
        </Switch>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
