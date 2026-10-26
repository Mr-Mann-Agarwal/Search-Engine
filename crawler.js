const database = require('better-sqlite3');
const db = new database('search.db');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const prepareTitle = db.prepare('SELECT id FROM documents WHERE title = ?');
const checkBody = db.prepare('SELECT body_saved FROM documents WHERE title = ?');
const checkLinks = db.prepare('SELECT links_saved FROM documents WHERE title = ?');

function bodySaved(title) {
  const row = checkBody.get(title);
  return row !== undefined && row.body_saved === 1;
}

function linkssaved(title)
{
   const row = checkLinks.get(title);
    return row !== undefined && row.links_saved === 1;
}

async function response(url) {
  const response = await fetch(url,{
    headers:{
            "User-Agent": "MannSearchEngine/1.0 (https://github.com/Mr-Mann-Agarwal/Search-Engine)"

    }
  })
  return response.json();
}


function titleExists(title) {
  const existing = prepareTitle.get(title);
  return !!existing;
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
    const queue = ['Love'];
    const visited = new Set();

    //const savedcount  idk


    


    const insert = db.prepare(`
    INSERT OR IGNORE INTO documents (url, title,body_saved, body, links_saved ,fetched_at)
    VALUES (?, ?, ? ,? ,? ,?)
    `);

    const marksLinkdone =db.prepare('UPDATE documents SET links_saved = 1 WHERE title = ?');


    while(queue.length >0||visited.size <200)
    {
        const title = queue.shift();
        const titleURL = `https://en.wikipedia.org/w/api.php?action=query&prop=links&titles=${encodeURIComponent(title)}&pllimit=10&plnamespace=0&format=json`;

        if(bodysaved(title)===false)
        {
            const data =await response(titleURL);
            if(data.query.pages==undefined)
            {
                console.log(`No links found for ${title}`);
                continue;
            }

            const pages = data.query.pages;
            const page = Object.values(pages)[0];


            //url, title,body_saved, body, links_saved ,fetched_at
            insert.run(titleURL,title,1,page.extract,0,new Date().toISOString());


        }

        if(linkssaved(title)===false)
        {

        }



    }









}