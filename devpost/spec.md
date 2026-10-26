---
doc: spec
status: approved
---
# DeadlineRadar — Technical Spec

## How This Works, In Plain Language
A tiny Node.js server serves one HTML page. The page sends pasted text to `/api/extract`; the server asks Claude (or the offline parser) for a list of deadlines as UTC timestamps. The browser does all time-zone display, countdowns and `.ics` generation.

## The Core Journey Through the System
Browser → `POST /api/extract {text}` → `extractWithClaude` or `extractOffline` → `{engine, deadlines[]}` → render cards → `.ics` download. Implements `prd.md > Features and Behavior`.

## Stack
Node.js 18+ (built-in `http`), `@anthropic-ai/sdk`, vanilla HTML/CSS/JS.

## Where It Runs and How Someone Tries It
Locally: `npm install && npm start`, then open http://localhost:3000. An optional `ANTHROPIC_API_KEY` environment variable enables AI mode.

## Look and Feel
See `prd.md > Look and Feel`.

## Components
### server.js
HTTP server and `/api/extract` endpoint. Calls Claude (`claude-opus-5-5`, low effort) with JSON-schema structured output, checks for refusals, and falls back to the offline parser on any error. Implements `prd.md > Deadline extraction`.
### lib/offline.js
Regex parser for "Month Day, Year h:mm am/pm TZ" patterns, with the US daylight saving rule (second Sunday of March to first Sunday of November). Inherits a zone stated anywhere in the text, e.g. "all times ET".
### public/index.html
UI, `Intl.DateTimeFormat` rendering per zone, countdown, and `.ics` export with alarms. Implements `prd.md > Local-time display and countdown` and `prd.md > Calendar export`.

## Data Model
`Deadline { title, datetime_utc (ISO 8601), source_timezone, quote }`. No persistence.

## File Structure
`server.js`, `lib/offline.js`, `public/index.html`, `devpost/*.md`, `README.md`, `LICENSE`.

## External Services and Dependencies
Anthropic Claude API (optional).

## Important Failure Modes
No API key or network error: offline parser is used. Unrecognized date formats: "No deadlines found" hint.

## What Was Simplified and Why
No database or accounts, so the POC proves the core loop in one session.

## Decisions and Open Issues
Ambiguous numeric dates (03/04) are not parsed offline; Claude handles them from context.
