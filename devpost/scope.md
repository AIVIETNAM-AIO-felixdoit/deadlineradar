---
doc: scope
status: approved
---
# DeadlineRadar

## The Unique Kernel
Paste any messy announcement and instantly see every deadline converted to *your* time zone, with a live countdown and a one-click calendar file. Time-zone math (ET vs. ICT, daylight saving) is done for you.

## Who It's For
International students and hackathon participants, e.g. a student in Vietnam (UTC+7) reading US event rules written in "ET".

## The Core Loop
Paste text → click "Find deadlines" → see each deadline as a card in local time with countdown → download `.ics` with 24h/1h reminders.

## Inspiration & Identity
Built minutes before a real deadline after realizing "Oct 26, 5:00 pm ET" actually means 4:00 am Oct 27 in Vietnam. Dark, calm, radar-like UI: red = passed, amber = under 48h, green = upcoming.

## Why This Matters to the Learner
Missing a deadline because of time-zone confusion is a common and costly mistake for students applying to global programs, scholarships and hackathons.

## What "Working" Looks Like
Pasting the hackathon rules shows "Submission deadline: Tue 27 Oct 2026, 04:00 (Asia/Ho_Chi_Minh)" with a correct countdown, and the downloaded `.ics` imports into Google Calendar.

## The POC Boundary
Single-page web app, local Node server, Claude extraction when an API key is present, offline rule-based parser otherwise.

## Later
Browser extension that highlights deadlines on any page; email forwarding inbox; chat-app reminders.

## Explicitly Cut
Accounts, saved history, push notifications, mobile app.
