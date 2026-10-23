const database=require('better-sqlite3');
const db = new database('search.db');

const deleteAll = db.prepare('DELETE FROM documents');
deleteAll.run();