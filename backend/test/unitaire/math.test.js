const { add, subtract } = require("../../services/math"); // Importation des fonctions à tester

describe("Tests mathématiques", () => {
  test("Addition de 2 + 3 doit retourner 5", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("Soustraction de 5 - 3 doit retourner 2", () => {
    expect(subtract(5, 3)).toBe(2);
  });
});
