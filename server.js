// Zero-dependency server. GET /api/message?last=<index> -> { id, message }
const http = require('http');
const fs = require('fs');
const path = require('path');

const messages = JSON.parse(fs.readFileSync(path.join(__dirname, 'messages.json'), 'utf8'));
const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));

function pick(last) {
  let id;
  do { id = Math.floor(Math.random() * messages.length); }
  while (messages.length > 1 && id === last);
  return { id, message: messages[id] };
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/message') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify(pick(parseInt(url.searchParams.get('last'), 10))));
  }
  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }
  res.writeHead(404).end();
}).listen(process.env.PORT || 3000, () => console.log('listening on', process.env.PORT || 3000));
