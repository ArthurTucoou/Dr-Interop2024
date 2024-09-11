import React from "react";
import "./Header.css";
import logo from "../img/fhir-dashboard-logo.png";

const Header = props => {
  const doctorName = props.medecin && props.medecin.name[0].given[0] + " " + props.medecin.name[0].family;
  const height = props.isHome ? "400px" : "150px";
  const lineHeight = props.isHome ? "330px" : "150px";
  return (
    <div className={props.isHome ? "header mobileHeader" : "header"} style={{ height, lineHeight }}>
      {doctorName ? (
        <div>
          Bienvenue, {doctorName}
        </div>
      ) : (
        <div>
          {props.title}
        </div>
      )
      }
    </div>
  );
};

export default Header;
