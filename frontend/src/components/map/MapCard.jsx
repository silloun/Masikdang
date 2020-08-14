import React from "react";
import "./MapCard.scss";
import store_img from "../../img/store.png";
import { withRouter } from "react-router-dom";

class MapCard extends React.Component {
  constructor(props) {
    super(props);

    // 초기 값을 멀티캠퍼스 역삼으로 설정
    this.state = {
      index: 0,
      store: [],
      category_list: [],
    };
  }
  componentDidMount() {
    this.setState({
      index: this.props.index,
      store: this.props.store,
    });
    if (this.props.store.category !== null) {
      this.setState({
        category_list: this.props.store.category.split("|"),
      });
    }
  }

  // 값 바겼을 때
  componentDidUpdate(prevProps) {
    if (prevProps.store.id !== this.props.store.id) {
      this.setState({
        index: this.props.index,
        store: this.props.store,
      });
      if (this.props.store.category !== null) {
        this.setState({
          category_list: this.props.store.category.split("|"),
        });
      }
    }
  }

  clickItem = () => {
    const { history } = this.props;
    history.push("/search/" + this.state.store.id);
  };

  render() {
    return (
      <div className="MapCard" id={this.state.store.id} onClick={this.clickItem}>
        <img
          alt="food"
          className="img"
          src={this.state.store.img ? this.state.store.img : store_img}
        />

        <div className="store_info">
          <div className="store_name">
            {this.state.index}. {this.state.store.store_name}
          </div>
          <div>{this.state.store.address}</div>
          <div>
            {this.state.category_list.map((item, index) => (
              <span key={index}>
                {item}
                {index !== this.state.category_list.length - 1 && ", "}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(MapCard);
