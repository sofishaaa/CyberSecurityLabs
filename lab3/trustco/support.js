(function() {
  const btn = document.createElement('button');
  btn.innerText = 'Chat with Support';
  btn.style.cssText = `
    position: fixed; bottom: 24px; right: 24px;
    background: #4a90e2; color: white; border: none;
    padding: 12px 20px; border-radius: 8px;
    cursor: pointer; font-size: 14px;
  `;
  document.body.appendChild(btn);

  btn.addEventListener('click', async () => {
    try {
      const res = await fetch('http://localhost:4000/api/messages');
      const data = await res.json();
      alert('Support: ' + data.status);
    } catch (err) {
      console.error('Support chat error (CORS?):', err);
    }
  });

  console.log('Support widget loaded from Port 4000');
})();