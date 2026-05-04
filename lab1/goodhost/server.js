const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
console.log(`[System] Starting ${config.appName} v${config.version}...`);

if (config.mode === 'mode1') {
  app.use(cors());
  console.log('[System] CORS enabled: all origins (mode1)');
}

app.use(express.static('.'));

const emails = [
  {
    id: 1,
    sender: "alice@example.com",
    subject: "Meeting Tomorrow",
    body: "Hi John, don't forget our 10am meeting tomorrow!"
  },
  {
    id: 2,
    sender: "bob@example.com",
    subject: "Project Update",
    body: "All milestones completed for this sprint."
  }
];

app.get('/api/emails', (req, res) => res.json(emails));

app.listen(3000, () => {
  console.log(`[System] ${config.appName} running on http://localhost:3000`);
});