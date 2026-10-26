# Progress

## Current phase
Phase 1: Data gathering (in progress, started 2026-10-21)
Phase 0: Foundations is complete (2026-10-21)

## Phase 1 status
- [x] Fetch ONE Wikipedia page from Node and print title + text
- [x] Store a page as a row (url, title, body, fetched_at) in SQLite
- [x] Loop over a list of titles (12 hardcoded) with a polite delay
- [x] Set a clear User-Agent header
- [x] Stop duplicate rows on re-run (UNIQUE column + INSERT OR IGNORE)
- [x] Get a page's links from the Wikipedia API (`prop=links`)
- [x] Fetch + save seed titles plus their depth-1 links (128 pages saved)
- [ ] Visited check before fetching (titleExists() written, has one SQL bug left to fix; not yet wired into fetchAndSave)
- [ ] Turn this into a real queue + visited set + depth limit (currently depth 1 only, hardcoded)
- [ ] Error handling (one bad fetch currently crashes the whole run)
- [ ] Fix the `url` column to store the real article URL, not the API request URL
- [ ] robots.txt check
- [ ] Grow to ~500+ pages
- [ ] Explain the whole fetch -> links -> queue -> save flow back, before closing Phase 1

## Done (Phase 0, summary)
- Inverted index idea, built an index builder over 2 tiny docs in JS, understood the one-document-per-word bug
- Git + GitHub set up; routine is status, add, commit, push
- Repo: https://github.com/Mr-Mann-Agarwal/Search-Engine (public, branch `main`)

## Done (Phase 1, 2026-10-21 session)
- Fetched a page through the Wikipedia API with `fetch`. JSON shape is `data.query.pages.<pageId>.{title, extract}`
- Used `Object.values(pages)[0]` to get the page without knowing its numeric id
- Built the URL with a template literal: `...&titles=${title}&format=json`
- Installed `better-sqlite3`. SQLite is just one file (`search.db`) on my laptop
- Created `.gitignore` with `search.db` in it. Reason: db is generated data, anyone can rebuild it by running the crawler
- Hit Wikipedia's "too many requests" error when looping fast. Fixed with a `sleep(500)` helper between requests
- 12 pages saved and verified in `search.db` in the first pass

