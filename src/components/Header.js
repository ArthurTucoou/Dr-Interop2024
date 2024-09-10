import React from "react";
import "./Header.css";
import logo from "../img/fhir-dashboard-logo.png";

const Header = props => {
  const height = props.isHome ? "400px" : "150px";
  const lineHeight = props.isHome ? "330px" : "150px";
  return (
    <div className={props.isHome ? "header mobileHeader" : "header"} style={{ height, lineHeight }}>
      {
        props.title
      }
    </div>
  );
};

export default Header;
