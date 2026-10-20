const Database = require('better-sqlite3');
const db = new Database('search.db');

async function main() {
  const title = "Dog";
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${title}&format=json`;

  const response = await fetch(url);
  const data = await response.json();
  const pages = data.query.pages;
  const page = Object.values(pages)[0];

  const insert = db.prepare(`
    INSERT INTO documents (url, title, body, fetched_at)
    VALUES (?, ?, ?, ?)
  `);

  insert.run(url, page.title, page.extract, new Date().toISOString());

  console.log("saved:", page.title);
}

main();