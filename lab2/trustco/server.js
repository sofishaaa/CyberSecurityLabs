const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.static('.'));

app.get('/api/messages', (req, res) => {
  res.json({ messages: [], status: "No new messages" });
});

app.listen(4000, () => {
  console.log('TrustCo (Partner) running on http://localhost:4000');
});