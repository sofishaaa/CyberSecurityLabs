const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const modeArg = process.argv.find(a => a.startsWith('--mode'));
const mode = modeArg
  ? (modeArg.includes('=') ? modeArg.split('=')[1] : process.argv[process.argv.indexOf(modeArg) + 1])
  : 'normal';

console.log('');
console.log('══════════════════════════════════════════');
console.log(`  Proxy Server starting — mode: ${mode}`);
console.log('  Forwarding: http://localhost:8080 → http://localhost:3000');
console.log('══════════════════════════════════════════');
console.log('');

app.use((req, res, next) => {
  if (mode === 'breach') {
    const cookies = req.headers['cookie'];
    if (cookies) {
      console.log('');
      console.log('┌─────────────────────────────────────────┐');
      console.log('│  ⚠️  INTERCEPTED REQUEST HEADERS          │');
      console.log('├─────────────────────────────────────────┤');
      console.log(`│  Path   : ${req.method} ${req.url}`);
      console.log(`│  Cookies: ${cookies}`);
      console.log('└─────────────────────────────────────────┘');
      console.log('');
    }
  }
  next();
});

app.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  on: {
    proxyRes: (proxyRes, req, res) => {
      if (mode === 'breach') {
        const setCookie = proxyRes.headers['set-cookie'];
        if (setCookie) {
          console.log('');
          console.log('┌─────────────────────────────────────────┐');
          console.log('│  ⚠️  INTERCEPTED RESPONSE — Set-Cookie    │');
          console.log('├─────────────────────────────────────────┤');
          setCookie.forEach(c => console.log(`│  ${c}`));
          console.log('└─────────────────────────────────────────┘');
          console.log('');
        }
      }
    }
  }
}));

app.listen(8080, () => {
  console.log('Proxy running on http://localhost:8080');
});