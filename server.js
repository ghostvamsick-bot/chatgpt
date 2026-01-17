import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const catalogPath = path.join(__dirname, "data", "catalog.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const readCatalog = () => {
  const raw = fs.readFileSync(catalogPath, "utf-8");
  return JSON.parse(raw);
};

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "flixer-vamsick" });
});

app.get("/api/catalog", (req, res) => {
  const catalog = readCatalog();
  res.json(catalog);
});

app.get("/api/featured", (req, res) => {
  const catalog = readCatalog();
  res.json(catalog.featured);
});

app.get("/api/search", (req, res) => {
  const { q } = req.query;
  const catalog = readCatalog();
  const needle = (q || "").toString().trim().toLowerCase();
  if (!needle) {
    res.json({ results: [] });
    return;
  }

  const allTitles = [
    ...catalog.featured,
    ...catalog.trending,
    ...catalog.originals
  ];

  const results = allTitles.filter((item) =>
    item.title.toLowerCase().includes(needle)
  );

  res.json({ results });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Flixer Vamsick running on http://localhost:${PORT}`);
});
