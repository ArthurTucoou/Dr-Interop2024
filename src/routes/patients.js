import React, { Component } from "react";
import PatientsListDisplay from "../components/PatientsListDisplay";
import { getPatientList } from "../javascript/api";
import Header from "../components/Header";
import Overlay from "../components/Overlay";
import { message } from "antd";

const moment = require("moment");

class PatientsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      awaitingData: true,
      patients: null,
      page: 0
    };
  }

  async componentDidMount() {
    let json = await getPatientList(message);

    this.setState({
      awaitingData: false,
      patients: json
    });
  }

  render() {
    let patientData = this.state.patients;
    if (this.props.filter && this.state.patients) {
      patientData = doFilter(this.state.patients, this.props.filter);
      if (patientData.length > 0) {
        message.success({ content: `Found ${patientData.length} matching records`, duration: 3 });
      } else {
        message.warn({ content: `No records found`, duration: 3 });
      }
    }
    return (
      <div>
        <Overlay show={this.state.awaitingData}></Overlay>
        {!this.props.filter && <Header title="Liste des patients"></Header>}
        <PatientsListDisplay patients={patientData} loading={this.state.awaitingData} />
      </div>
    );
  }
}

function recursiveFind(obj, value, exact) {
  let json = JSON.stringify(obj);
  const regex = exact
    ? new RegExp('"' + value.toLowerCase() + '"', "g")
    : new RegExp(".*" + value.toLowerCase() + ".*", "g");
  return json.toLowerCase().search(regex) !== -1;
}

function doFilter(patients, filter) {
  let result = [];
  for (let patient of patients) {
    let data = patient.resource;

    // Log the patient to see the structure
    console.log("Patient data:", patient);

    if (!data) {
      console.warn("Patient resource is undefined, skipping...");
      continue; // Skip this patient if data is undefined
    }

    let match = [];

    if (filter.name) {
      console.log("Checking name:", data.name);
      match.push(recursiveFind(data.name, filter.name, filter.exactMatch));
    }
    if (filter.birthdate && data.birthDate) {
      console.log("Checking birthdate:", data.birthDate);
      let isWithIn =
        filter.birthdate[0] <= moment(data.birthDate) &&
        moment(data.birthDate) <= filter.birthdate[1];
      match.push(isWithIn);
    }
    if (filter.gender && data.gender) {
      console.log("Checking gender:", data.gender);
      match.push(data.gender == filter.gender);
    }
    if (filter.phone && data.telecom) {
      console.log("Checking phone:", data.telecom);
      match.push(recursiveFind(data.telecom, filter.phone, filter.exactMatch));
    }
    if (filter.address && data.address) {
      console.log("Checking address:", data.address);
      match.push(recursiveFind(data.address, filter.address, filter.exactMatch));
    }
    if (filter.maritalStatus && data.maritalStatus) {
      console.log("Checking marital status:", data.maritalStatus);
      match.push(recursiveFind(data.maritalStatus, filter.maritalStatus, filter.exactMatch));
    }
    if (filter.id && data.id) {
      console.log("Checking ID:", data.id);
      match.push(recursiveFind(data.id, filter.id, filter.exactMatch));
    }
    if (filter.anythingElse) {
      console.log("Checking anything else");
      match.push(recursiveFind(data, filter.anythingElse, filter.exactMatch));
    }

    // Log the match results for this patient
    console.log("Match results for this patient:", match);

    if (match.every(x => x === true)) {
      result.push(patient);
    }
  }
  console.log("Filtered result:", result);
  return result;
}



export default PatientsPage;
