import { BibliothequeAPI } from "./BibliothequeAPI.js";
import { Livre } from "./Livre.js";
import { Emprunteur } from "./Emprunteur.js";
import { TransactionEmprunt } from "./TransactionEmprunt.js";

export class UIManager {
  constructor(private api: BibliothequeAPI) {}

  async afficherLivres(livres: Livre[]) {
    const listeLivres = document.getElementById("liste-livres");
    if (!listeLivres) return;

    const emprunteurs = await this.api.getEmprunteurs();

    listeLivres.innerHTML = livres
      .map((livre) => {
        const emprunteur = emprunteurs.find(emp => 
          emp.livresEmpruntes.some(l => l.id === livre.id)
        );

        let statutText = "Disponible";
        if (!livre.disponible && emprunteur) {
            statutText = `Emprunté par ${emprunteur.nom}`;
        } else if (!livre.disponible) {
            statutText = "Emprunté";
        }

        return `
            <div class="item ${livre.disponible ? "disponible" : "emprunte"}">
                <h3>${livre.titre}</h3>
                <p>Auteur: ${livre.auteur}</p>
                <p>Année: ${livre.anneePublication}</p>
                <p>Statut: ${statutText}</p>
                ${
                  livre.disponible
                    ? `
                    <div class="actions">
                        <select class="emprunteur-select" data-livre-id="${livre.id}">
                            <option value="">Sélectionner un emprunteur</option>
                        </select>
                        <button onclick="emprunterLivre(${livre.id})" class="btn-emprunter">
                            Emprunter
                        </button>
                    </div>
                `
                    : ""
                }
            </div>
        `;
      })
      .join("");

    await this.remplirSelecteursEmprunteurs();
  }

  async afficherEmprunteurs(emprunteurs: Emprunteur[]) {
    const listeEmprunteurs = document.getElementById("liste-emprunteurs");
    if (!listeEmprunteurs) return;

    listeEmprunteurs.innerHTML = emprunteurs
      .map((emprunteur) => {
        const livresEmpruntes = emprunteur.livresEmpruntes;

        return `
          <div class="item">
              <div class="emprunteur-header">
                <h3>${emprunteur.nom}</h3>
                <button 
                  onclick="modifierEmprunteur(${emprunteur.id})" 
                  class="btn-modifier">
                  Modifier
                </button>
              </div>
              <p>Email: ${emprunteur.email}</p>
              <p>Livres empruntés: ${livresEmpruntes.length}/3</p>
              ${this.genererListeLivresEmpruntes(livresEmpruntes, emprunteur.id)}
          </div>
        `;
      })
      .join("");
  }

  async afficherFormulaireModification(emprunteur: Emprunteur) {
    const dialog = document.createElement('dialog');
    dialog.className = 'modal';
    
    dialog.innerHTML = `
      <form id="form-modifier-emprunteur">
        <h2>Modifier l'emprunteur</h2>
        <div class="form-group">
          <label for="nom-modif">Nom</label>
          <input 
            type="text" 
            id="nom-modif" 
            value="${emprunteur.nom}" 
            required 
          />
        </div>
        <div class="form-group">
          <label for="email-modif">Email</label>
          <input 
            type="email" 
            id="email-modif" 
            value="${emprunteur.email}" 
            required 
          />
        </div>
        <div class="button-group">
          <button type="submit" class="btn-save">Enregistrer</button>
          <button type="button" class="btn-cancel">Annuler</button>
        </div>
      </form>
    `;

    document.body.appendChild(dialog);
    dialog.showModal();

    const form = dialog.querySelector('form');
    const btnCancel = dialog.querySelector('.btn-cancel');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nomModif = (document.getElementById('nom-modif') as HTMLInputElement).value;
      const emailModif = (document.getElementById('email-modif') as HTMLInputElement).value;

      try {
        await this.api.updateEmprunteur(emprunteur.id!, {
          nom: nomModif,
          email: emailModif
        });
        dialog.close();
        location.reload(); // Recharger la page pour voir les modifications
      } catch (error) {
        console.error("Erreur lors de la modification:", error);
      }
    });

    btnCancel?.addEventListener('click', () => {
      dialog.close();
    });
  }

  private genererListeLivresEmpruntes(livresEmpruntes: Livre[], emprunteurId: number | undefined) {
    if (livresEmpruntes.length === 0) return "<p>Aucun livre emprunté</p>";

    return `
      <div class="livres-empruntes">
          <h4>Livres actuellement empruntés:</h4>
          <ul>
              ${livresEmpruntes
                .map(
                  (livre) => `
                  <li>
                      <span class="livre-info">${livre.titre} (${livre.auteur})</span>
                      <button 
                          onclick="retournerLivre(${livre.id}, ${emprunteurId})" 
                          class="btn-retour">
                          Retourner
                      </button>
                  </li>
              `
                )
                .join("")}
          </ul>
      </div>
    `;
  }

  async afficherTransactions(transactions: TransactionEmprunt[]) {
    const listeTransactions = document.getElementById("liste-transactions");
    if (!listeTransactions) return;

    const transactionsTriees = [...transactions].sort(
      (a, b) =>
        new Date(b.dateEmprunt).getTime() - new Date(a.dateEmprunt).getTime()
    );

    listeTransactions.innerHTML = transactionsTriees
      .map((transaction) => {
        return `
          <div class="item">
              <p>Livre: ${transaction.livre.titre}</p>
              <p>Emprunteur: ${transaction.emprunteur.nom}</p>
              <p>Date d'emprunt: ${transaction.dateEmprunt.toLocaleDateString()}</p>
              <p>Date de retour prévue: ${transaction.dateRetourPrevue.toLocaleDateString()}</p>
          </div>
        `;
      })
      .join("");
  }

  private async remplirSelecteursEmprunteurs() {
    const emprunteurs = await this.api.getEmprunteurs();
    const selects = document.querySelectorAll(".emprunteur-select");

    selects.forEach((select) => {
      emprunteurs.forEach((emprunteur) => {
        if (emprunteur.livresEmpruntes.length < 3) {
          const option = document.createElement("option");
          option.value = emprunteur.id?.toString() || "";
          option.textContent = emprunteur.nom;
          select.appendChild(option);
        }
      });
    });
  }
}
