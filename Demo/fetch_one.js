async function main() {
    const url = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=Dog&format=json';
    const response = await fetch(url);
    const data = await response.json();
    const pages = data.query.pages;
    const page = Object.values(pages)[0];
    console.log(page.extract);
    
}

main();