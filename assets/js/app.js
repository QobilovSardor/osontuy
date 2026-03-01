// ============================
// ToyXona App — Shared Logic
// ============================

const API_URL = 'http://localhost:3000/venues';

// ---- Category label map ----
const CATEGORY_LABELS = {
  toyxona: "To'yxonalar",
  barbershop: 'Barbershop',
  salon: 'Salonlar',
  kortej: 'Kortej',
  sanatkor: "San'atkorlar",
  boshlovchi: 'Boshlovchilar',
};

// ---- Fetch all venues ----
async function fetchVenues() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Server bilan aloqa yo'q`);
  return res.json();
}

// ---- Render venue cards (index.html) ----
function renderCards(venues, container) {
  container.innerHTML = '';
  if (venues.length === 0) {
    container.innerHTML = `<div class="col-span-3 text-center py-16 text-text-muted">
      <span class="material-symbols-outlined text-5xl mb-4 block text-gray-300">search_off</span>
      <p class="text-lg">Hech narsa topilmadi</p>
    </div>`;
    return;
  }
  venues.forEach((venue, i) => {
    const delay = (i % 9) * 100;
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
      </div>
      <div class="p-5 flex flex-col flex-1">
        <h3 class="font-serif text-xl font-bold text-text-main mb-2">${venue.title}</h3>
        <div class="flex items-center gap-1 mb-2">
          <span class="text-gold text-base">⭐</span>
          <span class="text-sm font-bold text-text-main">${venue.rating}</span>
          <span class="text-text-muted text-xs ml-1">/ 5.0</span>
        </div>
        <div class="flex items-center gap-1 text-text-muted text-sm mb-3">
          <span class="material-symbols-outlined text-[16px] text-secondary">location_on</span>
          <span>${venue.location}</span>
        </div>
        ${venue.price ? `<div class="mb-4"><span class="inline-block text-sm font-bold px-3 py-1 rounded-full price-badge">💰 ${venue.price}</span></div>` : ''}
        ${venue.seats ? `<div class="mb-4"><span class="inline-block text-sm font-bold px-3">Joylar soni: ${venue.seats}</span></div>` : ''}
        <div class="mt-auto">
          <button class="w-full py-3 rounded-xl text-white font-bold text-sm korish-btn shadow-md hover:-translate-y-0.5 transition-transform duration-200">
            Ko'rish
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  // Re-init AOS after dynamic render
  if (window.AOS) AOS.refresh();
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
window.ToyXonaApp = { fetchVenues, renderCards, animateCards, CATEGORY_LABELS, API_URL };
