const Database = require('better-sqlite3');
const db = new Database('search.db');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const titles = [
        "Love", "Cat", "Python (programming language)",
        "Computer", "Internet", "Mathematics",
        "India", "Algorithm", "Database",
        "Operating system", "Electricity", "Music"
    ];

    const insert = db.prepare(`
    INSERT INTO documents (url, title, body, fetched_at)
    VALUES (?, ?, ?, ?)
  `);
    
    for (const title of titles) {
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${title}&format=json`;
        

        await sleep(500);

        const response = await fetch(url);
        const data = await response.json();
        const pages = data.query.pages;
        const page = Object.values(pages)[0];

    
        insert.run(url, page.title, page.extract, new Date().toISOString());

    }


    console.log("saved all documents");
}

main();