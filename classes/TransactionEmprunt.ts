import { Livre } from './Livre.js';
import { Emprunteur } from './Emprunteur.js';

export class TransactionEmprunt {
    private _id?: number;
    private _livre: Livre;
    private _emprunteur: Emprunteur;
    private _dateEmprunt: Date;
    private _dateRetourPrevue: Date;

    constructor(livre: Livre, emprunteur: Emprunteur) {
        this._livre = livre;
        this._emprunteur = emprunteur;
        this._dateEmprunt = new Date();
        this._dateRetourPrevue = new Date();
        this._dateRetourPrevue.setDate(this._dateEmprunt.getDate() + 14); // +14 jours
    }

    // Getters
    get id(): number | undefined { return this._id; }
    get livre(): Livre { return this._livre; }
    get emprunteur(): Emprunteur { return this._emprunteur; }
    get dateEmprunt(): Date { return this._dateEmprunt; }
    get dateRetourPrevue(): Date { return this._dateRetourPrevue; }

    // Setters
    set id(value: number | undefined) { this._id = value; }

    toJSON() {
        return {
            id: this._id,
            livreId: this._livre.id,
            emprunteurId: this._emprunteur.id,
            dateEmprunt: this._dateEmprunt.toISOString(),
            dateRetourPrevue: this._dateRetourPrevue.toISOString()
        };
    }
} 