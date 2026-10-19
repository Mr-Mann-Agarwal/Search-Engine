# Progress

## Current phase
Phase 0: Foundations (in progress)

## Done
- Understood why an index exists: look a word up in a "notebook" instead of reading every document
- Know that an inverted index maps word -> documents that contain it (like a hash table in C)
- Learned JS basics needed for it: objects as notebooks, `undefined` checks, `split(" ")`, `for` / `for...of` loops, `push`
- Built a working index builder over 2 tiny documents, in JavaScript (this is really Phase 3 work, done early)
- Found and understood a bug: `{ page, freq }` can only remember ONE document per word, so a second document corrupts it
- Git set up (2026-10-20): installed (2.53), set my name and email, ran `git init` in `D:\Projects\coding\Search Engine`
- Made 2 commits on my laptop, using the loop: add, commit
- Created a public GitHub repo: https://github.com/Mr-Mann-Agarwal/Search-Engine
- Connected my folder to it (`git remote add origin ...`) and pushed my commits (branch `main`)

## Decisions
- Language: JavaScript (Node.js)
- Stack stays Node.js + Express + SQLite (not needed yet)
- Repo is public, named Search-Engine, branch `main`

## Concepts learned (explain-back still pending)
- Inverted index: why it beats scanning every document
- Nested structure: `index[word][docId] = count` (word -> box, docId -> slip, count written on it)
- Term frequency: how many times a word appears in one document (needed later for ranking)
- Why each word needs two guards before counting: "does the box exist?" and "does the slip exist?"
- The term is "inverted index" (not "inverse hashing"). It is usually built with a hash table, but hashing is just the tool, not the name
- Git = a program on my laptop that saves snapshots of my project (works offline)
- GitHub = a website that keeps an online copy of those snapshots (backup + shows my work)
- `git add .` picks the files, `git commit -m "note"` makes the save on my laptop
- `git push` sends my saves to GitHub. Commit alone does NOT put anything on GitHub

## Git cheat sheet (my routine)
1. `git status`: what changed since the last save?
2. `git add .`: pick the files to save
3. `git commit -m "short note"`: save on my laptop
4. `git push`: send the saves to GitHub
- `git log`: see all my saves (press `q` to exit)
- Commit often (small saves). Push at the end of each work session.

## Shaky / confused
- The nested loop plus the three lines inside it was confusing at first; clear after the line-by-line walkthrough, but worth re-reading before I explain it back
- Intersecting two sorted lists (for multi-word queries) not covered yet
- Still not sure WHEN to use Git in daily work (rule to try: commit when something works or before a risky change, push at end of session)
- Don't fully understand yet what `git add` and the staging area are for

## Open bugs
- none

## Next step
1. Explain in my own words, no code, why an inverted index is faster than scanning (3-4 sentences)
2. Hand-simulate on paper: build the index for 3 tiny documents, then find the documents for the query "cat dog"
3. After my next change to `Demo/index.js`, do the 4-command Git routine myself and check GitHub
4. Write a README and set up folder structure (later, small)