import low from 'lowdb'
import storage from 'lowdb/file-sync'
import {app} from 'electron'

export const db = low(app.getPath('appData') + '/db.json', { storage })
