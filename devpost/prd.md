---
doc: prd
status: approved
---
# DeadlineRadar — Product Requirements

## The Core Journey
1. User opens the page and sees a text box, "Find deadlines", "Try a sample", and a time-zone picker defaulting to their browser zone.
2. User pastes an announcement (or clicks the sample) and clicks "Find deadlines".
3. Cards appear, sorted by time, each showing title, local date/time, countdown, and the original quoted phrase.
4. User switches time zone and the cards re-render instantly.
5. User clicks "Download .ics (all)" and imports it into their calendar.

## Screens and Layout
One screen: header and tagline, input area, controls row, results list, actions row.

## Look and Feel
Dark navy background, blue accent, colored left border per card status (red passed, amber within 48h, green later).

## Features and Behavior
### Deadline extraction
Finds every date/time in the text and resolves the stated time zone (including US daylight saving) to an exact UTC instant. Uses Claude structured JSON output when `ANTHROPIC_API_KEY` is set; falls back to an offline parser.
### Local-time display and countdown
Formats each instant in the chosen zone; countdown refreshes every 30 seconds.
### Calendar export
Generates an `.ics` file with one event per deadline and alarms 24h and 1h before.

## States and Boundaries
Empty input shows an error. Nothing found shows a hint. A Claude error silently falls back to the offline parser.

## Product Decisions
No login, nothing stored server-side. The source quote is shown so users can verify the extraction.

## What We're Building
The single-page proof of concept above.

## Deferred From the POC
Saved lists, share links, editing individual cards.

## Possible Later Enhancements
Browser extension, email-in address, messaging-app reminders.

## Non-Goals
A general calendar or task manager.

## Open Questions
How to handle ambiguous numeric dates like 03/04 (US vs. EU order) offline.
