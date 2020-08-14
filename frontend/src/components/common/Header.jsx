import React from "react";
import "./Header.scss";
import logo from "../../img/logo6.png";
import { NavLink } from "react-router-dom";

class Header extends React.Component {
  render() {
    return (
      <>
        <div className="Header">
          <div className="container-fluid">
            <div className="row">
              <div className="col-3">
                <NavLink to="/surveyStart">
                  <div className="survey2_btn">
                    마식는
                    <br />
                    테스트
                  </div>
                </NavLink>
              </div>
              <div className="logo col-6">
                <NavLink to="/home">
                  <img alt="logo" src={logo}></img>
                </NavLink>
              </div>
              <div className="col-3">
                <NavLink to="/whatToEatStart">
                  <div className="survey1_btn">
                    오늘
                    <br />
                    뭐먹지?
                  </div>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Header;
