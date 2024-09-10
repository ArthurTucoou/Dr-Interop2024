import React from 'react'; // Ajoutez cette ligne pour importer React

const GlycemieBadge = ({ value }) => {
    const isHighGlycemie = parseFloat(value) > 180; // On compare la valeur à 180 mg/dl

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
            {value} mg/DL
        </div>
    );
};

export default GlycemieBadge;
