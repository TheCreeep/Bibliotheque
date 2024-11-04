import { BibliothequeAPI } from "./classes/BibliothequeAPI.js";
import { UIManager } from "./classes/UIManager.js";
import { Livre } from "./classes/Livre.js";
import { Emprunteur } from "./classes/Emprunteur.js";
import { TransactionEmprunt } from "./classes/TransactionEmprunt.js";

class Bibliotheque {
  private api: BibliothequeAPI;
  private uiManager: UIManager;

  constructor() {
    this.api = new BibliothequeAPI();
    this.uiManager = new UIManager(this.api);
    this.initialiserInterface();
  }

  private async initialiserInterface() {
    this.attacherEvenements();
    await this.mettreAJourAffichage();
  }

  private attacherEvenements() {
    this.attacherEvenementFormulaireLivre();
    this.attacherEvenementFormulaireEmprunteur();
    this.attacherEvenementRecherche();
  }

  private attacherEvenementFormulaireLivre() {
    const formLivre = document.getElementById("form-livre") as HTMLFormElement;
    formLivre?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const titre = (document.getElementById("titre") as HTMLInputElement).value;
      const auteur = (document.getElementById("auteur") as HTMLInputElement).value;
      const annee = parseInt((document.getElementById("annee") as HTMLInputElement).value);

      // Création d'une nouvelle instance de Livre
      const nouveauLivre = new Livre(titre, auteur, annee);
      await this.api.ajouterLivre(nouveauLivre);

      formLivre.reset();
      await this.mettreAJourAffichage();
    });
  }

  private attacherEvenementFormulaireEmprunteur() {
    const formEmprunteur = document.getElementById("form-emprunteur") as HTMLFormElement;
    formEmprunteur?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nom = (document.getElementById("nom") as HTMLInputElement).value;
      const email = (document.getElementById("email") as HTMLInputElement).value;

      // Création d'une nouvelle instance d'Emprunteur
      const nouvelEmprunteur = new Emprunteur(nom, email);
      await this.api.ajouterEmprunteur(nouvelEmprunteur);

      formEmprunteur.reset();
      await this.mettreAJourAffichage();
    });
  }

  private attacherEvenementRecherche() {
    const recherche = document.getElementById("recherche") as HTMLInputElement;
    recherche?.addEventListener("input", async (e) => {
      const terme = (e.target as HTMLInputElement).value.toLowerCase();
      const livres = await this.api.getLivres();
      const resultats = livres.filter(
        (livre) =>
          livre.titre.toLowerCase().includes(terme) ||
          livre.auteur.toLowerCase().includes(terme)
      );
      this.uiManager.afficherLivres(resultats);
    });
  }

  private async mettreAJourAffichage() {
    const [livres, emprunteurs, transactions] = await Promise.all([
      this.api.getLivres(),
      this.api.getEmprunteurs(),
      this.api.getTransactions()
    ]);

    await Promise.all([
      this.uiManager.afficherLivres(livres),
      this.uiManager.afficherEmprunteurs(emprunteurs),
      this.uiManager.afficherTransactions(transactions)
    ]);
  }

  async emprunterLivre(livreId: number) {
    const select = document.querySelector(
      `select[data-livre-id="${livreId}"]`
    ) as HTMLSelectElement;
    if (!select || !select.value) {
      console.log("Veuillez sélectionner un emprunteur");
      return;
    }

    try {
      const emprunteurId = parseInt(select.value);
      const livre = await this.api.getLivreById(livreId);
      const emprunteur = await this.api.getEmprunteurById(emprunteurId);

      if (!livre || !emprunteur) {
        throw new Error("Livre ou emprunteur non trouvé");
      }

      // Utilisation des méthodes de classe
      emprunteur.emprunterLivre(livre);
      
      // Création d'une nouvelle transaction
      const transaction = new TransactionEmprunt(livre, emprunteur);
      
      // Mise à jour de la base de données
      await Promise.all([
        this.api.updateLivre(livreId, livre),
        this.api.updateEmprunteur(emprunteurId, emprunteur),
        this.api.ajouterTransaction(transaction)
      ]);

      await this.mettreAJourAffichage();
      console.log("Livre emprunté avec succès!");
    } catch (error) {
      console.error("Erreur lors de l'emprunt:", error);
    }
  }

  async retournerLivre(livreId: number, emprunteurId: number) {
    try {
      await this.api.retournerLivre(livreId, emprunteurId);
      await this.mettreAJourAffichage();
      console.log("Livre retourné avec succès!");
    } catch (error) {
      console.error("Erreur lors du retour:", error);
    }
  }
}

// Initialisation et fonctions globales
(window as any).emprunterLivre = async (livreId: number) => {
  const bibliotheque = (window as any).bibliothequeInstance;
  await bibliotheque.emprunterLivre(livreId);
};

(window as any).retournerLivre = async (livreId: number, emprunteurId: number) => {
  const bibliotheque = (window as any).bibliothequeInstance;
  await bibliotheque.retournerLivre(livreId, emprunteurId);
};

(window as any).modifierEmprunteur = async (emprunteurId: number) => {
  const bibliotheque = (window as any).bibliothequeInstance;
  const emprunteur = await bibliotheque.api.getEmprunteurById(emprunteurId);
  if (emprunteur) {
    await bibliotheque.uiManager.afficherFormulaireModification(emprunteur);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  (window as any).bibliothequeInstance = new Bibliotheque();
});
