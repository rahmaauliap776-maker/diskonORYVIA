class PromoManager {
  constructor() {
    this.today = new Date();
    this.currentYear = this.today.getFullYear();
    this.events = [
      { name: "Rilis Oryvia", start: "01 Januari", end: "15 Januari", desc: "Ulang tahun platform Oryvia!" },
      { name: "Tahun Baru", start: "01 Januari", end: "07 Januari", desc: "Sambut tahun baru!" },
      { name: "Tahun Baru Islam", start: "01 Juli", end: "07 Juli", desc: "Awal tahun Hijriah penuh berkah." },
      { name: "Kemerdekaan RI", start: "17 Agustus", end: "24 Agustus", desc: "Merdeka! Diskon spesial 17 Agustus." },
      { name: "Ramadhan", start: "18 Februari", end: "25 Februari", desc: "Promo khusus bulan puasa.", isRamadhan: true }
    ];
    this.months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    this.init();
  }

  parseDate(dateStr) {
    const [day, monthName, year] = dateStr.split(' ');
    const month = this.months.indexOf(monthName);
    return new Date(parseInt(year), month, parseInt(day));
  }

  getDay(dateStr) { return parseInt(dateStr.split(' ')[0]); }
  getMonth(dateStr) { return this.months.indexOf(dateStr.split(' ')[1]); }

  generatePromos() {
    return this.events.map(ev => {
      let year = this.currentYear;
      const testEnd = new Date(year, this.getMonth(ev.end), this.getDay(ev.end));
      if (this.today > testEnd) year++;
      
      return {
        ...ev,
        year,
        fullStart: ${ev.start} ${year},
        fullEnd: ${ev.end} ${year},
        code: ${ev.name.toLowerCase().replace(/\s+/g, '')}oryvia${year}
      };
    });
  }

  isActive(promo) {
    const start = this.parseDate(promo.fullStart);
    const end = this.parseDate(promo.fullEnd);
    return this.today >= start && this.today <= end;
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.warn('Gagal salin:', err);
    }
  }

  renderEventCards() {
    const grid = document.getElementById('events-grid');
    const promos = this.generatePromos();
    
    grid.innerHTML = promos.map(p => `
      <article class="event-card" data-name="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <time>${p.fullStart} – ${p.fullEnd}</time>
      </article>
    `).join('');

    grid.querySelectorAll('.event-card').forEach(card => {
      card.addEventListener('click', () => this.openModal(
        promos.find(p => p.name === card.dataset.name)
      ));
    });
  }

  openModal(promo) {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');
    const active = this.isActive(promo);

    let content = <div class="voucher-display"><h2>${promo.name}</h2>;

    if (active) {
      content += `
        <p>Voucher aktif! Gunakan di:</p>
        <p><a href="https://oryvia.my.id" target="_blank" rel="noopener">oryvia.my.id</a></p>
        <div class="voucher-code" data-code="${promo.code}">${promo.code}</div>
      `;
    } else {
      content += <p>Voucher belum tersedia.</p>;
      if (promo.isRamadhan) {
        content += <p>Berlaku khusus periode puasa:</p>;
      } else {
        content += <p>Berlaku:</p>;
      }
      content += <p><strong>${promo.fullStart} – ${promo.fullEnd}</strong></p>;
    }

    content += </div>;
    body.innerHTML = content;
    modal.classList.remove('hidden');

    if (active) {
      const codeEl = body.querySelector('.voucher-code');
      codeEl?.addEventListener('click', async () => {
        const code = codeEl.dataset.code;
        await this.copyToClipboard(code);
        const original = codeEl.textContent;
        codeEl.textContent = '✓ Disalin!';
        setTimeout(() => codeEl.textContent = original, 1200);
      });
    }
  }

  initCarousel() {
    const track = document.getElementById('carousel-track');
    const slides = track.querySelectorAll('.slide');
    if (slides.length <= 1) return;

    let index = 0;
    setInterval(() => {
      index = (index + 1) % slides.length;
      track.style.transform = translateX(-${index * 100}%);
    }, 4500);
  }

  init() {
    // Navbar mobile toggle
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    toggle?.addEventListener('click', () => {
      menu.classList.toggle('active');
    });

    // Close splash
    document.getElementById('close-splash')?.addEventListener('click', () => {
      document.getElementById('splash').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
    });

    // Close modal
    document.getElementById('close-modal')?.addEventListener('click', () => {
      document.getElementById('modal').classList.add('hidden');
    });

    this.renderEventCards();
    this.initCarousel();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PromoManager();
});