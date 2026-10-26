// DeadlineRadar server: serves the page and extracts deadlines from pasted text.
import http from "node:http";
import { readFile } from "node:fs/promises";
import Anthropic from "@anthropic-ai/sdk";
import { extractOffline } from "./lib/offline.js";

const PORT = process.env.PORT || 3000;
const useClaude = Boolean(process.env.ANTHROPIC_API_KEY);
const client = useClaude ? new Anthropic() : null;

const SCHEMA = {
  type: "object",
  properties: {
    deadlines: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          datetime_utc: { type: "string", description: "ISO 8601 in UTC, e.g. 2026-10-26T21:00:00Z" },
          source_timezone: { type: "string" },
          quote: { type: "string" },
        },
        required: ["title", "datetime_utc", "source_timezone", "quote"],
        additionalProperties: false,
      },
    },
  },
  required: ["deadlines"],
  additionalProperties: false,
};

async function extractWithClaude(text) {
  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    messages: [
      {
        role: "user",
        content:
          `Today is ${new Date().toISOString()}. Find every deadline, due date or scheduled event in the text below. ` +
          `Resolve each to an exact UTC instant, applying daylight saving rules for the stated timezone ` +
          `(e.g. ET in late October is UTC-4). If no year is given, assume the next occurrence. ` +
          `Give a short title and quote the original phrase.\n\n<text>\n${text}\n</text>`,
      },
    ],
  });
  if (response.stop_reason === "refusal") throw new Error("Claude declined this text.");
  const block = response.content.find((b) => b.type === "text");
  return JSON.parse(block.text).deadlines;
}

function send(res, status, body, type = "application/json") {
  res.writeHead(status, { "Content-Type": type });
  res.end(type === "application/json" ? JSON.stringify(body) : body);
}

http
  .createServer(async (req, res) => {
    try {
      if (req.method === "POST" && req.url === "/api/extract") {
        let raw = "";
        for await (const chunk of req) raw += chunk;
        const { text } = JSON.parse(raw || "{}");
        if (!text || !text.trim()) return send(res, 400, { error: "Paste some text first." });
        let engine = "offline";
        let deadlines;
        if (useClaude) {
          try {
            deadlines = await extractWithClaude(text);
            engine = "claude";
          } catch (err) {
            console.error("Claude failed, using offline parser:", err.message);
          }
        }
        deadlines ??= extractOffline(text);
        return send(res, 200, { engine, deadlines });
      }
      if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
        return send(res, 200, await readFile(new URL("./public/index.html", import.meta.url)), "text/html; charset=utf-8");
      }
      send(res, 404, { error: "Not found" });
    } catch (err) {
      send(res, 500, { error: err.message });
    }
  })
  .listen(PORT, () => {
    console.log(`DeadlineRadar running at http://localhost:${PORT} (engine: ${useClaude ? "Claude" : "offline"})`);
  });
