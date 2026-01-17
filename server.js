const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const catalog = require('./data/catalog.json');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const sendJson = (res, payload) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

const handleApi = (req, res, pathname, query) => {
  if (pathname === '/api/featured') {
    sendJson(res, catalog.featured);
    return true;
  }

  if (pathname === '/api/trending') {
    sendJson(res, catalog.trending);
    return true;
  }

  if (pathname === '/api/categories') {
    sendJson(res, catalog.categories);
    return true;
  }

  if (pathname === '/api/search') {
    const searchTerm = (query.q || '').toLowerCase();
    const results = catalog.trending
      .map((item) => item.title)
      .concat(catalog.categories.flatMap((category) => category.items))
      .filter((title) => title.toLowerCase().includes(searchTerm))
      .slice(0, 8);
    sendJson(res, { query: searchTerm, results });
    return true;
  }

  return false;
};

const serveFile = (res, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname || '/';

  if (pathname.startsWith('/api/')) {
    if (handleApi(req, res, pathname, parsedUrl.query)) {
      return;
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
    return;
  }

  const safePath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(publicDir, safePath);
  const normalized = path.normalize(filePath);

  if (!normalized.startsWith(publicDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(normalized, (err, stat) => {
    if (err || !stat.isFile()) {
      serveFile(res, path.join(publicDir, 'index.html'));
      return;
    }
    serveFile(res, normalized);
  });
});

server.listen(port, () => {
  console.log(`Vamsick Flixer running on http://localhost:${port}`);
});
