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

export async function updateMedecin(data,id) {
  console.log("JSON.stringify(data)=",JSON.stringify(data))
  try {
    // Envoyer la requête POST
    const response = await fetch(BASE_URL + "practitioner/"+ id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here', // Remplacez par votre token si nécessaire
      },
      body: JSON.stringify(data), // Convertir les données en JSON
    });

    // Lire la réponse en JSON
    const responseData = await response.json();

    // Retourner les données de la réponse
    return responseData;
  } catch (error) {
    // Gérer les erreurs
    console.error('Erreur lors de l\'enregistrement de l\'observation:', error);
    throw error; // Rejeter l'erreur pour permettre à l'appelant de la gérer
  }
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

// Fonction pour récupérer la liste des patients depuis l'API FHIR
function requestPatient(id) {
  console.log(id);

  return new Promise((resolve, reject) => {
    fetchFromAPI(`patient/${id}`)
      .then(json => {
        console.log(json);

        resolve(json);
      })
      .catch(e => {
        reject(e);
      });
  });
}

// Fonction pour récupérer la liste des patients depuis l'API FHIR
function requestMedecinConnected() {
  return new Promise((resolve, reject) => {
    fetchFromAPI("practitioner/1235dr4u54321")
      .then(json => {
        console.log(json);
        resolve(json);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export async function postObservation(data) {
  try {
    // Envoyer la requête POST
    const response = await fetch(BASE_URL + "observation/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here', // Remplacez par votre token si nécessaire
      },
      body: JSON.stringify(data), // Convertir les données en JSON
    });

    // Lire la réponse en JSON
    const responseData = await response.json();

    // Retourner les données de la réponse
    return responseData;
  } catch (error) {
    // Gérer les erreurs
    console.error('Erreur lors de l\'enregistrement de l\'observation:', error);
    throw error; // Rejeter l'erreur pour permettre à l'appelant de la gérer
  }
}

export async function postMedicationRequest(data) {
  try {
    // Envoyer la requête POST
    const response = await fetch(BASE_URL + "medication-request/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here', // Remplacez par votre token si nécessaire
      },
      body: JSON.stringify(data), // Convertir les données en JSON
    });

    // Lire la réponse en JSON
    const responseData = await response.json();

    // Retourner les données de la réponse
    return responseData;
  } catch (error) {
    // Gérer les erreurs
    console.error('Erreur lors de l\'enregistrement du traitement:', error);
    throw error; // Rejeter l'erreur pour permettre à l'appelant de la gérer
  }
}

export async function postCarePlan(data) {
  try {
    // Envoyer la requête POST
    const response = await fetch(BASE_URL + "care-plan/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token-here', // Remplacez par votre token si nécessaire
      },
      body: JSON.stringify(data), // Convertir les données en JSON
    });

    // Lire la réponse en JSON
    const responseData = await response.json();

    // Retourner les données de la réponse
    return responseData;
  } catch (error) {
    // Gérer les erreurs
    console.error('Erreur lors de l\'enregistrement de la conduite à tenir:', error);
    throw error; // Rejeter l'erreur pour permettre à l'appelant de la gérer
  }
}

function matchPatientsWithObservations() {
  return Promise.all([requestPatientList(), requestObservation()])
    .then(([patientsData, observationsData]) => {
      console.log(patientsData);
      console.log(observationsData);

      // Filtrer les observations avec le code "15074-8"
      const filteredObservations = observationsData.filter(observation =>
        observation.code?.coding?.some(coding => coding.code == "15074-8")
      );

      // Création d'un index pour les patients par ID
      const patientsIndex = patientsData.map(patient => patient.id);
      console.log(patientsIndex);

      // Ajout des observations aux patients correspondants
      patientsData.forEach(patient => {
        patient.observations = filteredObservations.filter(observation =>
          observation.subject?.reference?.split('/')[1] == patient.id
        );
      });

      // Retourner seulement les patients qui ont des observations avec le code "15074-8"
      const patientsWithObservations = patientsData.filter(patient => patient.observations.length > 0);

      return patientsWithObservations;
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
  matchPatientsWithObservations,
  getObservationDemo,
  requestMedecinConnected,
  requestPatient
};
