// ============================
// ToyXona App — Shared Logic
// ============================

const API_URL = 'http://localhost:3000/venues';
const PER_PAGE = 6;

// ---- Category label map ----
const CATEGORY_LABELS = {
  toyxona: "To'yxonalar",
  barbershop: 'Barbershop',
  salon: 'Salonlar',
  kortej: 'Kortej',
  sanatkor: "San'atkorlar",
  boshlovchi: 'Boshlovchilar',
};

// ---- Fetch all venues (now uses local data.js, no server needed) ----
async function fetchVenues() {
  // Use static data from data.js (loaded via <script> before app.js)
  if (typeof venues !== 'undefined') {
    return Promise.resolve([...venues]);
  }
  // Fallback: try JSON Server if data.js is somehow not loaded
  const res = await fetch('http://localhost:3000/venues');
  if (!res.ok) throw new Error(`Server bilan aloqa yo'q`);
  return res.json();
}

// ---- Build a single card element ----
function buildCard(venue, i, pageOffset) {
  const delay = ((pageOffset + i) % 9) * 80;
  const card = document.createElement('div');
  card.className = 'venue-card group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white flex flex-col';
  card.setAttribute('data-aos', 'fade-up');
  card.setAttribute('data-aos-delay', delay);
  card.setAttribute('data-category', venue.category);
  card.innerHTML = `
    <div class="relative h-[220px] overflow-hidden">
      <img src="${venue.image}" alt="${venue.title}"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onerror="this.src='https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'">
      <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-primary border border-primary/20">
        ${CATEGORY_LABELS[venue.category] || venue.category}
      </div>
      <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full text-gold flex items-center gap-1">
        ⭐ ${venue.rating}
      </div>
    </div>
    <div class="p-5 flex flex-col flex-1">
      <h3 class="font-serif text-xl font-bold text-text-main mb-2">${venue.title}</h3>
      <div class="flex items-center gap-1 text-text-muted text-sm mb-3">
        <span class="material-symbols-outlined text-[16px] text-secondary">location_on</span>
        <span>${venue.location}</span>
      </div>
      ${venue.price ? `<div class="mb-3"><span class="inline-block text-sm font-bold px-3 py-1 rounded-full price-badge">💰 ${venue.price}</span></div>` : ''}
      ${venue.seats ? `<div class="mb-3"><span class="inline-block text-xs font-semibold px-3 py-1 bg-gray-50 rounded-full text-gray-500">🪑 Joylar: ${venue.seats}</span></div>` : ''}
      <div class="mt-auto">
        <button
          class="bron-btn w-full py-3 rounded-full text-white font-bold text-sm shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          style="background:linear-gradient(135deg,#FF3CAC 0%,#9333EA 100%)"
          data-id="${venue.id}"
          data-title="${venue.title}"
          data-image="${venue.image || ''}"
          data-location="${venue.location}"
          data-category="${venue.category}"
          onclick="window.openBronModal(this)">
          📅 Bron qilish
        </button>
      </div>
    </div>
  `;
  return card;
}

// ---- Render a single page of venue cards ----
function renderCards(venues, container, page) {
  const currentPage = page || 1;
  container.innerHTML = '';

  if (venues.length === 0) {
    container.innerHTML = `<div class="col-span-3 text-center py-16 text-text-muted">
      <span class="material-symbols-outlined text-5xl mb-4 block text-gray-300">search_off</span>
      <p class="text-lg">Hech narsa topilmadi</p>
    </div>`;
    renderPagination(0, 1);
    return;
  }

  const start = (currentPage - 1) * PER_PAGE;
  const pageVenues = venues.slice(start, start + PER_PAGE);

  pageVenues.forEach((venue, i) => {
    container.appendChild(buildCard(venue, i, start));
  });

  renderPagination(venues.length, currentPage);

  if (window.AOS) AOS.refresh();
}

// ---- Render pagination controls ----
function renderPagination(total, currentPage) {
  const container = document.getElementById('pagination');
  if (!container) return;
  const totalPages = Math.ceil(total / PER_PAGE);

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  const btnBase = 'w-9 h-9 rounded-xl text-sm font-bold flex items-center justify-center transition-all duration-200 cursor-pointer border';
  const btnActive = 'text-white border-transparent';
  const btnInactive = 'bg-white text-gray-600 border-gray-200 hover:border-secondary/50 hover:text-secondary';
  const btnDisabled = 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed';

  let html = '<div class="flex items-center gap-2">';

  // Prev
  if (currentPage > 1) {
    html += `<button onclick="window.goToPage(${currentPage - 1})" class="${btnBase} ${btnInactive} px-3 gap-1 w-auto">
      <span class="material-symbols-outlined text-[16px]">chevron_left</span>Oldingi
    </button>`;
  } else {
    html += `<button disabled class="${btnBase} ${btnDisabled} px-3 gap-1 w-auto">
      <span class="material-symbols-outlined text-[16px]">chevron_left</span>Oldingi
    </button>`;
  }

  // Page numbers
  for (let p = 1; p <= totalPages; p++) {
    if (p === currentPage) {
      html += `<button class="${btnBase} ${btnActive}" style="background:linear-gradient(135deg,#FF3CAC,#9333EA)">${p}</button>`;
    } else {
      html += `<button onclick="window.goToPage(${p})" class="${btnBase} ${btnInactive}">${p}</button>`;
    }
  }

  // Next
  if (currentPage < totalPages) {
    html += `<button onclick="window.goToPage(${currentPage + 1})" class="${btnBase} ${btnInactive} px-3 gap-1 w-auto">
      Keyingi<span class="material-symbols-outlined text-[16px]">chevron_right</span>
    </button>`;
  } else {
    html += `<button disabled class="${btnBase} ${btnDisabled} px-3 gap-1 w-auto">
      Keyingi<span class="material-symbols-outlined text-[16px]">chevron_right</span>
    </button>`;
  }

  // Total info
  html += `<span class="text-sm text-gray-400 ml-2">${total} ta natija</span>`;
  html += '</div>';

  container.innerHTML = html;
}

// ---- GSAP card entrance animation ----
function animateCards(cards) {
  if (!window.gsap || cards.length === 0) return;
  gsap.fromTo(cards,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
  );
}

// Export for use in inline scripts
window.ToyXonaApp = { fetchVenues, renderCards, animateCards, renderPagination, CATEGORY_LABELS, API_URL, PER_PAGE };
