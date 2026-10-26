# Progress

## Current phase
Phase 1: Data gathering (in progress, started 2026-10-21)
Phase 0: Foundations is complete (2026-10-21)

## Phase 1 status
- [x] Fetch ONE Wikipedia page from Node and print title + text
- [x] Store a page as a row (url, title, body, fetched_at) in SQLite
- [x] Loop over a list of titles with a polite delay
- [x] Set a clear User-Agent header
- [x] Stop duplicate rows on re-run (UNIQUE column + INSERT OR IGNORE)
- [x] Get a page's links from the Wikipedia API (`prop=links`)
- [x] Fetch + save seed titles plus their depth-1 links (old version, fetch_and_save.js)
- [x] Add `body_saved` and `links_saved` flag columns to the table
- [x] `titleExists(title)` works (prepared once, returns true/false)
- [x] `bodySaved(title)` and `linksSaved(title)` check the flags correctly
- [ ] Rewrite the crawler as a queue + visited set (crawler.js, in progress)
- [ ] Seed the queue with the full title list
- [ ] Text fetch uses the extracts URL, not the links URL
- [ ] Missing-page check looks at `page.missing` / `page.extract`
- [ ] Parent's links step: children loop, visited check, `links_saved = 1` after the loop
- [ ] Replace `INSERT OR IGNORE` with an UPDATE for titles that exist but have `body_saved = 0`
- [ ] Stop condition: `queue.length > 0 && savedCount < 500`
- [ ] Error handling (one bad fetch currently crashes the whole run)
- [ ] Fix the `url` column to store the real article URL, not the API request URL
- [ ] robots.txt check
- [ ] Restart support: on startup, seed the queue from rows with `links_saved = 0`
- [ ] Grow to ~500+ pages
- [ ] Explain the whole fetch -> links -> queue -> save flow back, before closing Phase 1

## Done (Phase 0, summary)
- Inverted index idea, built an index builder over 2 tiny docs in JS, understood the one-document-per-word bug
- Git + GitHub set up; routine is status, add, commit, push
- Repo: https://github.com/Mr-Mann-Agarwal/Search-Engine (public, branch `main`)

## Done (Phase 1, 2026-10-21 session)
- Fetched a page through the Wikipedia API with `fetch`. JSON shape is `data.query.pages.<pageId>.{title, extract}`
- Used `Object.values(pages)[0]` to get the page without knowing its numeric id
- Built the URL with a template literal
- Installed `better-sqlite3`. SQLite is just one file (`search.db`) on my laptop
- Created `.gitignore` with `search.db` in it
- Hit Wikipedia's "too many requests" error when looping fast. Fixed with a `sleep` helper

## Done (Phase 1, 2026-10-22/23 session)
- Added a `User-Agent` header to all fetches
- Made `title` `UNIQUE`, switched to `INSERT OR IGNORE`, confirmed re-runs don't duplicate rows
- Used `prop=links&plnamespace=0` to get a page's outgoing links (titles, not URLs)
- Refactored into `fetchAndSave(title)`
- Ran 12 seeds + depth-1 links -> 128 pages saved

## Done (Phase 1, 2026-10-24/25 session)
- Learned `.map`, `.get`, and `!!x`
- Wrote `titleExists`. Found and fixed the `SELECT FROM` bug and the statement-vs-result bug
- Noted naming: camelCase function names

## Done (Phase 1, 2026-10-27 session: queue design)
- Learned what `db.prepare()` does: parses SQL once, returns a reusable statement. Prepare once, not per call
- Learned `.get()` returns a row object, or `undefined` when no row matches. A `NULL` column shows up as `{ col: null }`
- Understood why `UNIQUE` lookups are fast: an index (B-tree), O(log n), not a hash lookup
- Added two flag columns: `body_saved` and `links_saved` (both `INTEGER DEFAULT 0`)
- Decided: `0` for yes/no flags, `null` for missing values (like `body` when no text exists)
- Understood the crash problem: a title can be saved but its links never fetched. Fix is two separate flags
- Designed the BFS crawl:
  - `queue` = titles still waiting to be visited (array, `push` / `shift`)
  - `visited` = titles already queued or processed this run (Set, `add` / `has`)
  - Flags in the database = progress across runs. `visited` = progress within one run
  - `links_saved = 1` goes after the children loop, so a crash can't mark a parent done with children missing
- Decided to write a new `crawler.js` instead of patching `fetch_and_save.js`. Keep the old file until the new one works

## Decisions
- Language: JavaScript (Node.js). Stack stays Node.js + Express + SQLite
- Repo is public, named Search-Engine, branch `main`
- No `v1` folder: old versions live in Git history
- `search.db` is never committed
- Sleep delay stays at 500ms in the final version
- Queue + visited set + DB flags. No hardcoded depth; a `MAX_DEPTH` is not needed, the page limit is the stop
- Restart uses the DB flags, not a saved queue file
- Build `crawler.js` in four steps: (1) queue loop with logging only, (2) text fetch + `body_saved`, (3) links + `links_saved`, (4) 500-page limit, error handling, restart

## Concepts learned
- Fetching = asking another computer for data by URL. The API is the polite way to ask
- `await` pauses until the answer arrives. Only works inside `async` functions
- `prepare` once, reuse many times (recipe card analogy)
- `UNIQUE` column = no duplicates, enforced by the database
- `INSERT OR IGNORE` = skip a duplicate silently
- `UPDATE ... SET ... WHERE` changes an existing row
- BFS: take from the front of the queue, add unseen neighbours to the back
- `queue.shift()` on an empty queue returns `undefined`
- A Set's `.has()` / `.add()` check and mark in one place, so no duplicates
- Big-O: `UNIQUE` index lookup is O(log n); a scan is O(n)

## Shaky / confused
- How `async/await` works end to end, and how `sleep` works (a Promise around `setTimeout`)
- What `git add` and the staging area are for
- When to use `null` vs `0` in edge cases
- Why `INSERT OR IGNORE` can't fix a failed title's row on retry (needs UPDATE)
- Why the seeds must be pushed into `visited` as well as `queue`

## Open bugs / known issues
- `crawler.js` is still a draft. Its `while` condition uses `||` and `visited.size < 200`. It should be `&&` with `savedCount < 500`
- The text fetch in `crawler.js` still uses the links URL (`prop=links`). It needs `prop=extracts&explaintext=1`
- `INSERT OR IGNORE` won't update a failed title's row on retry
- `titleExists` still skips any title already in the table, even if `body_saved = 0`. Use the flags for the skip decision
- The child loop still calls `titleExists(linkTitle)`. Replace with the `visited` check
- Missing-page check is wrong: should look at `page.missing` / `page.extract`, not `data.query.pages === undefined`
- Wrong log message on text failure ("No links found")
- `url` column stores the API request URL, not the real article URL
- No error handling: one failed fetch crashes the run
- robots.txt not checked yet
- `fetch_and_save.js` and `crawler.js` both exist. Delete the old one once the new one works

## Next step (pick up here next session)
1. Seed `queue` and `visited` with the full title list in `crawler.js`
2. Run step 1 (queue loop with logging only). Confirm each seed prints once
3. Fix the text fetch URL and the missing-page check
4. Answer: why does `INSERT OR IGNORE` leave a failed title unchanged on retry?
5. Add the links step: children loop with `visited` check, then `markLinksDone.run(title)` after the loop
6. Add `savedCount` and the stop condition
7. Before ending Phase 1: explain the whole fetch -> links -> queue -> save flow in your own words