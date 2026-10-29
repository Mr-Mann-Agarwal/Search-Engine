const Database = require('better-sqlite3');
const db = new Database('search.db');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const prepareTitle = db.prepare('SELECT id FROM documents WHERE title = ?');
function titleExists(title) {
  const existing = prepareTitle.get(title);
  if(existing) {
    return true;
  }
  else {
    return false;
  }
}

async function response(url) {
  const response = await fetch(url,{
    headers:{
            "User-Agent": "MannSearchEngine/1.0 (https://github.com/Mr-Mann-Agarwal/Search-Engine)"

    }
  })
  return response.json();
}

async function getlinks(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=links&queue=${encodeURIComponent(title)}&pllimit=10&plnamespace=0&format=json`;

  const data = await response(url);
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  
  if(page.links === undefined) {
    console.log(`No links found for ${title}`);
    return [];
  }
  return page.links.map(link => link.title);

}

async function main() {
  const queue = [
    "Love", "Cat", "Python (programming language)",
    "Computer", "Internet", "Mathematics",
    "India", "Algorithm", "Database",
    "Operating system", "Electricity", "Music"
  ];

  const visited = new Set(["Love", "Cat", "Python (programming language)",
    "Computer", "Internet", "Mathematics",
    "India", "Algorithm", "Database",
    "Operating system", "Electricity", "Music"]);

  const insert = db.prepare(`
    INSERT OR IGNORE INTO documents (url, title,body_saved, body, links_saved ,fetched_at)
    VALUES (?, ?, ? ,? ,? ,?)
  `);

  const marksLinkdone =db.prepare('UPDATE documents SET links_saved = 1 WHERE title = ?');


  for (const title of queue) {
    if(titleExists(title)) {
      console.log(`Skipping ${title} as it already exists in the database`);
      continue;
    }
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&queue=${encodeURIComponent(title)}&format=json`;



    await sleep(200);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "MannSearchEngine/1.0 (https://github.com/Mr-Mann-Agarwal/Search-Engine)"
      }
    });
    const data = await response.json();
    if (data.query.pages === undefined) {
      insert.run(url,title,0,null,0,new Date().toISOString());
      console.log(`No data found for ${title}`);
      continue;
    }
    const pages = data.query.pages;
    const page = Object.values(pages)[0];
    //(url, title,body_saved, body, links_saved ,fetched_at)
    insert.run(url, page.title,1, page.extract,0, new Date().toISOString());






    for(const linkTitle of await getlinks(title)) {

       if(visited.has(linkTitle))
      {
        console.log(`Skipping ${linkTitle} as it already exists in the database`);
        continue;
      } 

      if(titleExists(linkTitle)) {
        console.log(`Skipping ${linkTitle} as it already exists in the database`);
        continue;
      }

      const linkUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&queue=${encodeURIComponent(linkTitle)}&format=json`;

      await sleep(200);
      const  linkresponse= await fetch(linkUrl,{
        headers: {
          "User-Agent": "MannSearchEngine/1.0 (https://github.com/Mr-Mann-Agarwal/Search-Engine)"
        }

      });

      const linkdata=await linkresponse.json();
      if (linkdata.query.pages === undefined) {
        insert.run(linkUrl,linkTitle,null,null,0,new Date().toISOString());
        console.log(`No data found for ${linkTitle}`);
        continue;
      }
      const linkpages=linkdata.query.pages;
      const linkpage=Object.values(linkpages)[0];

      //(url, title,body_saved, body, links_saved ,fetched_at)

      insert.run(linkUrl, linkpage.title, 1,linkpage.extract, 0,new Date().toISOString());




    }

          //(url, title,body_saved, body, links_saved ,fetched_at)
      marksLinkdone.run(title);


  }


  console.log("saved all documents");
}

main();