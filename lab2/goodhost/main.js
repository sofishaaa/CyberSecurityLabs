document.cookie = "SessionID=123456; path=/";

async function loadEmails() {
  try {
    const res = await fetch('/api/emails');
    const emails = await res.json();
    const list = document.getElementById('email-list');
    list.innerHTML = '';
    emails.forEach(email => {
      const div = document.createElement('div');
      div.className = 'email-item';
      div.innerHTML = `
        <div class="sender">${email.sender}</div>
        <div class="subject">${email.subject}</div>
      `;
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
    <p>${email.body}</p>
  `;
}

loadEmails();