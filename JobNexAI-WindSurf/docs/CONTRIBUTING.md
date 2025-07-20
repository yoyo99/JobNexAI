# Comment Contribuer à JobNexAI-WindSurf

Nous sommes ravis que vous souhaitiez contribuer à JobNexAI-WindSurf ! Ce guide vous aidera à démarrer.

## Canaux de Communication

*   **Issues GitHub :** Pour les rapports de bugs, les demandes de fonctionnalités ou les questions.
*   **Discussions (si activé) :** Pour des échanges plus généraux.

## Comment Signaler un Bug

*   Assurez-vous que le bug n'a pas déjà été signalé en cherchant dans les [Issues GitHub](https://github.com/yoyo99/JobNexAI-WindSurf/issues).
*   Si ce n'est pas le cas, ouvrez une nouvelle issue. Incluez une description claire et concise, les étapes pour reproduire le bug, et le comportement attendu versus le comportement réel.

## Proposer des Améliorations ou des Fonctionnalités

*   Ouvrez une issue en décrivant clairement votre proposition et sa valeur ajoutée pour le projet.
*   Nous pourrons discuter de la faisabilité et de l'intégration de votre idée.

## Processus de Développement

1.  **Forkez le dépôt** sur votre propre compte GitHub.
2.  **Clonez votre fork** en local : `git clone https://github.com/VOTRE_NOM_UTILISATEUR/JobNexAI-WindSurf.git`
3.  **Créez une branche** pour votre contribution :
    *   Pour les fonctionnalités : `git checkout -b feature/nom-de-la-fonctionnalite`
    *   Pour les corrections de bugs : `git checkout -b fix/description-du-bug`
4.  **Effectuez vos modifications.** Assurez-vous de suivre les conventions de style du projet (nous utiliserons Prettier et ESLint, configurations à venir/à préciser).
5.  **Testez vos modifications** (des instructions sur les tests seront ajoutées ici).
6.  **Commitez vos changements** avec des messages de commit clairs et descriptifs. Nous suivons la convention [Conventional Commits](https://www.conventionalcommits.org/) (par exemple : `feat: add user login` ou `fix: resolve issue with form validation`).
7.  **Poussez votre branche** vers votre fork : `git push origin feature/nom-de-la-fonctionnalite`
8.  **Ouvrez une Pull Request (PR)** depuis votre branche vers la branche `main` (ou `develop` si nous en utilisons une) du dépôt original `yoyo99/JobNexAI-WindSurf`.
    *   Donnez un titre clair à votre PR.
    *   Décrivez les changements que vous avez apportés et pourquoi. Liez l'issue correspondante si applicable (ex: "Closes #123").

## Conventions de Code

*   **Langage :** TypeScript, React
*   **Style :** Suivre les configurations ESLint et Prettier du projet. (Pensez à exécuter `npm run lint` et `npm run format` avant de commiter).
*   **Commentaires :** Commentez votre code lorsque la logique n'est pas évidente.

## Revue de Code

*   Toutes les contributions seront revues avant d'être fusionnées.
*   Soyez ouvert aux commentaires et prêt à apporter des modifications si nécessaire.

Merci pour votre contribution !
