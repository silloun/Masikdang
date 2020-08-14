import React from "react";
import "./About.scss";

import AppBar from "../common/AppBar";
import Header from "../common/Header";
import ScrollToTop from "../common/ScrollToTop";
import Intro from "../home/Intro";
import Feature from "../home/Feature";
import TopButton from "../common/TopButton";

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check: false,
    };
  }

  onClickBig = () => {
    this.setState({
      check: !this.state.check,
    });
  };

  features = [
    {
      title: "Survey",
      subtitle: "마식는 테스트",
      id: "bigdata",
      algorithm: "Item based filtering, Collaborative Filtering",
      content: "특이값 분해를 통해 이 타입의 유저들이 좋게 평가한 식당들을 추천합니다.\n여행 컨셉의 Test로 흥미을 유발해 사용자의 참여를 독려합니다.",
      path: "/surveyStart",
    },
    {
      title: "Survey",
      subtitle: "오늘 뭐 먹지",
      id: "no",
      algorithm: "",
      content: "사용자들이 선택한 정보를 바탕으로, 타입에 맞는 음식을 추천합니다.\n사용자가 더보기 버튼을 클릭하면 해당하는 음식점을 결과를 확인할 수 있습니다.",
      path: "/whatToEatStart",
    },
    {
      title: "Type",
      subtitle: "내 타입의 맛집",
      id: "bigdata",
      algorithm: "Matrix factorization, Collaborative Filtering",
      content: "유저의 평점과 타입의 유저들의 평점을 통계 내어 식당들을 추천합니다.",
      path: "/home",
    },
    {
      title: "Bookmark",
      subtitle: "즐겨찾기",
      id: "no",
      algorithm: "",
      content: "유저들이 원하는 식당을 즐겨찾기 해놓는 기능으로, 내 근처의 즐겨찾기한 식당을 간편하게 지도로 확인할 수 있습니다.",
      path: "/home",
    },
    {
      title: "Search",
      subtitle: "검색",
      id: "no",
      algorithm: "",
      content:
        "전체, 식당명, 지역, 카테고리 기준으로 4가지 필터를 제공합니다.\n뒤로 가기시 검색했던 값을 가지고 있어 새로 값을 받아오지 않아도 되고, 무한스크롤링을 구현해 원하는 정보를 빠르고 편리하게 확인할 수 있습니다.",
      path: "/search",
    },
    {
      title: "Detail",
      subtitle: "식당 정보",
      id: "no",
      algorithm: "",
      content: "식당의 이름, 메뉴, 태그, 평점, 영업 시간, 전화번호 리뷰, 주소, 위치 정보 등의 다양한 정보를 제공합니다.",
      path: "/search/2231",
    },
    {
      title: "Detail",
      subtitle: "추천 - 리뷰",
      id: "bigdata",
      algorithm: "Item based filtering, Collaborative Filtering",
      content: "이 식당을 평가한 사용자들의 데이터를 분석하여 비슷한 식당을 추천합니다.",
      path: "/search/550",
    },
    {
      title: "Detail",
      subtitle: "추천 - 카테고리",
      id: "bigdata",
      algorithm: "Content based filtering",
      content: "이 식당의 카테고리를 분석하여 비슷한 카테고리의 식당들을 추천",
      path: "/search/550",
    },
    {
      title: "Review",
      subtitle: "리뷰",
      id: "no",
      algorithm: "",
      content: "4가지의 식당 평가와 내용을 작성하고 여러 장의 사진을 올릴 수 있습니다.\n또한, 수정 및 삭제 전체보기도 가능합니다.\n원할때 더보기 버튼을 클릭해서 리뷰를 추가로 확인할 수 있습니다.",
      path: "/search/841",
    },
    {
      title: "Map",
      subtitle: "지도",
      id: "no",
      algorithm: "",
      content:
        "현재 위치를 받아와 주변의 평가가 좋은 식당을 추천해줍니다.\n클릭을 해서 현재 위치를 변경할 수도 있으며, Zoom 기능을 활용해 받아오는 식당 정보의 범위를 변경할 수 있습니다.\n마커를 클릭하면 해당하는 식당 정보 설명 부분으로 스크롤이 이동합니다.",
      path: "/map",
    },
    {
      title: "MyPage",
      subtitle: "마이페이지",
      id: "no",
      algorithm: "",
      content: "즐겨찾기한 식당과 작성한 리뷰를 한번에 확인할 수 있습니다.\n또한, 회원정보 확인 및 프로필 변경 기능을 제공합니다.",
      path: "/mypage",
    },
    {
      title: "User",
      subtitle: "로그인, 회원가입",
      id: "no",
      algorithm: "",
      content: "구글, 카카오 간편 로그인 기능을 제공합니다.\n마식는 테스트 후 간단한 정보만 입력하면 편리하게 로그인하여 마식당의 다양한 서비스를 이용할 수 있습니다.",
      path: "/login",
    },
    {
      title: "송다은",
      subtitle: "FRONTEND",
      id: "person",
      algorithm: "팀의 귀여운 막내 담당",
      content: "저는 팀원들이 열심히 해서 어쩔 수 없이 열심히 했습니다... 9~24시 (27시?) 실화...?ヽ(°〇°)ﾉ\n완성도높은 프로젝트를 만들어서 너무 뿌듯하고, 1등도 하고 싶습니다.",
      path: "",
    },
    {
      title: "신상엽",
      subtitle: "BACKEND",
      id: "person",
      algorithm: "알고리즘은 모두 내 손에서",
      content: "빅데이터는 처음 접하지만 알고리즘은 역시 재밌는 것 같습니다.\n많은 것을 배울 수 있었고 재밌는 경험을 해볼 수 있는 프로젝트였습니다.\n감사합니다. ٩(๑･ิᴗ･ิ)۶٩(･ิᴗ･ิ๑)۶",
      path: "",
    },
    {
      title: "조서원",
      subtitle: "FRONTEND",
      id: "person",
      algorithm: "서원이 없으면 서운해",
      content: "처음 재택 환경에서 프로젝트를 진행하느라 낯설었지만 매일 줌에서 팀원들을 만날 수 있어 좋은 결과물을 완성할 수 있었다고 생각합니다!\n다들 끝까지 열심해줘서 고마워!! (◕ᴗ◕✿)",
      path: "",
    },
    {
      title: "한기연",
      subtitle: "BACKEND",
      id: "person",
      algorithm: "말만해 다해줄게 >-<",
      content: "음... 파이썬을 처음 사용해 미숙한 부분이 많았지만 좋은 팀원들이 있어 기획했던 의도대로 웹사이트가 잘 마무리 된것 같아 기분이 좋습니다. (o^-')b",
      path: "",
    },
    {
      title: "황정호",
      subtitle: "BACKEND",
      id: "person",
      algorithm: "말만해 아니 그냥 말만해",
      content:
        "코로나 때문에 힘든점이 이만저만이 아니었지만 끈끈한 팀워크로 극뽁 할 수 있었습니다.\n힘든 만큼 좋은 프로젝트가 나온것 같습니다.\n모든 영광을 우리 팀원들에게 바치겠습니다.  _( ͡° ͜ʖ ͡°)_/¯",
      path: "",
    },
  ];

  render() {
    return (
      <div className="Box">
        <Header></Header>
        <ScrollToTop></ScrollToTop>
        <TopButton></TopButton>
        <div className="About">
          <Intro onClickBig={this.onClickBig}></Intro>
          {this.features.map((feature, index) => (
            <div key={index}>{this.state.check ? feature.id === "bigdata" && <Feature feature={feature} /> : <Feature feature={feature} />}</div>
          ))}
        </div>
        <AppBar></AppBar>
      </div>
    );
  }
}

export default About;
