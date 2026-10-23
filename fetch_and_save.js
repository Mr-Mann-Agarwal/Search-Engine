const Database = require('better-sqlite3');
const db = new Database('search.db');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getlinks(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=links&titles=${encodeURIComponent(title)}&pllimit=10&plnamespace=0&format=json`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "MannSearchEngine/1.0 (https://github.com/Mr-Mann-Agarwal/Search-Engine)"
    }
  });
  const data = await response.json();
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  
  if(page.links === undefined) {
    console.log(`No links found for ${title}`);
    return [];
  }
  return page.links.map(link => link.title);

}

async function main() {
  const titles = [
    "Love", "Cat", "Python (programming language)",
    "Computer", "Internet", "Mathematics",
    "India", "Algorithm", "Database",
    "Operating system", "Electricity", "Music"
  ];

  const insert = db.prepare(`
    INSERT OR IGNORE INTO documents (url, title, body, fetched_at)
    VALUES (?, ?, ?, ?)
  `);

  for (const title of titles) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${title}&format=json`;


    await sleep(500);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "MannSearchEngine/1.0 (https://github.com/Mr-Mann-Agarwal/Search-Engine)"
      }
    });
    const data = await response.json();
    const pages = data.query.pages;
    const page = Object.values(pages)[0];

    for(const linkTitle of await getlinks(title)) {
      const linkUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(linkTitle)}&format=json`;

      await sleep(250);
      const  linkresponse= await fetch(linkUrl,{
        headers: {
          "User-Agent": "MannSearchEngine/1.0 (https://github.com/Mr-Mann-Agarwal/Search-Engine)"
        }

      });

      const linkdata=await linkresponse.json();
      const linkpages=linkdata.query.pages;
      const linkpage=Object.values(linkpages)[0];

      insert.run(linkUrl, linkpage.title, linkpage.extract, new Date().toISOString());




    }


    insert.run(url, page.title, page.extract, new Date().toISOString());

  }


  console.log("saved all documents");
}

main();