## Done (Phase 1, 2026-10-22/23 session)
- Added a `User-Agent` header to all fetches (name + contact, required by Wikipedia's bot etiquette)
- Made `title` column `UNIQUE` in `setup.js`, changed insert to `INSERT OR IGNORE`, confirmed re-running the script no longer duplicates rows
- Learned `AUTOINCREMENT` keeps counting even after rows are deleted (ids don't reset to 1, and that's fine, ids only need to be unique)
- Used `prop=links&plnamespace=0` on the Wikipedia API to get a page's outgoing links (title only, no URL -- a "link" on Wikipedia is just another title)
- Wrote `getlinks(title)` returning an array of link titles via `page.links.map(link => link.title)`
- Refactored the fetch+parse+insert steps into one function, `fetchAndSave(title)`, instead of repeating the logic for the seed and for each link (was copy-pasting it 2-3 times before this)
- Pulled `USER_AGENT` and `insert` out to one shared definition instead of redefining per function/call
- Added `encodeURIComponent(title)` when building URLs, since link titles can contain `&`, spaces, parentheses
- Ran seed titles (12) + their depth-1 links (`pllimit` tested small first, then raised) -> 128 total pages saved, no crash
- Debugged a run of real mistakes: wrong variable name (`linkurl` vs `linkUrl`), wrong capitalization (`object.values` vs `Object.values`), missing `await` + using the wrong response variable (`response.json()` instead of `linkresponse.json()`) -- found and fixed by re-reading the working version of the same line elsewhere in the file
- Confirmed math-before-running habit: estimated ~128 pages and ~70s runtime before executing, actual run matched

## Done (Phase 1, 2026-10-24/25 session -- start of visited check)
- Learned `.map(fn)`: transforms an array into a new array, one item in -> one item out, same idea as a manual `for` loop that pushes into a new array (O(n))
- Learned `.get(title)` on a prepared SELECT: runs the query filled with `title`, returns one row object if found, or `undefined` if not -- same idea as a hash table lookup, since `title` is `UNIQUE`
- Learned `!` (not) flips truthy/falsy, and `!!x` flips twice to get a clean `true`/`false` -- optional shorthand, `if/else` does the same thing
- Wrote first draft of `titleExists(title)`, had a real bug: `SELECT FROM documents` is invalid SQL, missing the column list (needs `SELECT id FROM documents WHERE title = ?`)
- Noted a naming convention gap: function was named `TitleExists` (capital T); JS convention is `camelCase` (`titleExists`) -- not a bug, but worth matching for readability/interviews

## Decisions
- Language: JavaScript (Node.js). Stack stays Node.js + Express + SQLite
- Repo is public, named Search-Engine, branch `main`
- No `v1` folder: one folder, code evolves, old versions live in Git history (`git log --oneline`, `git show <hash>:<file>`)
- Fixed title list first, link-following second (now done); queue + visited set next
- `search.db` is never committed
- Keep logic in one file (`fetch_and_save.js`) for now rather than splitting into modules (db.js, wikipedia.js, etc.) -- not enough code yet to justify it
- Sleep delay stays at 500ms; to speed up testing, shrink the title list or `pllimit`, not the delay (delay protects against Wikipedia's rate limit, it's not about local speed)
- Splitting this project into a new "Phase 1.1" chat due to context window length; this file is the handoff point

## Concepts learned
- Fetching = reading a file that lives on another computer, asked for by URL. API = the polite counter to ask at
- `fetch(url)` returns a `response` (envelope: status, headers). `await response.json()` opens it into a real object. Like `FILE*` vs `fread` in C
- `await` = pause until the other computer answers (like `scanf` waiting). Only works inside an `async` function
- SQL moves: `CREATE TABLE`, `INSERT INTO`, `SELECT ... FROM ... WHERE`, `DELETE FROM`
- better-sqlite3: `db.prepare(sql)` then `.run(...)` for writes, `.get()` for one row, `.all()` for many rows
- `?` placeholders get filled in order. Safe against bad text breaking the SQL. Never paste values into the SQL string
- `UNIQUE` column = database-enforced no-duplicates rule (like a set). `INSERT OR IGNORE` = don't crash on a duplicate, just skip it silently
- Why a crawler needs a delay: the server has limited capacity, rate limits protect it from spam and overload, and respecting them makes the crawler a good citizen
- A "link" on Wikipedia's API is just a title, not a URL -- following links means discovering new titles to fetch, same fetch code as before
- Why repeating fetch/parse/insert logic in multiple places is risky: a fix (e.g. User-Agent string) has to be made everywhere it's duplicated, easy to miss one
- Git history replaces version folders: each commit is a saved snapshot of the whole project
- `.map(link => link.title)`: arrow function shorthand, transforms array of objects into array of one field
- `.get(x)` on a prepared SELECT returns one row object or `undefined` -- use for lookups expected to match at most one row

## Shaky / confused
- Not yet explained back: how `async/await` works end to end, how `sleep` works (a Promise wrapped around `setTimeout`)
- Don't fully understand yet what `git add` and the staging area are for
- Still practicing WHEN to use Git (rule to try: commit when something works or before a risky change, push at end of session)
- Hasn't yet decided/answered: should the visited check live inside `fetchAndSave`, or in the loop(s) in `main()` that call it? (asked, not yet answered)

## Open bugs / known issues
- `titleExists(title)` has invalid SQL: `SELECT FROM documents WHERE title = ?` needs a column, e.g. `SELECT id FROM documents WHERE title = ?` -- fix before using it
- `titleExists` not yet wired into `fetchAndSave` (or the loop) -- visited check is designed but not active yet
- Function naming convention slip: `TitleExists` should be `titleExists` (camelCase)
- Only goes one level deep (seed -> its links). No real queue yet, depth is hardcoded by the loop structure, not a parameter
- `url` column stores the API request URL, not the real article URL (e.g. should be `https://en.wikipedia.org/wiki/Dog`)
- No error handling: if one fetch fails, returns no `extract` (redirects/disambiguation pages), or returns a non-JSON reply, the whole run crashes
- robots.txt not checked yet
- `pllimit` currently set low (5-10) for testing; needs revisiting once queue/depth-limit exists, to avoid pulling too many pages per node

## Next step (pick up here in the new "Phase 1.1" chat)
1. Fix the SQL bug in `titleExists` (add `id` after `SELECT`), rename to camelCase
2. Decide where the visited check belongs (inside `fetchAndSave` vs in the calling loop) and wire it in -- skip fetch + log "already have: X" if true
3. Turn the current "seed + its links" shape into a real queue: list of titles to visit next, a visited set, and a depth limit / max page count so it doesn't run forever
4. Add basic error handling (try/catch around a single page's fetch) so one bad page doesn't kill the whole run
5. Fix the `url` column to store the real article URL
6. robots.txt check
7. Grow to ~500+ pages once the above is solid
8. Before ending Phase 1: explain back the whole fetch -> links -> queue -> save flow in my own words
