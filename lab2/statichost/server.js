const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.static('.'));

app.listen(8001, () => {
  console.log('StaticHost (CDN) running on http://localhost:6000');
});