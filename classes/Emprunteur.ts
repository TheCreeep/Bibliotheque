import { Livre } from './Livre.js';

export class Emprunteur {
    private _id?: number;
    private _nom: string;
    private _email: string;
    private _livresEmpruntes: Livre[];

    constructor(nom: string, email: string) {
        this._nom = nom;
        this._email = email;
        this._livresEmpruntes = [];
    }

    // Getters
    get id(): number | undefined { return this._id; }
    get nom(): string { return this._nom; }
    get email(): string { return this._email; }
    get livresEmpruntes(): Livre[] { return this._livresEmpruntes; }

    // Setters
    set id(value: number | undefined) { this._id = value; }
    set nom(value: string) { this._nom = value; }
    set email(value: string) { this._email = value; }

    // Nouvelle méthode pour initialiser les livres sans vérification
    initialiserLivresEmpruntes(livres: Livre[]): void {
        this._livresEmpruntes = livres;
    }

    // Méthodes
    emprunterLivre(livre: Livre): void {
        if (this._livresEmpruntes.length >= 3) {
            throw new Error("L'emprunteur a déjà 3 livres empruntés");
        }
        
        // Si le livre est déjà dans la liste des livres empruntés, on ne fait rien
        if (this._livresEmpruntes.some(l => l.id === livre.id)) {
            return;
        }
        
        // Si le livre n'est pas disponible et n'est pas déjà emprunté par cet emprunteur
        if (!livre.disponible) {
            throw new Error("Le livre n'est pas disponible");
        }
        
        livre.emprunter();
        this._livresEmpruntes.push(livre);
    }

    retournerLivre(livre: Livre): void {
        const index = this._livresEmpruntes.findIndex(l => l.id === livre.id);
        if (index === -1) {
            throw new Error("L'emprunteur n'a pas emprunté ce livre");
        }
        livre.retourner();
        this._livresEmpruntes.splice(index, 1);
    }

    // Modifié pour retourner les IDs des livres au lieu des objets Livre
    toJSON() {
        return {
            id: this._id,
            nom: this._nom,
            email: this._email,
            livresEmpruntes: this._livresEmpruntes.map(livre => livre.id || 0)
        };
    }
} 