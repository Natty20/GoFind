const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

let server;

beforeAll(() => {
  server = request(app); // Utiliser supertest directement
  console.log("✅ Serveur Express prêt pour les tests");
});

afterAll(async () => {
  await mongoose.connection.close(); // Fermer MongoDB proprement
  console.log("🛑 Connexion MongoDB fermée après les tests");
});

describe("Tests fonctionnels - API des prestations", () => {
  // Test pour récupérer toutes les prestations
  it("devrait retourner toutes les prestations", async () => {
    const response = await request(app).get("/api/prestations"); // Effectuer une requête GET sur /api/prestations
    expect(response.status).toBe(200); // Vérifier que la réponse est OK (status 200)
    expect(response.body).toBeInstanceOf(Array); // Vérifier que la réponse est un tableau
    expect(response.body.length).toBeGreaterThan(0); // Vérifier qu'il y a des prestations
  }, 60000);

  // Test pour récupérer une prestation par ID
  it("devrait retourner une prestation par ID", async () => {
    const response = await request(app).get("/api/prestations/1"); // Effectuer une requête GET sur /api/prestations/1
    expect(response.status).toBe(200); // Vérifier que la réponse est OK (status 200)
    expect(response.body).toHaveProperty("id"); // Vérifier que la réponse contient un ID
    expect(response.body.nom).toBe("Événementielle"); // Vérifier que le nom de la prestation est 'Événementielle'
  }, 10000);

  // Test pour créer une prestation
  // it('devrait créer une nouvelle prestation', async () => {
  //     const newPrestation = {
  //         nom: 'Photographie',
  //         description: 'Prestation de photographie pour événements.',
  //     };

  //     const response = await request(app)
  //         .post('/api/prestations') // Effectuer une requête POST pour créer une nouvelle prestation
  //         .send(newPrestation); // Envoyer les données de la prestation

  //     expect(response.status).toBe(201); // Vérifier que la prestation a bien été créée (status 201)
  //     expect(response.body.nom).toBe(newPrestation.nom); // Vérifier que le nom de la prestation correspond
  //     expect(response.body.description).toBe(newPrestation.description); // Vérifier que la description correspond
  // });

  // Test pour vérifier la création d'une prestation avec des données manquantes
  // it('devrait retourner une erreur si des données sont manquantes lors de la création', async () => {
  //     const incompletePrestation = {
  //         nom: 'Photographie',
  //         // Description manquante
  //     };

  //     const response = await request(app)
  //         .post('/api/prestations') // Effectuer une requête POST pour créer une prestation
  //         .send(incompletePrestation); // Envoyer les données manquantes

  //     expect(response.status).toBe(400); // Vérifier que la réponse est une erreur (status 400)
  //     expect(response.body.message).toBe('Description manquante'); // Vérifier que le message d'erreur est correct
  // });
});
