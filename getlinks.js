async function main() {
  const url = "https://en.wikipedia.org/w/api.php?action=query&prop=links&titles=Dog&pllimit=50&plnamespace=0&format=json";

  const response = await fetch(url, {
    headers: {
      "User-Agent": "MannSearchEngine/1.0 (https://github.com/Mr-Mann-Agarwal/Search-Engine)"
    }
  });
  const data = await response.json();
  const pages = data.query.pages;
  const page = Object.values(pages)[0];

  console.log(page.links);
}

main();