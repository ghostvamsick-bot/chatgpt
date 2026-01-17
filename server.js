const http = require("http");
const path = require("path");
const fs = require("fs");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;

const heroSpotlight = {
  id: "stormfront",
  title: "Stormfront: Origin",
  year: 2024,
  maturity: "PG-13",
  runtime: "2h 12m",
  description:
    "An ex-pilot and an underground broadcaster join forces to expose a corporate storm engine before the next mega-typhoon hits.",
  tags: ["Sci-Fi", "Adventure", "Thriller"],
  heroImage: "/assets/hero.svg"
};

const genres = [
  {
    id: "trending",
    label: "Trending Now",
    items: [
      {
        id: "skyline",
        title: "Skyline Drift",
        year: 2023,
        rating: "4.7",
        duration: "1h 58m"
      },
      {
        id: "moonlite",
        title: "Moonlite District",
        year: 2022,
        rating: "4.6",
        duration: "2h 01m"
      },
      {
        id: "echoes",
        title: "Echoes of Atlas",
        year: 2024,
        rating: "4.8",
        duration: "2h 15m"
      },
      {
        id: "embers",
        title: "Embers on 5th",
        year: 2023,
        rating: "4.4",
        duration: "1h 44m"
      }
    ]
  },
  {
    id: "new",
    label: "New Releases",
    items: [
      {
        id: "shores",
        title: "Silent Shores",
        year: 2024,
        rating: "4.3",
        duration: "1h 39m"
      },
      {
        id: "level",
        title: "Level Seven",
        year: 2024,
        rating: "4.5",
        duration: "2h 04m"
      },
      {
        id: "goldline",
        title: "Goldline Express",
        year: 2024,
        rating: "4.1",
        duration: "1h 50m"
      },
      {
        id: "atlas",
        title: "Atlas: Reborn",
        year: 2024,
        rating: "4.6",
        duration: "2h 09m"
      }
    ]
  },
  {
    id: "top",
    label: "Top Rated",
    items: [
      {
        id: "lastlight",
        title: "Last Light City",
        year: 2021,
        rating: "4.9",
        duration: "2h 21m"
      },
      {
        id: "highway",
        title: "Midnight Highway",
        year: 2020,
        rating: "4.8",
        duration: "1h 55m"
      },
      {
        id: "harbor",
        title: "Harbor of Dust",
        year: 2022,
        rating: "4.7",
        duration: "2h 06m"
      },
      {
        id: "signal",
        title: "Signal Fire",
        year: 2019,
        rating: "4.8",
        duration: "2h 11m"
      }
    ]
  }
];

const collections = [
  {
    id: "weekend",
    title: "Weekend Binge",
    description: "Four back-to-back picks built for late-night marathons.",
    items: ["Echoes of Atlas", "Atlas: Reborn", "Stormfront: Origin", "Last Light City"]
  },
  {
    id: "families",
    title: "Family Night",
    description: "PG and PG-13 selections with adventure and heart.",
    items: ["Skyline Drift", "Goldline Express", "Moonlite District", "Silent Shores"]
  }
];

const serverStatus = {
  status: "ok",
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || "development",
  owner: "vamsick"
};

const publicDir = path.join(__dirname, "public");

const sendJson = (res, data) => {
  const payload = JSON.stringify(data);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(payload);
};

const sendFile = (res, filePath) => {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      return;
    }

    const ext = path.extname(filePath);
    const contentTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
      ".svg": "image/svg+xml"
    };
    res.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });
    res.end(content);
  });
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;

  if (pathname === "/api/status") {
    sendJson(res, serverStatus);
    return;
  }

  if (pathname === "/api/spotlight") {
    sendJson(res, heroSpotlight);
    return;
  }

  if (pathname === "/api/genres") {
    sendJson(res, genres);
    return;
  }

  if (pathname === "/api/collections") {
    sendJson(res, collections);
    return;
  }

  if (pathname === "/api/search") {
    const query = (url.searchParams.get("q") || "").toLowerCase();
    if (!query) {
      sendJson(res, { query: "", results: [] });
      return;
    }

    const results = genres
      .flatMap((genre) => genre.items)
      .filter((item) => item.title.toLowerCase().includes(query));

    sendJson(res, { query, results });
    return;
  }

  if (pathname.startsWith("/")) {
    const safePath = pathname === "/" ? "/index.html" : pathname;
    const filePath = path.join(publicDir, safePath);

    if (filePath.startsWith(publicDir)) {
      sendFile(res, filePath);
      return;
    }
  }

  sendFile(res, path.join(publicDir, "index.html"));
});

server.listen(PORT, () => {
  console.log(`Vamsick Flixer server running on http://localhost:${PORT}`);
});
