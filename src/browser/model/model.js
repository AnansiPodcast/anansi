const loadElectron = typeof process.versions.electron !== 'undefined'

import low from 'lowdb'
import storage from 'lowdb/file-sync'
let app
if(loadElectron) app = require('electron').app

const dbPath = loadElectron ? `${app.getPath('appData')}/${app.getName()}/db.json` : 'db.json'
export const db = low(dbPath, { storage })
