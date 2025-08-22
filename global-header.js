// Global header with accessible, responsive menu (no inline handlers)
document.addEventListener('DOMContentLoaded', () => {
  const header = document.createElement('header');
  header.className = 'sticky top-0 z-50 bg-card/80 supports-[backdrop-filter]:backdrop-blur border-b border-border text-card-foreground';
  header.innerHTML = `
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-3 focus:py-2 focus:rounded-md focus:bg-muted">
      Skip to content
    </a>
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      <a href="mode-select.html" class="flex items-center gap-2" aria-label="Go to mode select">
        <img src="images/DartUpLogoSVG.svg" alt="" class="h-16 w-auto" aria-hidden="true" />
        <span class="sr-only">Darts Scorer</span>
      </a>

      <div class="flex items-center gap-2">
        <button id="settingsButton" type="button" class="p-2 rounded-md focus:outline-none focus:ring" aria-label="Settings">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0..."/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>

        <button id="menuButton" type="button"
          class="p-2 rounded-md focus:outline-none focus:ring md:hidden"
          aria-label="Open menu" aria-controls="globalMenu" aria-expanded="false" data-state="closed">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>

    <nav id="globalMenu"
         class="hidden md:flex md:items-center md:gap-2 flex-col md:flex-row px-4 pb-4 md:p-0"
         aria-label="Global">
      <a href="quickplay.html" class="block px-3 py-2 rounded hover:bg-muted focus:bg-muted focus:outline-none">Quick Play</a>
      <a href="#" data-soon="Training Mode" class="block px-3 py-2 rounded hover:bg-muted focus:bg-muted focus:outline-none">Training Mode</a>
      <a href="#" data-soon="Multiplayer" class="block px-3 py-2 rounded hover:bg-muted focus:bg-muted focus:outline-none">Multiplayer</a>
    </nav>
  `;

  document.body.prepend(header);

  const menuBtn   = header.querySelector('#menuButton');
  const menu      = header.querySelector('#globalMenu');
  const settings  = header.querySelector('#settingsButton');
  const mql       = window.matchMedia('(min-width: 768px)');
  const supportsInert = 'inert' in menu;

  // Initialise hidden state for a11y on load (mobile)
  if (!mql.matches) {
    menu.setAttribute('aria-hidden', 'true');
    if (supportsInert) menu.inert = true;
  }

  // Mark current page
  header.querySelectorAll('nav a[href]').forEach(a => {
    const url = new URL(a.getAttribute('href'), location.href);
    if (url.pathname === location.pathname) a.setAttribute('aria-current', 'page');
  });

  // Open/close helpers (mobile only)
  const firstLink = () => menu.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
  function openMenu() {
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.dataset.state = 'open';
    menu.classList.remove('hidden');
    menu.classList.add('block');
    menu.removeAttribute('aria-hidden');
    if (supportsInert) menu.inert = false;
    // Focus first link for keyboard users
    const f = firstLink();
    if (f) f.focus();
    // Update button label for AT
    menuBtn.setAttribute('aria-label', 'Close menu');
  }
  function closeMenu({returnFocus = true} = {}) {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.dataset.state = 'closed';
    menu.classList.add('hidden');
    menu.classList.remove('block');
    menu.setAttribute('aria-hidden', 'true');
    if (supportsInert) menu.inert = true;
    if (returnFocus) menuBtn.focus();
    menuBtn.setAttribute('aria-label', 'Open menu');
  }
  function isOpen() { return menuBtn.getAttribute('aria-expanded') === 'true'; }

  menuBtn.addEventListener('click', () => {
    if (mql.matches) return; // desktop: menu is always visible
    isOpen() ? closeMenu({returnFocus:false}) : openMenu();
  });

  // Close on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeMenu();
  });

  // Close on outside click (mobile)
  document.addEventListener('click', (e) => {
    if (!isOpen() || mql.matches) return;
    if (!header.contains(e.target)) closeMenu({returnFocus:false});
  });

  // Close after selecting a link (mobile)
  menu.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    if (a.dataset.soon && !mql.matches) {
      e.preventDefault();
      alert(`${a.dataset.soon} coming soon!`);
      closeMenu({returnFocus:false});
    } else if (!mql.matches) {
      closeMenu({returnFocus:false});
    }
  });

  // Handle responsive changes
  mql.addEventListener('change', (e) => {
    if (e.matches) {
      // Desktop: ensure interactive
      menu.classList.remove('block'); // md:flex will show it
      menu.removeAttribute('aria-hidden');
      if (supportsInert) menu.inert = false;
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.dataset.state = 'closed';
    } else {
      // Back to mobile: keep it closed initially
      menu.setAttribute('aria-hidden', 'true');
      if (supportsInert) menu.inert = true;
    }
  });

  // Settings
  settings.addEventListener('click', () => {
    if (window.Settings && typeof window.Settings.openSettings === 'function') {
      window.Settings.openSettings();
    }
  });
});
