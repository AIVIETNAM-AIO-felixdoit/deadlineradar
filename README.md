# DeadlineRadar

**Paste any messy announcement → see every deadline in your own time zone, with a live countdown and a calendar file.**

Built for the Devpost *Build With AI* hackathon with the Devpost Learn Skill Pack (planning docs in [`devpost/`](devpost/)).

## The problem
International students constantly read rules like *"Submission closes Oct 26, 5:00 pm ET"*. For a student in Vietnam that is **4:00 am on Oct 27**, and daylight saving makes it even easier to get wrong. Missing a deadline by a few hours can cost a scholarship, an application or a hackathon entry.

## What it does
- Extracts every deadline or event from pasted text (Claude structured output, or an offline parser that needs no key)
- Converts to any time zone, handling US daylight saving
- Color-coded live countdown: passed / within 48h / later
- Shows the original quoted phrase so you can verify it
- One-click `.ics` export with reminders 24h and 1h before

## Run it
Requires Node.js 18+.

```bash
npm install
npm start            # open http://localhost:3000
```

Click **Try a sample** to see it work immediately.

Optional AI mode (better at unusual formats):

```bash
# PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-..."; npm start
# bash
ANTHROPIC_API_KEY=sk-ant-... npm start
```

## Tech
Node.js `http` server · `@anthropic-ai/sdk` (Claude Opus 5.5, JSON-schema output) · vanilla HTML/JS · `Intl.DateTimeFormat`.

## Disclosure
Built with Claude Code as the coding agent and the Devpost Learn Skill Pack. No other pre-existing code.

## License
MIT
