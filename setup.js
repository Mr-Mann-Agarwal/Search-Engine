const Database = require('better-sqlite3');
const db = new Database('search.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT,
    title TEXT UNIQUE,
    body_saved INTEGER DEFAULT 0,
    body TEXT,
    links_saved INTEGER DEFAULT 0,
    fetched_at TEXT
  )
`);

console.log("table ready");