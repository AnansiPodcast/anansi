import levelup from 'levelup'
import leveldown from 'leveldown'

const loadElectron = (typeof process.versions['electron'] !== 'undefined')
if(loadElectron) var app = require('electron').app
const dbPath = (loadElectron) ? app.getPath('appData') + '/podcast-desktop/db' : 'db'

var db = levelup(dbPath, {
  db: leveldown,
  keyEncoding: 'json'
});

module.exports = db
