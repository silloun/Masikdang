import React from "react";
import "./AppBar.scss";
import { withRouter } from "react-router-dom";
import { SearchContext } from "../../contexts/search";

class AppBar extends React.Component {

  static contextType = SearchContext;

  constructor(props) {
    super(props);
    this.state = {
      tab1: "",
      tab2: "",
    };
  }

  componentDidMount() {
    const url = window.location.href.split("/");
    this.setState({
      tab1: url[url.length - 1],
      tab2: url[url.length - 2],
    });
  }

  clicktab = (res) => {
    const { history } = this.props;
    history.push("/" + res.target.id);
  };

  id_list = [
    ["home", "홈"],
    ["search", "검색"],
    ["map", "지도"],
    ["mypage", "내정보"],
  ];

  render() {
    return (
      <>
        <div className="AppBar">
          <div className="container-fluid">
            <div className="row">
              {this.id_list.map((id) => (
                <div
                  key={id[0]}
                  id={id[0]}
                  className={this.state.tab1 === id[0] || this.state.tab2 === id[0] ? "col-3 focus" : "col-3"}
                  onClick={this.clicktab}
                >
                  <div id={id[0]} className="tab">
                    {id[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bottom"></div>
      </>
    );
  }
}

export default withRouter(AppBar);
