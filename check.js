const Database = require('better-sqlite3');
const db = new Database('search.db');

const rows = db.prepare('SELECT id, title FROM documents').all();
console.log(rows);