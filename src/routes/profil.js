import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { requestMedecinConnected } from "../javascript/api";

const ProfilPage = ({ context, onFinish }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [medecin, setMedecin] = useState(null);

  // Charger les infos du médecin connecté avec une fonction asynchrone dans le useEffect
  useEffect(() => {
    const fetchMedecinData = async () => {
      try {
        setLoading(true); // Début du chargement
        const medecinData = await requestMedecinConnected();
        console.log(medecinData); // Pour débogage

        setMedecin(medecinData); // Mise à jour de l'état avec les données du médecin

        // Pré-remplir le formulaire avec les données récupérées
        form.setFieldsValue({
          nom: medecinData?.name?.[0]?.family || "",
          prenom: medecinData?.name?.[0]?.given?.[0] || "",
          rpps: medecinData?.identifier?.[0]?.value || "",
          adresse: medecinData?.address?.[0]?.text || "",
          portable: medecinData?.telecom?.[0]?.value || "",
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données du médecin:", error);
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchMedecinData();
  }, [form]); // form est inclus dans les dépendances pour s'assurer que setFieldsValue est correctement mis à jour

  // Soumettre le formulaire modifié
  const handleFinish = (values) => {
    console.log("Nouvelles informations :", values);
    onFinish(values); // Logique pour envoyer les données mises à jour à l'API
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
            <Input
              placeholder="Entrez votre nom"
              value={medecin?.name?.[0]?.family || ""}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={2}>
          <Form.Item name="prenom" label="Prénom">
            <Input
              placeholder="Entrez votre prénom"
              value={medecin?.name?.[0]?.given?.[0] || ""}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={3}>
          <Form.Item name="rpps" label="Numéro RPPS">
            <Input
              placeholder="Entrez votre numéro RPPS"
              value={medecin?.identifier?.[0]?.value || ""}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={4}>
          <Form.Item name="adresse" label="Adresse">
            <Input
              placeholder="Entrez votre adresse"
              value={medecin?.address?.[0]?.text || ""}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={12} lg={8} className="search_inputs" key={5}>
          <Form.Item name="portable" label="Numéro de portable">
            <Input
              placeholder="Entrez votre numéro de portable"
              value={medecin?.telecom?.[0]?.value || ""}
            />
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
            textAlign: context?.isMobile ? "center" : "left",
          }}
        >
          {/* Espace réservé */}
        </Col>

        <Col
          xs={24}
          sm={16}
          md={16}
          lg={16}
          span={16}
          style={{
            textAlign: context?.isMobile ? "center" : "right",
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: "#AD68F3",
              borderColor: "#AD68F3",
              color: "#FFFFFF",
              fontWeight: "bold",
            }}
            loading={loading}
          >
            Modifier le profil
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

export default ProfilPage;
