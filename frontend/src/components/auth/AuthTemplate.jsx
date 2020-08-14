import React from "react";
import { Link } from "react-router-dom";
import "../auth/AuthTemplate.scss";
import logo from "../../img/logo4.png";

const AuthTemplate = ({ children }) => {
  return (
    <div className="AuthTemplateBlock">
      <div id="square" className="fadeInUp animated">
        <div className="WhiteBox">
          <div className="logo-area">
            <Link to="/home">
              <img className="logo" src={logo} alt="logo" />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthTemplate;
