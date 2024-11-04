# Wiispool
An automatic PDF file printing application
All this project is only compatible with windows.

## Setup and available npm commands

### Install dependencies
```sh
npm install
```

###  Run Wiispool in foreground
```sh
npm run start
```

### Run Wiispool in background
```sh
npm run start:background
```

### Generate wiispool exe
It will generate file: `dist/wiispool.exe`
```sh
npm run build
```

### Change wiispool version in config files
Set new version in `package.json` and `setup.nsi`
```sh
npm run set-version 3.1.1
```

## Generate wiispool installer
### 1. Generate exe before
[See](#generate-wiispool-exe)

### 2. Generate installer with NSIS
* Install and download NSIS: https://nsis.sourceforge.io/Main_Page
* Via windows file browser right-click on `/setup.nsi` file and click on `Compile NSIS Script` option
* A new file setup will be generated in `dist/` directory: Wiispool_[version]_Setup.exe

### 3. Sign app

TODO WIIS-12007

### 4. Upload Wiispool two executable files on release
* `Wiispool_v[version].exe`
* `Wiispool_v[version]_Setup.exe`

## [OLD - deprecated] Generate wiispool installer with self-signed certificate

### Submit all the two exe to microsoft appeal
Fill the form: https://www.microsoft.com/en-us/wdsi/filesubmission. Validation may take up to three days.

### Sign all exe
Fill the form: https://www.microsoft.com/en-us/wdsi/filesubmission. Validation may take up to three days.

1. Generate a self-signed certificate

```shell
New-SelfSignedCertificate -Type Custom -Subject "CN=Wiilog, O=Wiilog, C=FR" -KeyUsage DigitalSignature -FriendlyName "Application founise par Wiilog" -CertStoreLocation "Cert:\CurrentUser\My"
Export-PfxCertificate -cert Cert:\CurrentUser\My\<Certificate Thumbprint> -FilePath <FilePath>.pfx -Password (ConvertTo-SecureString -String "<Password>" -Force -AsPlainText)
```

2. Sign the application
```shell
signtool sign /tr http://timestamp.digicert.com /td sha256 /fd sha256 /f "c:\path\to\mycert.pfx" /p pfxpassword "c:\path\to\file.exe"
```

### Generate exe before
[See](#generate-wiispool-exe)

### Generate installer with NSIS
[see](#2-generate-installer-with-nsis)

## Requirements
* Windows system
* Node 20.14
* NSIS 3.10

