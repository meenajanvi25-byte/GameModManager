const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "web")));

const PORT = Number(process.env.PORT || 3000);
const MODS_ROOT = process.env.MODS_ROOT || "C:\\Mods";

function safeName(value) {
  return String(value || "")
    .replace(/[<>:"/\\|?*]/g, "_")
    .trim()
    .slice(0, 120) || "Unknown";
}

function gameDirectory(gameName) {
  return path.join(MODS_ROOT, safeName(gameName));
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "GameModManager", modsRoot: MODS_ROOT });
});

app.get("/api/games", (_req, res) => {
  if (!fs.existsSync(MODS_ROOT)) return res.json([]);
  const games = fs.readdirSync(MODS_ROOT, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
  res.json(games);
});

app.post("/api/games", (req, res) => {
  const name = safeName(req.body?.name);
  if (!name || name === "Unknown") {
    return res.status(400).json({ error: "Game name is required" });
  }
  const directory = gameDirectory(name);
  fs.mkdirSync(directory, { recursive: true });
  res.status(201).json({ name, directory });
});

app.listen(PORT, () => {
  console.log("GameModManager running on http://localhost:" + PORT);
  console.log("Mods root: " + MODS_ROOT);
});
