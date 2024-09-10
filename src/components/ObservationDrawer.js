import React from "react";
import { Drawer, Descriptions, Skeleton, message } from "antd";
import ReactJson from "react-json-view";
import Recharts from "./Recharts";

import { GlobalContext } from "../components/GlobalContext";

const keyGen = () => {
  let r = Math.random()
    .toString(36)
    .substring(7);
  return r;
};

// to match all kinds of values, see https://www.hl7.org/fhir/observation.html
const findValueKey = observation => {
  let key,
    keys = [];
  let filter = new RegExp("value.*|component", "g");
  for (key in observation) if (observation.hasOwnProperty(key) && filter.test(key)) keys.push(key);
  return keys[0];
};

class ObservationDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      observation: null
    };
  }

  static contextType = GlobalContext;
  //load observation
  // async componentDidUpdate() {
  //   console.log(this.props.patient);

  //   if (this.props.patient && this.props.patient.observations.length == 0) {
  //     let json;
  //     console.log(this.props);

  //     try {
  //       json = await requestObservation(this.props.patient.id);
  //     } catch (e) {
  //       json = getObservationDemo();
  //       message.warn({
  //         content: "Network Error, the server might be down. Local demo data is loaded.",
  //         duration: 2
  //       });
  //     }

  //     this.setState({
  //       loading: false,
  //       observation: json,
  //       rawDataDrawer: false,
  //       rawDataDrawerData: null
  //     });
  //   }
  // }

  onClose = () => {
    this.setState({
      loading: true,
      observation: null
    });
    console.log(this.state);
    this.props.onClose();
  };

  onChildrenDrawerClose = () => {
    this.setState({
      rawDataDrawer: false
    });
  };

  openRawDataDrawer = data => {
    this.setState({
      rawDataDrawer: true,
      rawDataDrawerData: data
    });
  };

  render() {
    const { visible } = this.props;
    const patient = this.props.patient;

    // console.log("CONTEXT UPDATE", this.context);
    const ViewRawBtn = props => {
      return (
        <div style={{ margin: "auto", textAlign: "center", padding: "10px 0" }}>
          <a
            onClick={() => {
              this.openRawDataDrawer(props.object);
            }}
            disabled={this.props.loading}
          >
            View Raw FHIR Data
          </a>
        </div>
      );
    };
    console.log(this.props?.patient?.observations);

    let observations =
      this.props?.patient?.observations &&
      this.props?.patient?.observations.map(obs => {
        console.log(obs);
        console.log(findValueKey(obs));

        let valueKey = findValueKey(obs);
        let valueItems;
        if (valueKey) {
          valueItems = Object.keys(obs[valueKey]).map(key => {
            if (key == "coding" || key == "system" || key == "code") return;
            const value = obs[valueKey][key] + "";
            return (
              <Descriptions.Item key={keyGen()} label={key}>
                {value}
              </Descriptions.Item>
            );
          });

          if (valueKey == "component") {
            //special case - blood pressure
            valueItems = obs.component.map(blood => {
              return (
                <Descriptions.Item key={keyGen()} label={blood.code?.text}>
                  {blood.valueQuantity?.value + " " + blood.valueQuantity?.unit}
                </Descriptions.Item>
              );
            });
          }
        }
        return (
          <div key={keyGen()} style={{ wordBreak: "break-all" }}>
            <Descriptions
              bordered={true}
              layout={this.context.isMobile ? "horizontal" : "vertical"}
              key={keyGen()}
              title={obs.code.text}
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
              <Descriptions.Item key={keyGen()} label="ID">
                {obs?.id}
              </Descriptions.Item>
              {valueItems}
              <Descriptions.Item key={keyGen()} label="Category">
                {obs?.category?.[0]?.coding?.[0].display}
              </Descriptions.Item>
              <Descriptions.Item key={keyGen()} label="issued">
                {obs?.issued}
              </Descriptions.Item>
              <Descriptions.Item key={keyGen()} label="effectiveDateTime">
                {obs?.effectivePeriod?.start}
              </Descriptions.Item>
            </Descriptions>

            <ViewRawBtn object={obs}></ViewRawBtn>
          </div>
        );
      });

    return (
      <Drawer
        title="Synthèse patient"
        placement="right"
        closable={true}
        onClose={this.onClose}
        visible={visible}
        width={this.context.isMobile ? "100%" : "60%"}
      >
        {patient && (
          <div key={keyGen()}>
            <Descriptions title="Administratif">
              <Descriptions.Item key={keyGen()} label="Nom">
                {`${patient.name[0]?.family} ${patient.name[0]?.given?.[0]}`}
              </Descriptions.Item>
              <br />
              <Descriptions.Item key={keyGen()} label="Naissance">
                {patient.birthDate}
              </Descriptions.Item>
              <Descriptions.Item key={keyGen()} label="INS">
                {patient.id}
              </Descriptions.Item>
              {/* <Descriptions.Item key={keyGen()} label="Address">
                {`${patient.address[0].line[0]}, ${patient.address[0].city}, ${patient.address[0].state}, ${patient.address[0].country}`}
              </Descriptions.Item> */}
            </Descriptions>
            <ViewRawBtn object={patient}></ViewRawBtn>
            {observations ? (
              observations
            ) : (
              <div>
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
              </div>
            )}
          </div>
        )}

        <Recharts/>

        <Drawer
          title="Raw FHIR Data"
          width={this.context.isMobile ? "100%" : "50%"}
          closable={true}
          onClose={this.onChildrenDrawerClose}
          visible={this.state.rawDataDrawer}
        >
          <ReactJson src={this.state.rawDataDrawerData} />
        </Drawer>
      </Drawer>
    );
  }
}

export default ObservationDrawer;
