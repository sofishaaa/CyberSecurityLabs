const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
console.log(`[System] Starting ${config.appName} v${config.version}...`);
console.log(`[System] Mode: ${config.mode}`);

if (config.mode === 'mode1') {
  app.use(cors());
}

if (config.mode === 'csp-strict') {
  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
  });
}

if (['csp-balanced', 'mode-insecure', 'mode-sri-active',
     'task1-naive', 'task3-httponly', 'task4-path'].includes(config.mode)) {
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; img-src *; style-src *; script-src 'self' http://localhost:4000 http://localhost:8001"
    );
    next();
  });
}

// User store
const USERS = {
  john:  { password: 'pass123', sessionID: 'session-john-abc123' },
  alice: { password: 'pass456', sessionID: 'session-alice-xyz789' }
};

function buildCookie(sessionID) {
  const base = `SessionID=${sessionID}; Path=/`;
  switch (config.mode) {
    case 'task1-naive':
      return base;
    case 'task3-httponly':
      return `${base}; HttpOnly`;
    case 'task4-path':
      return `SessionID=${sessionID}; Path=/api; HttpOnly`;
    default:
      return base;
  }
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const cookie = buildCookie(user.sessionID);
  res.setHeader('Set-Cookie', cookie);
  console.log(`[Auth] Login: ${username} — Cookie: ${cookie}`);
  res.json({ success: true, username });
});

app.post('/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'SessionID=; Path=/; Max-Age=0');
  res.json({ success: true });
});

app.get('/', (req, res) => {
  res.send(buildHTML());
});

app.use(express.static('.'));

const emails = [
  { id: 1, sender: "alice@example.com", subject: "Meeting Tomorrow",
    body: "Hi John, don't forget our 10am meeting tomorrow!" },
  { id: 2, sender: "bob@example.com", subject: "Project Update",
    body: "All milestones completed for this sprint." }
];

app.get('/api/emails', (req, res) => res.json(emails));

function buildHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SecureMail Pro</title>
  <link rel="stylesheet" href="http://localhost:8001/theme.css">
  <style>
    * { box-sizing: border-box; }
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
    #login-screen {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      display: flex; align-items: center; justify-content: center; z-index: 100;
    }
    #login-screen.hidden { display: none; }
    .login-box {
      background: white; padding: 32px; border-radius: 12px;
      width: 340px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }
    .login-box h2 { margin: 0 0 20px; color: #1a1a2e; }
    .login-box input {
      width: 100%; padding: 10px 12px; margin-bottom: 12px;
      border: 1px solid #ddd; border-radius: 6px; font-size: 14px;
    }
    .login-box button {
      width: 100%; padding: 11px; background: #4a90e2; color: white;
      border: none; border-radius: 6px; font-size: 15px; cursor: pointer;
    }
    .login-box button:hover { background: #357abd; }
    #login-error { color: red; font-size: 13px; margin-top: 8px; min-height: 18px; }
    #logout-btn {
      background: none; border: 1px solid rgba(255,255,255,0.5);
      color: white; padding: 4px 12px; border-radius: 4px;
      cursor: pointer; font-size: 13px; margin-left: 8px;
    }
  </style>
</head>
<body>
  <div id="login-screen">
    <div class="login-box">
      <h2>SecureMail Pro</h2>
      <input type="text" id="input-username" placeholder="Username (john / alice)">
      <input type="password" id="input-password" placeholder="Password">
      <button id="login-btn">Login</button>
      <div id="login-error"></div>
    </div>
  </div>
  <header>
    <img src="http://localhost:8001/logo.png" alt="Logo"
         style="width:48px;height:48px;object-fit:contain;">
    <div id="username">Not logged in</div>
    <button id="logout-btn">Logout</button>
  </header>
  <div class="layout">
    <div id="sidebar">
      <h3 style="padding:12px 16px;margin:0;background:#f5f5f5;">Inbox</h3>
      <div id="email-list">Please log in.</div>
    </div>
    <div id="main">
      <div id="email-body">
        <p style="color:#aaa">Select an email to read it.</p>
      </div>
    </div>
  </div>
  <script src="http://localhost:8001/react-mock.js"></script>
  <script src="http://localhost:4000/support.js"></script>
  <script src="http://localhost:8002/weather.js"></script>
  <script src="main.js"></script>
</body>
</html>`;
}

app.listen(3000, () => {
  console.log(`[System] ${config.appName} running on http://localhost:3000`);
});