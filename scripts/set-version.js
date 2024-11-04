const fs = require('fs');
const path = require('path');
const packageJsonContent = require('../package.json');


const newVersion = process.argv && process.argv.length > 2 ? process.argv[2] : undefined;
if (!newVersion) {
    throw new Error('New version is a required argument\nUsage: node change-app-version <new version>');
}

const nsisSetupScript = path.join(__dirname, '..', 'setup.nsi');

if (!fs.existsSync(nsisSetupScript)) {
    throw new Error('File setup.nsi does not exist.');
}

const wiispoolVersionRegex = /\d+\.\d+(\.\d+)?(#[a-zA-Z0-9\-]+)?/.source;

const nsisContent = fs.readFileSync(nsisSetupScript);
const nsisNewContent = nsisContent.toString()
    .replace(new RegExp(`!define VERSION \\"${wiispoolVersionRegex}\\"`), `!define VERSION "${newVersion}"`);

fs.writeFileSync(nsisSetupScript, nsisNewContent);
console.log('New version written in setup.nsi!');

const packageJsonPath = path.join(__dirname, '..', 'package.json');

packageJsonContent.version = newVersion;
if (packageJsonContent.build?.portable) {
    packageJsonContent.build.portable.artifactName = `Wiispool_v${newVersion}.exe`
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2) + "\n");
console.log('New version written in package.json!');
