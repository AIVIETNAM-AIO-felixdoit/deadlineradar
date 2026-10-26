<p align="center">
  <img src="docs/banner.png" alt="DeadlineRadar — Every deadline. Your time zone." width="100%">
</p>

<p align="center">
  <b>Paste any messy announcement → see every deadline in your own time zone, with a live countdown and a calendar file.</b>
</p>

<p align="center">
  <a href="https://youtu.be/3uq9ODZYJcI"><img src="https://img.shields.io/badge/Demo-YouTube-FF0000?logo=youtube&logoColor=white" alt="Demo video"></a>
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black" alt="Vanilla JavaScript">
  <img src="https://img.shields.io/badge/AI-Claude-D97757?logo=anthropic&logoColor=white" alt="Claude">
  <img src="https://img.shields.io/badge/Works%20offline-no%20API%20key%20needed-4CD6A0" alt="Works without an API key">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/Devpost-Build%20With%20AI-003E54?logo=devpost&logoColor=white" alt="Devpost Build With AI">
</p>

---

## 🎬 Demo

<p align="center">
  <img src="docs/demo.gif" alt="DeadlineRadar demo" width="800">
</p>

<p align="center">
  <a href="https://youtu.be/3uq9ODZYJcI">
    <img src="https://img.youtube.com/vi/3uq9ODZYJcI/maxresdefault.jpg" alt="Watch the full demo on YouTube" width="560">
  </a>
  <br>
  <sub>▶ Full 70-second demo with narration on YouTube · <a href="docs/demo.mp4">download MP4</a></sub>
</p>

## 😩 The problem

International students constantly read rules like:

> *"Submission closes **October 26, 5:00 pm ET**"*

For a student in Vietnam that is actually **4:00 am on October 27**, and daylight saving makes it even easier to get wrong ("ET" is UTC-4 in October but UTC-5 in November). Missing a deadline by a few hours can cost a scholarship, an application, or a hackathon entry.

## ✨ Features

| | Feature | Details |
|---|---|---|
| 🔍 | **Smart extraction** | Finds every deadline/event in pasted text. Uses Claude structured output, or an offline parser when no key is set |
| 🌏 | **Any time zone** | Converts to your browser's zone or any zone you pick, with correct US daylight-saving handling |
| ⏱️ | **Live countdown** | Color-coded: 🔴 passed · 🟠 under 48h · 🟢 upcoming. Refreshes every 30s |
| 🧾 | **Verifiable** | Shows the original quoted phrase next to every result |
| 📅 | **Calendar export** | One-click `.ics` file with reminders 24h and 1h before each deadline |
| 📱 | **Responsive** | Works on desktop and mobile |

## 📸 Screenshots

| Deadlines in Vietnam time | Same deadlines in New York time |
|---|---|
| ![Vietnam time](docs/screenshots/2-results-vietnam-time.png) | ![New York time](docs/screenshots/3-results-new-york-time.png) |

| Home | Mobile |
|---|---|
| ![Home](docs/screenshots/1-home.png) | <img src="docs/screenshots/5-mobile.png" alt="Mobile" width="260"> |

## 🏗️ How it works

```mermaid
flowchart LR
    A[📋 Pasted text] --> B[Browser UI<br/>public/index.html]
    B -- POST /api/extract --> C[Node.js server<br/>server.js]
    C --> D{ANTHROPIC_API_KEY<br/>set?}
    D -- yes --> E[Claude Opus 5.5<br/>JSON-schema output]
    D -- no / error --> F[Offline parser<br/>lib/offline.js<br/>regex + US DST rule]
    E --> G[Deadlines as UTC timestamps]
    F --> G
    G --> B
    B --> H[🌏 Local time + ⏱️ countdown<br/>Intl.DateTimeFormat]
    B --> I[📅 .ics download<br/>with 24h / 1h alarms]
```

- The **server** only turns text into a list of `{ title, datetime_utc, source_timezone, quote }`.
- The **browser** does all time-zone formatting, countdowns and `.ics` generation, so switching zones is instant.
- If Claude is unavailable for any reason, the app silently falls back to the offline parser, so it **always works**.

## 🚀 Quick start

Requires **Node.js 18+**.

```bash
git clone https://github.com/AIVIETNAM-AIO-felixdoit/deadlineradar.git
cd deadlineradar
npm install
npm start
```

Open **http://localhost:3000** and click **Try a sample**.

### Optional: AI mode

Claude handles unusual date formats and context better than the offline parser.

```bash
# PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-..."; npm start

# macOS / Linux
ANTHROPIC_API_KEY=sk-ant-... npm start
```

The footer under the results shows which engine was used.

## 📁 Project structure

```
deadlineradar/
├── server.js            # HTTP server + /api/extract (Claude or offline)
├── lib/offline.js       # Rule-based parser with US daylight-saving rule
├── public/index.html    # UI, countdowns, time-zone switch, .ics export
├── devpost/             # Planning docs from the Devpost Learn Skill Pack
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
└── docs/                # Banner, screenshots, demo video
```

## 🧠 Planning

Planned with the **Devpost Learn Skill Pack** before building:

- [`scope.md`](devpost/scope.md): unique kernel, core loop, POC boundary
- [`prd.md`](devpost/prd.md): core journey, behaviors, states and edge cases
- [`spec.md`](devpost/spec.md): stack, components, data model, failure modes

## 🗺️ Roadmap

- [ ] Browser extension that highlights deadlines on any page
- [ ] Email-forwarding inbox ("forward the email, get the calendar")
- [ ] Reminders via chat apps
- [ ] Smarter offline handling of ambiguous numeric dates (03/04)

## 🛠️ Built with

Node.js · `@anthropic-ai/sdk` · Vanilla HTML/CSS/JS · `Intl.DateTimeFormat` · iCalendar (`.ics`)

Built with Claude Code as the coding agent and the Devpost Learn Skill Pack. No other pre-existing code.

## 📄 License

[MIT](LICENSE)
