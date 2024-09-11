import React from 'react'; // Ajoutez cette ligne pour importer React

const GlycemieBadge = ({ patientData, isMoyenne }) => {
    // Fonction pour calculer la moyenne des valeurs
    const calculateAverage = (values) => {
        if (values.length === 0) return 0;
        const total = values.reduce((acc, value) => acc + value, 0);
        return total / values.length;
    };

    // Assurez-vous que patientData est bien défini et contient les observations
    const observations = patientData?.observations || [];

    // Extraire les valeurs de glycémie des observations
    const glycemieValues = observations.map(obs => parseFloat(obs?.valueQuantity?.value));

    // Calculer la moyenne des valeurs de glycémie
    const averageGlycemie = calculateAverage(glycemieValues).toFixed(0);

    // Déterminer si la glycémie moyenne est élevée
    const isHighGlycemie = averageGlycemie > 180; // Comparer la moyenne à 180 mg/dl

    const styles = {
        badge: {
            display: "inline-block",
            backgroundColor: isHighGlycemie ? "#f96b6b" : "#a9d46f", // Rouge si > 180, vert sinon
            padding: "5px 10px", // Espace interne
            borderRadius: "10px", // Coins arrondis
            color: "#4b602c", // Couleur du texte (vert foncé)
            fontWeight: "bold", // Texte en gras
            fontSize: "14px", // Taille de la police
        },
    };

    return (
        <div style={styles.badge}>
            {isMoyenne ? averageGlycemie : glycemieValues[0]} {observations[0]?.valueQuantity?.unit}
        </div>
    );
};

export default GlycemieBadge;
