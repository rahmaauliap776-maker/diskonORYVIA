document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

  const events = [
    { name: "Rilis Oryvia", start: "01 Januari", end: "15 Januari", desc: "Ulang tahun platform Oryvia!" },
    { name: "Tahun Baru", start: "01 Januari", end: "07 Januari", desc: "Sambut tahun baru!" },
    { name: "Tahun Baru Islam", start: "01 Juli", end: "07 Juli", desc: "Awal tahun Hijriah penuh berkah." },
    { name: "Kemerdekaan RI", start: "17 Agustus", end: "24 Agustus", desc: "Merdeka! Diskon spesial 17 Agustus." },
    { name: "Ramadhan", start: "18 Februari", end: "25 Februari", desc: "Promo khusus bulan puasa.", isRamadhan: true }
  ];

  const promos = events.map(ev => {
    let year = currentYear;
    const endDay = parseInt(ev.end.split(' ')[0]);
    const endMonth = months.indexOf(ev.end.split(' ')[1]);
    const testEnd = new Date(year, endMonth, endDay);
    if (today > testEnd) year++;
    return {
      ...ev,
      year,
      fullStart: ${ev.start} ${year},
      fullEnd: ${ev.end} ${year},
      code: ${ev.name.toLowerCase().replace(/\s+/g, '')}oryvia${year}
    };
  });

  const parseDate = (str) => {
    const [d, m, y] = str.split(' ');
    return new Date(y, months.indexOf(m), parseInt(d));
  };

  const isActive = (p) => {
    const start = parseDate(p.fullStart);
    const end = parseDate(p.fullEnd);
    return today >= start && today <= end;
  };

  // --- DOM ---
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // Navbar mobile
  const toggle = $('#nav-toggle');
  const menu = $('#nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('active'));
  }

  // Tutup splash
  const closeSplash = $('#close-splash');
  const splash = $('#splash');
  const app = $('#app');
  if (closeSplash && splash && app) {
    closeSplash.addEventListener('click', () => {
      splash.classList.add('hidden');
      app.classList.remove('hidden');
    });
  }

  // Tutup modal
  const closeModal = $('#close-modal');
  const modal = $('#modal');
  if (closeModal && modal) {
    closeModal.addEventListener('click', () => modal.classList.add('hidden'));
  }

  // Render promo
  const grid = $('#events-grid');
  if (grid) {
    grid.innerHTML = promos.map(p => `
      <article class="event-card" data-name="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <time>${p.fullStart} – ${p.fullEnd}</time>
      </article>
    `).join('');

    $$('.event-card').forEach(card => {
      card.addEventListener('click', () => {
        const promo = promos.find(p => p.name === card.dataset.name);
        const active = isActive(promo);
        let content = <div class="voucher-display"><h2>${promo.name}</h2>;

        if (active) {
          content += `
            <p>Voucher aktif! Gunakan di:</p>
            <p><a href="https://oryvia.my.id" target="_blank" rel="noopener">oryvia.my.id</a></p>
            <div class="voucher-code" data-code="${promo.code}">${promo.code}</div>
          `;
        } else {
          content += <p>Voucher belum tersedia.</p>;
          if (promo.isRamadhan) content += <p>Berlaku khusus periode puasa:</p>;
          else content += <p>Berlaku:</p>;
          content += <p><strong>${promo.fullStart} – ${promo.fullEnd}</strong></p>;
        }
        content += </div>;

        $('#modal-body').innerHTML = content;
        modal.classList.remove('hidden');

        if (active) {
          const codeEl = $('.voucher-code');
          if (codeEl) {
            codeEl.addEventListener('click', async () => {
              try {
                await navigator.clipboard.writeText(codeEl.dataset.code);
                const orig = codeEl.textContent;
                codeEl.textContent = '✓ Disalin!';
                setTimeout(() => codeEl.textContent = orig, 1200);
              } catch (e) {
                console.warn('Gagal salin');
              }
            });
          }
        }
      });
    });
  }

  // Carousel
  const track = $('#carousel-track');
  const slides = $$('.slide');
  if (track && slides.length > 1) {
    let i = 0;
    setInterval(() => {
      i = (i + 1) % slides.length;
      track.style.transform = translateX(-${i * 100}%);
    }, 4000);
  }
});
