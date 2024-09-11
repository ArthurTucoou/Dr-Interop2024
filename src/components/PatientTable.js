import React, { Component } from "react";
import { Table, Skeleton } from "antd";
import { parseAllPatientData } from "../javascript/api";
import male from "../img/male.png";
import female from "../img/female.png";
import GlycemieBadge from "./GlycemieBadge";

class PatientTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: null
    };
  }

  updatePatients = () => {
    if (this.props.patientData != null && this.props.patientData[0] != null) {
      this.setState({
        tableData: this.updatePatientArray(this.props.patientData)
      });
    }
  };

  componentDidUpdate = lastProp => {
    // console.log(lastProp, this.props, this.state);
    if (lastProp != this.props) this.updatePatients();
  };

  componentDidMount = prop => {
    this.updatePatients();
  };

  updatePatientArray = patients => {
    return parseAllPatientData(patients);
  };

  render() {
    const { loading } = this.props;

    if (loading) {
      return (
        <div style={{ padding: "30px" }}>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </div>
      );
    }

    const columns = [
      {
        title: "Nom",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
        width: 180,
        sorter: (a, b) => a.name.localeCompare(b.name),
        fixed: "left"
      },
      {
        title: "Genre",
        dataIndex: "gender",
        key: "gender",
        ellipsis: true,
        width: 70,
        sorter: (a, b) => a.gender.localeCompare(b.gender),
        render: (gender) => (
          <img
            src={gender.toLowerCase() == "male" ? male : female}
            alt={gender}
            style={{ width: 20, height: 20, borderRadius: "50%", marginLeft: 10 }}
          />
        )
      },
      {
        title: "Observations",
        dataIndex: "raw",
        key: "raw",
        width: 100,
        render: obj => (
          <a
            onClick={() => {
              this.props.viewPatient(obj);
            }}
          >
            Voir les détails
          </a>
        ),
        fixed: ""
      },
      {
        title: "INS",
        dataIndex: "id",
        key: "id",
        ellipsis: true,
        width: 200,
        sorter: (a, b) => a.id.localeCompare(b.id)
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
        ellipsis: true,
        width: 70,
        sorter: (a, b) => a.age - b.age,
        render: age => `${age} ans`,
      },
      {
        title: "Glycémie",
        dataIndex: "observations",
        key: "glycemie",
        ellipsis: true,
        width: 70,
        render: (observations, record) => (
          <GlycemieBadge
            patientData={record.raw} // Passez les données du patient à GlycemieBadge
            isMoyenne={true} // Si vous voulez afficher la moyenne
          />
        ),
      }
    ];

    return (
      <Table
        columns={columns}
        pagination={{ showSizeChanger: true }}
        dataSource={this.state.tableData}
        rowKey="id"
      />
    );
  }
}

export default PatientTable;
