const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

const modeArg = process.argv.find(a => a.startsWith('--mode'));
const mode = modeArg
  ? (modeArg.includes('=') ? modeArg.split('=')[1] : process.argv[process.argv.indexOf(modeArg) + 1])
  : 'normal';

console.log(`WeatherApp starting in mode: ${mode}`);

app.get('/weather.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  if (mode === 'breach1') {
    res.send(`
      alert("HACKED: I can see your cookies: " + document.cookie +
            " and User: " + document.getElementById('username').innerText);
    `);
  } else {
    res.send(`console.log("Weather widget: Temperature is 22°C");`);
  }
});

app.listen(8002, () => {
  console.log('WeatherApp running on http://localhost:8002');
});

//Lab1Task7 --> HACKED: I can see your cookies: SessionID=123456 and User: John Smith