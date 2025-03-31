const getAllPrestations = () => {
    return [
        { id: 1, nom: 'Événementielle' },
        { id: 2, nom: 'Beauté' }
    ];
};

const getPrestationById = (id) => {
    const prestations = getAllPrestations();
    return prestations.find((p) => p.id === id) || null;
};

module.exports= {
    getAllPrestations,
    getPrestationById
}