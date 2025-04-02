const {
  getAllPrestations,
  getPrestationById,
} = require("../../services/prestation");

describe("Tests Prestation", () => {
  test("Récupérer toutes les prestations", () => {
    const prestations = getAllPrestations();
    expect(prestations.length).toBeGreaterThan(0);
  });

  test("Récupérer une prestation existante par ID", () => {
    const prestation = getPrestationById(1);
    expect(prestation).not.toBeNull();
    expect(prestation.nom).toBe("Événementielle");
  });

  test("Récupérer une prestation inexistante retourne null", () => {
    const prestation = getPrestationById(4);
    expect(prestation).toBeNull();
  });
});
