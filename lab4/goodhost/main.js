document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-btn').addEventListener('click', doLogin);
  document.getElementById('logout-btn').addEventListener('click', doLogout);
});

async function doLogin() {
  const username = document.getElementById('input-username').value.trim();
  const password = document.getElementById('input-password').value.trim();
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error || 'Login failed.';
      return;
    }

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('username').textContent = `Logged in as ${data.username}`;
    console.log('[Auth] document.cookie after login:', document.cookie);
    loadEmails();
  } catch (err) {
    errorEl.textContent = 'Server error.';
    console.error(err);
  }
}

async function doLogout() {
  await fetch('/logout', { method: 'POST' });
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('email-list').innerHTML = 'Please log in.';
  document.getElementById('email-body').innerHTML = '<p style="color:#aaa">Select an email to read it.</p>';
  document.getElementById('username').textContent = 'Not logged in';
  console.log('[Auth] Logged out. document.cookie:', document.cookie);
}

async function loadEmails() {
  try {
    const res = await fetch('/api/emails');
    const emails = await res.json();
    const list = document.getElementById('email-list');
    list.innerHTML = '';
    emails.forEach(email => {
      const div = document.createElement('div');
      div.className = 'email-item';
      div.innerHTML = `<div class="sender">${email.sender}</div>
                       <div class="subject">${email.subject}</div>`;
      div.addEventListener('click', () => showEmail(email));
      list.appendChild(div);
    });
  } catch (err) {
    console.error('Failed to load emails:', err);
  }
}

function showEmail(email) {
  document.getElementById('email-body').innerHTML = `
    <h2>${email.subject}</h2>
    <p><strong>From:</strong> ${email.sender}</p>
    <hr>
    <p>${email.body}</p>`;
}