# Progress

## Current phase
Phase 1: Data gathering (not started yet)
Phase 0: Foundations is complete (2026-10-21)

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
- Phase 0 finished (2026-10-21):
  - Explained back, in my own words, why an inverted index beats scanning
  - Built the index for 3 tiny documents by hand (with counts) and answered the query "cat dog" (doc 2)
  - Learned how to combine two sorted lists for a multi-word query: one pointer on each list, move the pointer on the smaller number, O(m + n)
  - Did the Git routine myself, and set up README and folder structure

## Decisions
- Language: JavaScript (Node.js)
- Stack stays Node.js + Express + SQLite (not needed yet)
- Repo is public, named Search-Engine, branch `main`

## Concepts learned (explain-back still pending)
- Inverted index: why it beats scanning every document (the index is built once ahead of time, each search is then one lookup)
- Nested structure: `index[word][docId] = count` (word -> box, docId -> slip, count written on it)
- Term frequency: how many times a word appears in one document (needed later for ranking)
- Why each word needs two guards before counting: "does the box exist?" and "does the slip exist?"
- The term is "inverted index" (not "inverse hashing"). It is usually built with a hash table, but hashing is just the tool, not the name
- Returning the page with the most counts is a first idea of ranking, but not always right (long pages say a word more often just by being long). TF-IDF and BM25 fix this later
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
- Still not sure WHEN to use Git in daily work (rule to try: commit when something works or before a risky change, push at end of session)
- Don't fully understand yet what `git add` and the staging area are for

## Open bugs
- none

## Next step (Phase 1: Data gathering)
1. Start small: use Node.js to fetch ONE Wikipedia page through its API and print the title and the text
2. Store that page as a row (url, title, body, fetched_at) in SQLite
3. Then grow to a list of pages, with a polite delay and a clear User-Agent
4. Text cleaning (lowercase, remove punctuation, split into words) comes after, in Phase 2
