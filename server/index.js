const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "web")));

const PORT = Number(process.env.PORT || 3000);
const MODS_ROOT = process.env.MODS_ROOT || "C:\\Mods";
const MAX_SEARCH_FILES = 20000;

function safeName(value) {
  return String(value || "")
    .replace(/[<>:"/\\|?*]/g, "_")
    .trim()
    .slice(0, 120) || "Unknown";
}

function gameDirectory(gameName) {
  return path.join(MODS_ROOT, safeName(gameName));
}

function findFilesById(id) {
  const results = [];
  let visitedFiles = 0;
  const idPrefix = new RegExp("^" + id + "(?:[-_.]|$)", "i");

  function visit(directory, relativeDirectory) {
    if (visitedFiles >= MAX_SEARCH_FILES) return;
    let entries;
    try {
      entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (visitedFiles >= MAX_SEARCH_FILES) break;
      const absolutePath = path.join(directory, entry.name);
      const relativePath = path.join(relativeDirectory, entry.name);

      if (entry.isDirectory()) {
        visit(absolutePath, relativePath);
      } else if (entry.isFile()) {
        visitedFiles += 1;
        if (idPrefix.test(entry.name)) {
          let size = null;
          try {
            size = fs.statSync(absolutePath).size;
          } catch {
            // Keep the catalog result even if file metadata is temporarily unavailable.
          }
          const parts = relativePath.split(/[\\/]/);
          results.push({
            fileName: entry.name,
            relativePath: parts.join("/"),
            game: parts.length > 1 ? parts[0] : null,
            size
          });
        }
      }
    }
  }

  if (fs.existsSync(MODS_ROOT)) visit(MODS_ROOT, "");
  return { results, truncated: visitedFiles >= MAX_SEARCH_FILES };
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

app.get("/api/search", (req, res) => {
  const id = String(req.query.id || "").trim();
  if (!/^\d{1,32}$/.test(id)) {
    return res.status(400).json({ error: "Enter a numeric file ID (1–32 digits)." });
  }

  const { results, truncated } = findFilesById(id);
  res.json({ id, results, truncated });
});

app.listen(PORT, () => {
  console.log("GameModManager running on http://localhost:" + PORT);
  console.log("Mods root: " + MODS_ROOT);
});
