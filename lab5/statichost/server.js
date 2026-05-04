const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const modeArg = process.argv.find(a => a.startsWith('--mode'));
const mode = modeArg
  ? (modeArg.includes('=') ? modeArg.split('=')[1] : process.argv[process.argv.indexOf(modeArg) + 1])
  : 'normal';

console.log(`StaticHost (CDN) starting in mode: ${mode}`);

app.get('/react-mock.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  if (mode === 'breach') {
    res.send(`alert("CRITICAL: CDN Compromised! Stealing data...");`);
  } else if (mode === 'v1.0.1') {
    res.send(`console.log("React v1.0.1 loaded from CDN (Port 6000)");`);
  } else {
    res.send(`console.log("React v1.0.0 loaded from CDN (Port 6000)");`);
  }
});

app.use(express.static('.'));

app.listen(8001, () => {
  console.log('StaticHost (CDN) running on http://localhost:8001');
});