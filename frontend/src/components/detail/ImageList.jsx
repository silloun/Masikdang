import React from "react";
import "./ImageList.scss";

import prevButton from "../../img/prevButton.png";
import nextButton from "../../img/nextButton.png";

class ImageList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      img_list: [],
      index: 0,
    };
  }

  componentDidMount() {
    this.setState({
      check: true,
      img_list: this.props.img_list,
    });
  }

  // 클릭으로 확인
  changeIndex = (res) => {
    this.setState({
      index: parseInt(res.target.id),
    });
  };

  // 이전 사진
  prevIndex = () => {
    if (this.state.index === 0) {
      this.setState({
        index: this.state.img_list.length - 1,
      });
    } else {
      this.setState({
        index: this.state.index - 1,
      });
    }
  };

  // 다음 사진
  nextIndex = () => {
    if (this.state.index === this.state.img_list.length - 1) {
      this.setState({
        index: 0,
      });
    } else {
      this.setState({
        index: this.state.index + 1,
      });
    }
  };

  // 최대 10개까지만 이미지 보이게 하기
  render() {
    return (
      <div className="ImageList">
        {this.state.img_list !== undefined ? (
          <>
            <div className="thumbnail">
              <div id="square" className="centered">
                <img
                  alt="food"
                  className="img"
                  src={String(this.state.img_list[this.state.index]).replace("300_300_","")}
                  onClick={() => {
                    window.open(this.state.img_list[this.state.index]);
                  }}
                />
              </div>
            </div>
            <div className="index prev_index" onClick={this.prevIndex}>
              <img alt="prevButton" src={prevButton}></img>
            </div>
            <div className="index next_index" onClick={this.nextIndex}>
              <img alt="nextButton" src={nextButton}></img>
            </div>
            <div className="preview">
              {this.state.img_list.map((img, index) => (
                <img
                  key={index}
                  id={index}
                  className="preview_img"
                  alt="food"
                  src={img}
                  onClick={this.changeIndex}
                />
              ))}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    );
  }
}

// {
//   this.state.stores.map((store) => (
//     <div className="card_item" key={store.id}>
//       <Card store={store}></Card>
//     </div>
//   ));
// }
export default ImageList;
