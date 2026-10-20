const Database = require('better-sqlite3');
const db = new Database('search.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT,
    title TEXT,
    body TEXT,
    fetched_at TEXT
  )
`);

console.log("table ready");