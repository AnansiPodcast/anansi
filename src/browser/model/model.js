const loadElectron = (typeof process.versions['electron'] !== 'undefined')

import low from 'lowdb'
import storage from 'lowdb/file-sync'
if(loadElectron) var app = require('electron').app

const dbPath = (loadElectron) ? app.getPath('appData') + '/db.json' : 'db.json'
export const db = low(dbPath, { storage })
