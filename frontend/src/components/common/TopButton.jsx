import React from "react";
import "./TopButton.scss";

class TopButton extends React.Component {
  state = {
    scrollActive: false,
  };

  componentDidMount() {
    // 스크롤링 이벤트 추가
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    // 언마운트 될때에, 스크롤링 이벤트 제거
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    // IE에서는 document.documentElement 를 사용.
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    // 스크롤링 했을때, 브라우저의 가장 밑에서 100정도 높이가 남았을때에 실행하기위함.
    if (scrollTop > 100) {
      //alert(scrollTop);
      this.setState({
        scrollActive: true,
      });
    } else {
      this.setState({
        scrollActive: false,
      });
    }
  };

  render() {
    const scrolltoTop = () => {
      window.scrollTo({top:0, behavior:'smooth'});
    };
    const { scrollActive } = this.state;

    return (
      <div className="TopButton">
        {!scrollActive ? (
          ""
        ) : (
          <div onClick={scrolltoTop}>
            <img className="img_button" alt="" src="https://image.flaticon.com/icons/svg/825/825179.svg"></img>
          </div>
        )}
      </div>
    );
  }
}

export default TopButton;
