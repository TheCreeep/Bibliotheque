# Bibliothèque - Système de Gestion de Bibliothèque

## Description
Bibliothèque est un système de gestion développé en TypeScript permettant de suivre les livres, les emprunteurs et les transactions de prêt. Le système offre des fonctionnalités pour gérer les ressources de la bibliothèque et les interactions avec les usagers.

## Structure du Projet
- `classes/`
  - `BibliothequeAPI.ts` - Gestion des opérations API
  - `Emprunteur.ts` - Implémentation de la classe Emprunteur
  - `TransactionEmprunt.ts` - Gestion des transactions de prêt
  - `UIManager.ts` - Gestion de l'interface utilisateur
- `styles/` - Styles CSS
- `db.json` - Fichier de base de données locale
- `index.ts` - Point d'entrée de l'application

## Fonctionnalités
- Gestion des emprunteurs
- Transactions de prêt de livres
- Interface utilisateur pour les opérations
- Intégration de la base de données

## Technologies Utilisées
- TypeScript
- JSON pour le stockage des données
- CSS pour le style

## Prérequis
- Node.js (version 14 ou supérieure)
- npm (généralement installé avec Node.js)

## Pour Commencer

1. **Cloner le projet :**

   ```bash
   git clone <URL_DU_REPOSITORY>
   cd Bibliothèque
   ```

2. **Installer les dépendances :**

   Avant de lancer l'application, vous devez installer les dépendances du projet en utilisant npm.

   ```bash
   npm install
   ```

3. **Démarrer l'application :**

   Pour démarrer l'application, utilisez la commande suivante :

   ```bash
   npm start
   ```

   Cette commande compilera les fichiers TypeScript et lancera un serveur local pour exécuter l'application. Par défaut, l'application est accessible via `http://localhost:3000`.

## Utilisation

- **Ajouter un emprunteur :** Utilisez l'interface pour ajouter un nouvel emprunteur en renseignant les informations demandées (nom, adresse, etc.).
- **Enregistrer un prêt :** Sélectionnez un livre et un emprunteur, puis enregistrez la transaction de prêt via l'interface.
- **Consulter les transactions :** Consultez l'historique des transactions de prêt et de retour.

## Contribution

Les contributions sont les bienvenues ! Si vous souhaitez améliorer le système ou ajouter des fonctionnalités, veuillez suivre les étapes suivantes :
1. Forker le projet.
2. Créer une branche pour votre fonctionnalité (`git checkout -b nouvelle-fonctionnalité`).
3. Committer vos modifications (`git commit -am 'Ajoutez une nouvelle fonctionnalité'`).
4. Pousser votre branche (`git push origin nouvelle-fonctionnalité`).
5. Soumettre une pull request pour révision.

---

Voilà, vous êtes prêt à utiliser et à améliorer le système de gestion de bibliothèque ! 📚🚀
