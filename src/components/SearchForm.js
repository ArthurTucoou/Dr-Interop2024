import React, { useState } from "react";
import ReactDOM from "react-dom";

import {
  Form,
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Select,
  Checkbox,
  Tooltip,
} from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

import { GlobalContext } from "../components/GlobalContext";

const { RangePicker } = DatePicker;
const { Option } = Select;

const SearchForm = (props) => {
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();

  const context = React.useContext(GlobalContext);

  const onFinish = (values) => {
    props.searchRequest(values);
  };

  return (
    <Form
      form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={1}>
          <Form.Item name={`name`} label={`Nom du patient :`}>
            <Input placeholder="Entrez le nom ou prénom du patient" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={2}>
          <Form.Item name="birthdate" label="Date de naissance">
            <RangePicker />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={3}>
          <Form.Item name="gender" label="Genre">
            <Select placeholder="Sélectionnez un genre" allowClear>
              <Option value="male">Homme</Option>
              <Option value="female">Femme</Option>
            </Select>
          </Form.Item>
        </Col>

        {expand && (
          <React.Fragment>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={8}
              className="search_inputs"
              key={4}
            >
              <Form.Item name={`phone`} label={`Numéro de téléphone`}>
                <Input placeholder="Entrez un numéro de téléphone" />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={12}
              lg={8}
              className="search_inputs"
              key={5}
            >
              <Form.Item name={`address`} label={`Adresse`}>
                <Input placeholder="Entrez l'adresse du patient" />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={12}
              lg={8}
              className="search_inputs"
              key={6}
            >
              <Form.Item name={`maritalStatus`} label={`Statut marital`}>
                <Input placeholder="Entrez le statut marital du patient" />
              </Form.Item>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={12}
              lg={8}
              className="search_inputs"
              key={7}
            >
              <Form.Item name={`id`} label={`INS`}>
                <Input placeholder="Entrez le numéro INS" />
              </Form.Item>
            </Col>
          </React.Fragment>
        )}
      </Row>

      {/* <Row>
        <Col
          xs={24}
          sm={8}
          md={8}
          lg={8}
          span={8}
          style={{
            textAlign: context.isMobile ? "center" : "left",
          }}
        >
          <Form.Item
            name={`exactMatch`}
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Checkbox checked>
              <Tooltip
                placement={context.isMobile ? "top" : "right"}
                title="Match the exact content from the search query"
              >
                Correspondance exacte
              </Tooltip>
            </Checkbox>
          </Form.Item>
        </Col>
        <Col
          xs={24}
          sm={16}
          md={16}
          lg={16}
          span={16}
          style={{
            textAlign: context.isMobile ? "center" : "right",
          }}
        > */}
      {/* <a
            style={{
              marginRight: 12,
              fontSize: 12,
              color: "#000000",
              fontWeight: "bold",
            }}
            onClick={() => {
              setExpand(!expand);
            }}
          >
            {expand ? <UpOutlined /> : <DownOutlined />} Recherche avancée
          </a> */}
      {/* <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: "#AD68F3",
              borderColor: "#AD68F3",
              color: "#FFFFFF",
              fontWeight: "bold",
            }}
          >
            Rechercher
          </Button>
          <Button
            style={{
              marginLeft: 8,
              borderColor: "#000000",
              color: "#000000",
              fontWeight: "bold",
            }}
            onClick={() => {
              form.resetFields();
            }}
          >
            Réinitialiser
          </Button> */}
      {/* </Col> */}
      {/* </Row> */}
      <Row justify="space-between" align="middle">
        <Col xs={24} sm={12} md={6} lg={6} style={{ textAlign: "left" }}>
          <Form.Item
            name="exactMatch"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Checkbox>
              <Tooltip
                placement={context?.isMobile ? "top" : "right"}
                title="Correspondance exacte"
              >
                Correspondance exacte
              </Tooltip>
            </Checkbox>
          </Form.Item>
        </Col>
        <Col
          xs={24}
          sm={12}
          md={6}
          lg={6}
          style={{ textAlign: "right", paddingRight: 24 }}
        >
          <a
            style={{
              marginRight: 6,
              fontSize: 12,
              color: "#000000",
              fontWeight: "bold",
            }}
            onClick={() => {
              setExpand(!expand);
            }}
          >
            {expand ? <UpOutlined /> : <DownOutlined />} Recherche avancée
          </a>
        </Col>
        <Col
          xs={24}
          sm={12}
          md={6}
          lg={6}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: 24,
          }}
        >
          <Button
            style={{
              backgroundColor: "#AD68F3",
              borderColor: "#AD68F3",
              color: "#FFFFFF",
              fontWeight: "bold",
            }}
            type="primary"
            htmlType="submit"
          >
            Rechercher
          </Button>
          <Button
            style={{
              marginLeft: 8,
              borderColor: "#000000",
              color: "#000000",
              fontWeight: "bold",
            }}
            onClick={() => form.resetFields()}
          >
            Réinitialiser
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
