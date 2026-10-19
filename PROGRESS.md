# Progress

## Current phase
Phase 0: Foundations (in progress)

## Done
- Understood why an index exists: look a word up in a "notebook" instead of reading every document
- Know that an inverted index maps word -> documents that contain it (like a hash table in C)
- Learned JS basics needed for it: objects as notebooks, `undefined` checks, `split(" ")`, `for` / `for...of` loops, `push`
- Built a working index builder over 2 tiny documents, in JavaScript (this is really Phase 3 work, done early)
- Found and understood a bug: `{ page, freq }` can only remember ONE document per word, so a second document corrupts it

## Decisions
- Language: JavaScript (Node.js)
- Stack stays Node.js + Express + SQLite (not needed yet)

## Concepts learned (explain-back still pending)
- Inverted index: why it beats scanning every document
- Nested structure: `index[word][docId] = count` (word -> box, docId -> slip, count written on it)
- Term frequency: how many times a word appears in one document (needed later for ranking)
- Why each word needs two guards before counting: "does the box exist?" and "does the slip exist?"
- The term is "inverted index" (not "inverse hashing"). It is usually built with a hash table, but hashing is just the tool, not the name

## Shaky / confused
- The nested loop plus the three lines inside it was confusing at first; clear after the line-by-line walkthrough, but worth re-reading before I explain it back
- Intersecting two sorted lists (for multi-word queries) not covered yet

## Open bugs
- none

## Next step
1. Explain in my own words, no code, why an inverted index is faster than scanning (3-4 sentences)
2. Hand-simulate on paper: build the index for 3 tiny documents, then find the documents for the query "cat dog"
3. Set up repo, folder structure and README