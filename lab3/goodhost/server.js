const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
console.log(`[System] Starting ${config.appName} v${config.version}...`);
console.log(`[System] Mode: ${config.mode}`);

if (config.mode === 'mode1') {
  app.use(cors());
  console.log('[System] CORS enabled: all origins (mode1)');
}

if (config.mode === 'csp-strict') {
  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
  });
  console.log('[System] CSP: STRICT');
}

if (['csp-balanced', 'mode-insecure', 'mode-sri-active'].includes(config.mode)) {
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; img-src *; style-src *; script-src 'self' http://localhost:4000 http://localhost:8001"
    );
    next();
  });
  console.log('[System] CSP: BALANCED');
}

// SRI хеші
const REACT_HASH_V100 = 'F/DvSjYq7+1mbLZxoEf31eDe/ceMKV7ZWx8oAi3nJDs=';
const REACT_HASH_V101 = 'PASTE_V101_HASH_HERE';

function buildHTML(useSRI, hash) {
  const reactTag = useSRI
    ? `<script src="http://localhost:8001/react-mock.js"
         integrity="sha256-${hash}"
         crossorigin="anonymous"></script>`
    : `<script src="http://localhost:8001/react-mock.js"></script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SecureMail Pro</title>
  <link rel="stylesheet" href="http://localhost:8001/theme.css">
  <style>
    body { font-family: Arial, sans-serif; margin: 0; display: flex; flex-direction: column; }
    header { background: #1a1a2e; color: white; padding: 12px 20px; display: flex; align-items: center; gap: 16px; }
    .layout { display: flex; height: calc(100vh - 60px); }
    #sidebar { width: 260px; border-right: 1px solid #ddd; overflow-y: auto; }
    .email-item { padding: 12px 16px; border-bottom: 1px solid #eee; cursor: pointer; }
    .email-item:hover { background: #f0f4ff; }
    .email-item .sender { font-weight: bold; font-size: 0.9rem; }
    .email-item .subject { color: #555; font-size: 0.85rem; }
    #main { flex: 1; padding: 24px; }
    #email-body { background: #f9f9f9; border-radius: 8px; padding: 20px; min-height: 200px; }
  </style>
</head>
<body>
  <header>
    <img class="logo-container" src="http://localhost:8001/logo.png" alt="Logo"
         style="width:48px;height:48px;object-fit:contain;">
    <div id="username">John Smith</div>
  </header>
  <div class="layout">
    <div id="sidebar">
      <h3 style="padding:12px 16px;margin:0;background:#f5f5f5;">Inbox</h3>
      <div id="email-list">Loading...</div>
    </div>
    <div id="main">
      <div id="email-body">
        <p style="color:#aaa">Select an email to read it.</p>
      </div>
    </div>
  </div>
  ${reactTag}
  <script src="http://localhost:4000/support.js"></script>
  <script src="http://localhost:8002/weather.js"></script>
  <script src="main.js"></script>
</body>
</html>`;
}

app.get('/', (req, res) => {
  const useSRI = config.mode === 'mode-sri-active';
  const hash = REACT_HASH_V100;
  res.send(buildHTML(useSRI, hash));
});

app.use(express.static('.'));

const emails = [
  { id: 1, sender: "alice@example.com", subject: "Meeting Tomorrow",
    body: "Hi John, don't forget our 10am meeting tomorrow!" },
  { id: 2, sender: "bob@example.com", subject: "Project Update",
    body: "All milestones completed for this sprint." }
];

app.get('/api/emails', (req, res) => res.json(emails));

app.listen(3000, () => {
  console.log(`[System] ${config.appName} running on http://localhost:3000`);
});