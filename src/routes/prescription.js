import React, { useEffect, useState } from "react";
import { Form, Input, Button, Row, Col, Typography, message } from "antd";
import { useParams } from "react-router-dom";
import { requestPatient, requestMedecinConnected, postCarePlan, postMedicationRequest, postObservation } from "../javascript/api";

const { TextArea } = Input;
const { Title } = Typography;

const PrescriptionPage = ({ context }) => {
  const { id } = useParams(); // Récupère l'id depuis l'URL

  const [form] = Form.useForm();
  const [patient, setPatient] = useState(null);
  const [medecin, setMedecin] = useState(null);

  useEffect(() => {
    const fetchPatientAndMedecin = async () => {
      try {
        // Récupérer les informations du patient
        const patientData = await requestPatient(id);
        setPatient(patientData);

        // Récupérer les informations du médecin
        const medecinData = await requestMedecinConnected();
        setMedecin(medecinData);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations", error);
      }
    };

    fetchPatientAndMedecin();
  }, [id]);

  // Fonction pour gérer la soumission du formulaire
  const onFinish = async (values) => {
    console.log(values);

    try {
      const { traitements, observations, conduite } = values;

      // Post Observation
      await postObservation({
        resourceType: 'Observation',
        subject: { reference: `Patient/${id}` },
        code: {
          coding: [
            {
              code: "code4u"
            }
          ]
        },
        note: [{
          text: observations
        }],
      });

      // Post Medical Request
      await postMedicationRequest({
        resourceType: 'MedicationRequest',
        subject: { reference: `Patient/${id}` },
        medication: {},
        note: [{
          text: traitements
        }],
      });

      // Post Care Plan
      await postCarePlan({
        resourceType: 'CarePlan',
        subject: { reference: `Patient/${id}` },
        description: conduite,
      });

      message.success('Prescription enregistrée avec succès !');
    } catch (error) {
      message.error('Erreur lors de l\'enregistrement de la prescription');
      console.error("Erreur lors de l'enregistrement de la prescription", error);
    }
  };

  return (
    <div style={{ margin: '0 auto', maxWidth: '1200px', padding: '20px' }}>

      {/* Formulaire pour la prescription */}
      <Form
        form={form}
        name="prescription_form"
        className="ant-advanced-search-form"
        onFinish={onFinish}
      >
        <div style={{ marginBottom: '20px', fontSize: "18px" }}>
          {/* Affichage des informations du patient */}
          <h2>{patient?.name[0]?.given[0] + " " + patient?.name[0]?.family} (Date de naissance : {patient?.birthDate})</h2>
          <h3>Informations médicales</h3>
        </div>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={24} lg={24} className="search_inputs" key={1}>
            <Form.Item
              name="traitements"
              label={<span style={{ fontWeight: "bold", fontSize: "14px" }}>Traitements </span>}
            >
              <TextArea rows={4} placeholder="Entrez les traitements..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={24} md={24} lg={24} className="search_inputs" key={2}>
            <Form.Item
              name="conduite"
              label={<span style={{ fontWeight: "bold", fontSize: "14px" }}>Conduite à tenir </span>}
            >
              <TextArea rows={4} placeholder="Entrez la conduite à tenir..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={24} md={24} lg={24} className="search_inputs" key={3}>
            <Form.Item
              name="observations"
              label={<span style={{ fontWeight: "bold", fontSize: "14px" }}>Observations </span>}
            >
              <TextArea rows={4} placeholder="Entrez les observations..." />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
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
            >
              Créer la prescription
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
    </div>
  );
};

export default PrescriptionPage;