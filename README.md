# Mise en place d'une nouvelle version de production de Wiispool
1. Pour créer le fichier exe il faut lancer la commande qui permet de build l'application: 
  ```
  yarn sass:compile && electron-builder
  ```
  - Wiispool.exe est disponile dans le dossier dist.

2. Soumettre la vérification sur le site : https://www.microsoft.com/en-us/wdsi/filesubmission et remplir les différents champs. Il faudra attendre que toutes les vérifications soient faites ce qui peut prendre jusqu'à trois jours.

3. Mettre en place la nouvelle release avec Wiispool.exe en fichier joint.
