import { ILivre, IEmprunteur, ITransactionEmprunt } from "./interfaces.js";
import { Livre } from "./Livre.js";
import { Emprunteur } from "./Emprunteur.js";
import { TransactionEmprunt } from "./TransactionEmprunt.js";

export class BibliothequeAPI {
  private baseUrl = "http://localhost:3001";

  // Méthodes de conversion
  private jsonToLivre(json: ILivre): Livre {
    const livre = new Livre(json.titre, json.auteur, json.anneePublication);
    livre.id = json.id;
    livre.disponible = json.disponible;
    return livre;
  }

  private async jsonToEmprunteur(json: IEmprunteur): Promise<Emprunteur> {
    const emprunteur = new Emprunteur(json.nom, json.email);
    emprunteur.id = json.id;

    // Récupérer et convertir les livres empruntés
    const livresPromises = json.livresEmpruntes.map((livreId) =>
      this.getLivreById(livreId)
    );

    const livres = await Promise.all(livresPromises);
    const livresValides = livres.filter(
      (livre): livre is Livre => livre !== null
    );

    // Utiliser la nouvelle méthode d'initialisation
    emprunteur.initialiserLivresEmpruntes(livresValides);

    return emprunteur;
  }

  private async createTransactionFromJson(
    json: ITransactionEmprunt
  ): Promise<TransactionEmprunt> {
    const livre = await this.getLivreById(json.livreId);
    const emprunteur = await this.getEmprunteurById(json.emprunteurId);
    if (!livre || !emprunteur)
      throw new Error("Livre ou emprunteur non trouvé");

    const transaction = new TransactionEmprunt(livre, emprunteur);
    transaction.id = json.id;
    return transaction;
  }

  // API Livres
  async getLivres(): Promise<Livre[]> {
    const response = await fetch(`${this.baseUrl}/livres`);
    const data = await response.json();
    return data.map((json: ILivre) => this.jsonToLivre(json));
  }

  async getLivreById(id: number): Promise<Livre | null> {
    const response = await fetch(`${this.baseUrl}/livres/${id}`);
    if (!response.ok) return null;
    const json = await response.json();
    return this.jsonToLivre(json);
  }

  async ajouterLivre(livre: Livre): Promise<Livre> {
    const response = await fetch(`${this.baseUrl}/livres`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(livre.toJSON()),
    });
    const json = await response.json();
    return this.jsonToLivre(json);
  }

  async updateLivre(id: number, livre: Partial<Livre>): Promise<Livre> {
    const response = await fetch(`${this.baseUrl}/livres/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(livre),
    });
    const json = await response.json();
    return this.jsonToLivre(json);
  }

  // API Emprunteurs
  async getEmprunteurs(): Promise<Emprunteur[]> {
    const response = await fetch(`${this.baseUrl}/emprunteurs`);
    const data = await response.json();
    return Promise.all(
      data.map((json: IEmprunteur) => this.jsonToEmprunteur(json))
    );
  }

  async getEmprunteurById(id: number): Promise<Emprunteur | null> {
    const response = await fetch(`${this.baseUrl}/emprunteurs/${id}`);
    if (!response.ok) return null;
    const json = await response.json();
    return this.jsonToEmprunteur(json);
  }

  async ajouterEmprunteur(emprunteur: Emprunteur): Promise<Emprunteur> {
    const response = await fetch(`${this.baseUrl}/emprunteurs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emprunteur.toJSON()),
    });
    const json = await response.json();
    return this.jsonToEmprunteur(json);
  }

  async updateEmprunteur(
    id: number,
    emprunteur: Partial<Emprunteur>
  ): Promise<Emprunteur> {
    // Convertir l'emprunteur en format JSON avant l'envoi
    const emprunteurData = {
      ...(emprunteur.nom && { nom: emprunteur.nom }),
      ...(emprunteur.email && { email: emprunteur.email }),
      ...(emprunteur.livresEmpruntes && {
        livresEmpruntes: emprunteur.livresEmpruntes
          .map((livre) => (typeof livre === "number" ? livre : livre.id))
          .filter((id): id is number => id !== undefined),
      }),
    };

    const response = await fetch(`${this.baseUrl}/emprunteurs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emprunteurData),
    });
    const json = await response.json();
    return this.jsonToEmprunteur(json);
  }

  // API Transactions
  async getTransactions(): Promise<TransactionEmprunt[]> {
    const response = await fetch(`${this.baseUrl}/transactions`);
    const data = await response.json();
    return Promise.all(
      data.map((json: ITransactionEmprunt) =>
        this.createTransactionFromJson(json)
      )
    );
  }

  async ajouterTransaction(
    transaction: TransactionEmprunt
  ): Promise<TransactionEmprunt> {
    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction.toJSON()),
    });
    const json = await response.json();
    return this.createTransactionFromJson(json);
  }

  async retournerLivre(livreId: number, emprunteurId: number): Promise<void> {
    try {
      const livre = await this.getLivreById(livreId);
      const emprunteur = await this.getEmprunteurById(emprunteurId);

      if (!livre || !emprunteur) {
        throw new Error("Livre ou emprunteur non trouvé");
      }

      emprunteur.retournerLivre(livre);

      await Promise.all([
        this.updateLivre(livreId, { disponible: true }),
        this.updateEmprunteur(emprunteurId, {
          livresEmpruntes: emprunteur.livresEmpruntes.map((l) => l.id),
        }),
      ]);
    } catch (error) {
      console.error("Erreur lors du retour du livre:", error);
      throw error;
    }
  }
}
