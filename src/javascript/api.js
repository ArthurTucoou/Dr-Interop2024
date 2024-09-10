let patientListDemo = require("./patientDemoData.json");
let observationDemo = require("./observationDemoData.json");

const BASE_URL = "https://fhir.alliance4u.io/api/";

const moment = require("moment");

const getPatientDemo = () => {
  return combinePatientsBundle(patientListDemo);
};

const getObservationDemo = () => {
  return combinePatientsBundle(observationDemo);
};

// Fonction pour combiner les bundles si nécessaire
function combinePatientsBundle(json) {
  let result = [];
  if (Array.isArray(json.entry)) {
    result = result.concat(json.entry);
  } else {
    result = result.concat(json);
  }
  console.log(result);
  return result;
}

// Fonction générique pour faire des requêtes API
function fetchFromAPI(endpoint) {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + endpoint)
      .then(async res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        let json = await res.json();
        resolve(json);
      })
      .catch(e => {
        reject(e);
        console.log(e);
      });
  });
}

// Fonction pour récupérer la liste des patients depuis l'API FHIR
function requestPatientList() {
  return new Promise((resolve, reject) => {
    fetchFromAPI("patient/")
      .then(json => {
        console.log(json);
        json = combinePatientsBundle(json);
        resolve(json);
      })
      .catch(e => {
        reject(e);
      });
  });
}

function matchPatientsWithObservations() {
  return Promise.all([requestPatientList(), requestObservation()])
    .then(([patientsData, observationsData]) => {
      console.log(patientsData);
      console.log(observationsData);
      
      
      // Création d'un index pour les patients par ID
      const patientsIndex = patientsData.map(patient => patient.id);
      console.log(patientsIndex);
      
      // Ajout des observations aux patients correspondants
      patientsData.forEach(patient => {
        patient.observations = observationsData.filter(observation =>
          observation.subject.reference.split('/')[1] == patient.id
        );
      });
      console.log(patientsData);
      

      return patientsData;
    })
    .catch(e => {
      console.error(e);
    });
}

// Fonction pour récupérer des observations (ou d'autres ressources)
function requestObservation() {
  return new Promise((resolve, reject) => {
    fetchFromAPI("observation/")
      .then(json => {
        console.log(json);
        resolve(json);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// Fonction pour obtenir la liste des patients
const getPatientList = async (message) => {
  return new Promise(async resolve => {
    let json = null;
    if (window.$globalPatients) {
      json = window.$globalPatients;
    } else {
      const hideLoading = message.loading("Veuillez patienter, nous récupérons les données des patients...", 0);
      try {
        json = await matchPatientsWithObservations();
        console.log(json);

        message.success({ content: "Données des patients chargées !", duration: 2 });
      } catch (e) {
        json = []; // Utiliser un tableau vide ou des données locales en cas d'erreur
        message.warn({
          content: "Network Error, the server might be down. Local demo data is loaded.",
          duration: 5
        });
      }
      window.$globalPatients = json;
      hideLoading();
    }
    resolve(json);
  });
};

// Fonction pour parser les données des patients
function parseAllPatientData(patients) {
  const tableData = [];
  patients.forEach(elementRaw => {

    let patient = new Object();
    patient.name = elementRaw.name?.[0]?.family + " " + elementRaw.name?.[0]?.given?.[0];
    patient.id = elementRaw.id;
    patient.phone = elementRaw.telecom?.[0]?.value;
    patient.language = elementRaw.communication?.[0]?.language?.text;
    patient.maritalStatus = elementRaw.maritalStatus?.text;
    // patient.address = elementRaw.address?.[0]?.line[0];
    patient.city = elementRaw.address?.[0]?.city;
    patient.state = elementRaw.address?.[0]?.state;
    patient.country = elementRaw.address?.[0]?.country;
    patient.gender = elementRaw.gender;
    patient.birthDate = elementRaw.birthDate;
    patient.birthMonth = moment(elementRaw.birthDate).format("MMMM");
    patient.age = moment().diff(elementRaw.birthDate, "years");
    patient.raw = elementRaw;
    tableData.push(patient);
  });

  return tableData;
}

export {
  requestPatientList,
  requestObservation,
  getPatientList,
  parseAllPatientData,
  getObservationDemo
};
