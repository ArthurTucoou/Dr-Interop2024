import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { requestMedecinConnected, updateMedecin } from "../javascript/api"; // Ajoutez la fonction updateMedecin

const ProfilPage = ({ context }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [medecin, setMedecin] = useState(null);

  // Charger les infos du médecin connecté
  useEffect(() => {
    const fetchMedecinData = async () => {
      try {
        setLoading(true);
        const medecinData = await requestMedecinConnected();
        setMedecin(medecinData);

        form.setFieldsValue({
          nom: medecinData?.name?.[0]?.family || "",
          prenom: medecinData?.name?.[0]?.given?.[0] || "",
          rpps: medecinData?.id || "",
          address: medecinData?.address?.[0]?.city|| "",
          telecom: medecinData?.telecom?.[0]?.value || ""
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données du médecin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedecinData();
  }, []);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      console.log(values);
  
      const formattedData = {
        resourceType: "Practitioner",
        name: [
          {
            family: values.nom,
            given: [values.prenom],
          },
        ],
        telecom: [
            {
                value: values.telecom,
            }
        ],
        address: [
            {
                city: values.address,
            }
        ]
      };
  
      // Call the API to update the doctor's data
      const updatedMedecin = await updateMedecin(formattedData, medecin?.id); // Use 'medecin?.id' instead of 'medecinData?.id'
      console.log("Updated doctor's data:", updatedMedecin);
  
      // Update the state with the new data
      setMedecin(updatedMedecin);
    } catch (error) {
      console.error("Error updating the doctor's information:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Form
      form={form}
      name="medecin_profile_form"
      className="ant-advanced-search-form"
      onFinish={handleFinish}
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
    <Input placeholder="Entrez votre numéro RPPS" disabled={true} />
  </Form.Item>
</Col>

        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={4}>
          <Form.Item name="address" label="Adresse">
            <Input placeholder="Entrez votre adresse" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={5}>
          <Form.Item name="telecom" label="Numéro de portable">
            <Input placeholder="Entrez votre numéro de portable" />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={8} md={8} lg={8} span={8} style={{ textAlign: context?.isMobile ? "center" : "left" }}>
          {/* Espace réservé */}
        </Col>

        <Col xs={24} sm={16} md={16} lg={16} span={16} style={{ textAlign: context?.isMobile ? "center" : "right" }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#AD68F3", borderColor: "#AD68F3", color: "#FFFFFF", fontWeight: "bold" }}
            loading={loading}
          >
            Modifier le profil
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ProfilPage;
