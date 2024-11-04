export interface ILivre {
  id?: number;
  titre: string;
  auteur: string;
  anneePublication: number;
  disponible: boolean;
}

export interface IEmprunteur {
  id?: number;
  nom: string;
  email: string;
  livresEmpruntes: number[];
}

export interface ITransactionEmprunt {
  id?: number;
  livreId: number;
  emprunteurId: number;
  dateEmprunt: string;
  dateRetourPrevue: string;
} 