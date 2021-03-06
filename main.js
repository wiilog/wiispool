// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

const { ipcMain, dialog,app, BrowserWindow } = require('electron'); // import des modules electron
const  fs  = require('fs'); // besoin du module pour travailler sur les fichiers
const path = require('path'); // besoin du mobule path
const ptp = require("pdf-to-printer"); // besoin de pdf-to-printer
const chokidar = require('chokidar'); // pour le fileWatch

// le dirwath par défaut est le rep de téléchargement de l'utilisateur connecté
let dirwatcher = app.getPath('downloads');
let printers = '';
let defaultprinter = '';

//get all printers of OS
ptp.getPrinters().then((value) => {
  printers = value;
})

//move file and then print
function moveFileAndPrintPdf(oldpath, printer){
  if(oldpath.includes('ETQ')){
  //set the new filepath
  let newpath = app.getPath('appData') + '\\' + app.getName() + '\\' + path.basename(oldpath);
  fs.rename(oldpath, newpath, function(err) {
    if (err) {
      throw err;
    } else {
      //set printer 
      
      let optionsimpression = {
        printer: printer,
        win32: ['-print-settings "landscape"']
      }
      
      //run print
      ptp.print(newpath,optionsimpression)
      //ATTENTION : Il manque la suppression de fichier après impression.
      return newpath
    }
  })}
}

function enableWatchDirectory(directory, printer){
  defaultprinter = printer
  dirwatcher = chokidar.watch(directory, {ignored: /^\./, persistent: true})
  dirwatcher.on('add', path => moveFileAndPrintPdf(path, printer))
  return true
}

//definition d'une fenetre
function createWindow () {
    const win = new BrowserWindow({
      width: 500 ,
      height: 300,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false
      },
      resizable: false,
      minimizable : false,
      maximizable : false,
      autoHideMenuBar: true
    })
  
    win.loadFile('index.html')
    //win.webContents.openDevTools() //ouverture de la console chrome
  }

  //Instanciation de la fenetre
  app.whenReady().then(() => {
    createWindow()
    //On pourrait positionner ici la suppression de tous les PDF sur APPDATA Windows

    //envoi d'une variable
    ipcMain.on('synchronous-message', (event, arg) => {
      event.returnValue = app.getPath("downloads")
    })
  })

  //si toutes les fenetres sont fermées, on ferme l'application
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })
  
  // Processus principal
ipcMain.handle('ipcRwritefile', async (event, directory, printer) => {
  //result = writeFile(someArgument)
  //impressionPDF()
  enableWatchDirectory(directory, printer)
  //return 'ok'
})

//event sur bouton selectdirtowatch 
ipcMain.handle('ipcSelectdir', async (event, someArgument) => {
  const watchdirectory = await dialog.showOpenDialog({properties : ['openDirectory']}).then(result => {
    dirwatcher = result.filePaths[0]
    event.returnValue = result.filePaths[0]
    return result.filePaths[0]
  }).catch(err => {
    //on ne fait rien
  })
  return watchdirectory
})

function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {
        detached: true
      });
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(application.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(application.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      application.quit();
      return true;
  }
}

  
  