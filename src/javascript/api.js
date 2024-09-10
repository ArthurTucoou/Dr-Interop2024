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
    console.log("test");
    
    let localCache = localStorage.getItem("patients");
    // if (localCache) {
    //   setTimeout(() => {
    //     resolve(JSON.parse(localCache));
    //   }, 1000);
    // } else {
      console.log("ouiiii");
      
      fetchFromAPI("patient/")
        .then(json => {
          console.log(json);
          
          json = combinePatientsBundle(json);
          localStorage.setItem("patients", JSON.stringify(json));
          resolve(json);
        })
        .catch(e => {
          reject(e);
        });
    // }
  });
}

// Fonction pour récupérer des observations (ou d'autres ressources)
function requestObservation(id) {
  return fetchFromAPI(`observation/${id}`);
}

// Fonction pour obtenir la liste des patients
const getPatientList = async (message) => {
  return new Promise(async resolve => {
    let json = null;
    if (window.$globalPatients) {
      json = window.$globalPatients;
    } else {
      const hideLoading = message.loading("Please wait, fetching patient data...", 0);
      try {
        json = await requestPatientList();
        console.log(json);
        
        message.success({ content: "Patient data loaded!", duration: 2 });
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
    patient.address = elementRaw.address?.[0]?.line[0];
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
