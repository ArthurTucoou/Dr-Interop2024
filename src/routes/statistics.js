import React from 'react';
import { Form, Input, Button, Row, Col, Tooltip, Checkbox } from 'antd';

const MedecinProfileForm = ({ context, onFinish }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="medecin_profile_form"
      className="ant-advanced-search-form"
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={1}>
          <Form.Item name="nom" label="Nom">
            <Input placeholder="Entrez votre nom" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={2}>
          <Form.Item name="prenom" label="Prénom">
            <Input placeholder="Entrez votre prénom" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={3}>
          <Form.Item name="rpps" label="Numéro RPPS">
            <Input placeholder="Entrez votre numéro RPPS" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={4}>
          <Form.Item name="adresse" label="Adresse">
            <Input placeholder="Entrez votre adresse" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={5}>
          <Form.Item name="portable" label="Numéro de portable">
            <Input placeholder="Entrez votre numéro de portable" />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col
          xs={24}
          sm={8}
          md={8}
          lg={8}
          span={8}
          style={{
            textAlign: context?.isMobile ? 'center' : 'left',
          }}
        >
          <Form.Item name="exactMatch" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>
              <Tooltip placement={context?.isMobile ? 'top' : 'right'} title="Correspondance exacte">
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
            textAlign: context?.isMobile ? 'center' : 'right',
          }}
        >
          <Button type="primary" htmlType="submit">
            Modifier le profil
          </Button>
          <Button
            style={{
              marginLeft: 8,
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

export default MedecinProfileForm;
