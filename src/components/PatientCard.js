import React, { Component } from "react";
import { Card } from "antd";
import { GlobalContext } from "../components/GlobalContext";
import male from "../img/male.png";
import female from "../img/female.png";
import GlycemieBadge from "./GlycemieBadge";

class PatientCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  static contextType = GlobalContext;

  render() {
    const { patientData, loading } = this.props;

    const name = patientData && patientData.name[0].family + " " + patientData.name[0].given[0];    

    return (
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={patientData ? patientData.photoUrl : "url_placeholder"}
              alt="patient"
              style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
            />
            {patientData ? name : "Chargement..."}
            <img 
              src={patientData?.gender.toLowerCase() == "male" ? male : female}
              alt="user"
              style={{ width: 20, height: 20, borderRadius: "50%", marginLeft: 10 }}
            />
          </div>
        }
        onClick={this.props.viewPatient}
        // extra={
        //   <a disabled={loading} onClick={this.props.viewPatient}>
        //     View Detail
        //   </a>
        // }
        style={{ width: this.context.isMobile ? "100%" : "auto", margin: "5px" }}
        loading={loading}
        hoverable
      >
        {patientData && (
          <div>
            {/* <p>{patientData?.birthDate + ", " + patientData?.communication[0]?.language?.text}</p> */}
            <p>INS : {patientData?.id}</p>
            <GlycemieBadge patientData={patientData} isMoyenne={true}/>
            {/* <p>{patientData?.address[0]?.line[0] + ", " + patientData?.address[0]?.country}</p> */}
          </div>
        )}
      </Card>
    );
  }
}

export default PatientCard;
