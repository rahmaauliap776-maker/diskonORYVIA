// Tab switching (login/register)
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active-form'));
    
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.getElementById(${tab}-form).classList.add('active-form');
  });
});

// Switch via footer
document.getElementById('switch-to-register')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active-form'));
  
  document.querySelector('.tab-btn[data-tab="register"]').classList.add('active');
  document.getElementById('register-form').classList.add('active-form');
});

// Login mockup
document.getElementById('login-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = e.target[0].value;
  const password = e.target[1].value;

  // Cek admin
  if (email === 'admin001' && password === 'Angsana2') {
    window.location.href = 'admin.html';
  } else {
    // Anggap user biasa
    window.location.href = 'dashboard.html';
  }
});

// Register mockup
document.getElementById('register-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Akun berhasil dibuat! Silakan login.');
  document.querySelector('.tab-btn[data-tab="login"]').click();
});

// Tiket modal
const modal = document.getElementById('new-ticket-modal');
document.getElementById('new-ticket-btn')?.addEventListener('click', () => {
  modal.classList.remove('hidden');
});
document.getElementById('close-ticket-modal')?.addEventListener('click', () => {
  modal.classList.add('hidden');
});
document.getElementById('ticket-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Tiket berhasil dibuka!');
  modal.classList.add('hidden');
});

// Admin chat toggle (mockup)
document.querySelectorAll('.btn-reply').forEach(btn => {
  btn.addEventListener('click', () => {
    const chat = btn.closest('.ticket-card').querySelector('.ticket-chat');
    chat.classList.toggle('hidden');
  });
});