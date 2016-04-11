import low from 'lowdb'
import storage from 'lowdb/file-sync'

export const db = low('db.json', { storage })
