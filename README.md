# Mise en place d'une nouvelle version de production de Wiispool
1. Pour créer le fichier exe il faut lancer la commande qui permet de build l'application: 
  ```
  yarn sass:compile && electron-builder
  ```
  - Wiispool.exe est disponile dans le dossier dist.

2. Soumettre la vérification sur le site : https://www.microsoft.com/en-us/wdsi/filesubmission et remplir les différents champs. Il faudra attendre que toutes les vérifications soient faites ce qui peut prendre jusqu'à trois jours.

3. Mettre en place la nouvelle release avec Wiispool.exe en fichier joint.


# Signing
1. Generate a self-signed certificate
```shell
New-SelfSignedCertificate -Type Custom -Subject "CN=Wiilog, O=Wiilog, C=FR" -KeyUsage DigitalSignature -FriendlyName "Application founise par Wiilog" -CertStoreLocation "Cert:\CurrentUser\My"
Export-PfxCertificate -cert Cert:\CurrentUser\My\<Certificate Thumbprint> -FilePath <FilePath>.pfx -Password (ConvertTo-SecureString -String "<Password>" -Force -AsPlainText)
```

2. Sing the application
```shell
signtool sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /f "c:\path\to\mycert.pfx" /p pfxpassword "c:\path\to\file.exe"
```
