/* const notebook={
    dragon : [4,6,9],
    egg : [4,5,8],
    book :[10,12,14]


}

console.log(notebook["book"]);
console.log(notebook["dragon"]);
console.log(notebook["pizza"]); */

/* const sentence='hi my name is mann';
const words = sentence.split(" ");
console.log(words); */

/* const notebook = {};
notebook["cat"] = [];
notebook["cat"].push(0);
notebook["cat"].push(1);

if (notebook["dog"] === undefined) {
    notebook["dog"] = [];

}
console.log(notebook) */


/* const notebook ={};
const DocID=0;
const sentence = "the big brown fox jumped over the fence";

for(const word of sentence.split(" "))
{
    if (notebook[word]===undefined)
    {
        notebook[word]={page:DocID,freq:0};
    }
    notebook[word].freq+=1;
}
console.log(notebook); */



const notebook = {};
const docs = [
  "the big brown fox jumped over the fence",
  "the fox ate the egg",
];

for (let docId = 0; docId < docs.length; docId++) {
  const sentence = docs[docId];

  for (const word of sentence.split(" ")) {
    if (notebook[word] === undefined) {
      notebook[word] = {};
    }
    if (notebook[word][docId] === undefined) {
      notebook[word][docId] = 0;
    }
    notebook[word][docId] += 1;
  }
}

console.log(notebook["fox"]);
console.log(notebook["the"]);