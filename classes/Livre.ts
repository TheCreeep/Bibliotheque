export class Livre {
    private _id?: number;
    private _titre: string;
    private _auteur: string;
    private _anneePublication: number;
    private _disponible: boolean;

    constructor(titre: string, auteur: string, anneePublication: number) {
        this._titre = titre;
        this._auteur = auteur;
        this._anneePublication = anneePublication;
        this._disponible = true;
    }

    // Getters
    get id(): number | undefined { return this._id; }
    get titre(): string { return this._titre; }
    get auteur(): string { return this._auteur; }
    get anneePublication(): number { return this._anneePublication; }
    get disponible(): boolean { return this._disponible; }

    // Setters
    set id(value: number | undefined) { this._id = value; }
    set titre(value: string) { this._titre = value; }
    set auteur(value: string) { this._auteur = value; }
    set anneePublication(value: number) { this._anneePublication = value; }
    set disponible(value: boolean) { this._disponible = value; }

    // Méthodes
    emprunter(): void {
        if (!this._disponible) {
            throw new Error("Le livre n'est pas disponible");
        }
        this._disponible = false;
    }

    retourner(): void {
        this._disponible = true;
    }

    toJSON() {
        return {
            id: this._id,
            titre: this._titre,
            auteur: this._auteur,
            anneePublication: this._anneePublication,
            disponible: this._disponible
        };
    }
} 