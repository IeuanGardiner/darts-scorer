// Mobile-only global header with full-screen menu screen
document.addEventListener('DOMContentLoaded', () => {
  const header = document.createElement('header');
  header.className = 'fixed top-0 inset-x-0 z-50 bg-card text-card-foreground border-b border-border';
  header.innerHTML = `
    <div class="mx-auto max-w-5xl flex items-center justify-between p-4">
      <a href="mode-select.html" class="flex items-center" aria-label="Go to mode select">
        <img src="images/DartUpLogoSVG.svg" alt="Darts Scorer Logo" class="h-16 w-auto" />
      </a>
      <div class="flex items-center gap-2">
        <button id="settingsButton" type="button" aria-label="Settings" class="p-2 rounded-md focus:outline-none focus:ring">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.591 1.054c1.543-.895 3.37.932 2.475 2.475a1.724 1.724 0 001.055 2.592c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.054 2.591c.895 1.543-.932 3.37-2.475 2.475a1.724 1.724 0 00-2.592 1.055c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.591-1.054c-1.543.895-3.37-.932-2.475-2.475a1.724 1.724 0 00-1.055-2.592c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.054-2.591c-.895-1.543.932-3.37 2.475-2.475a1.724 1.724 0 002.592-1.055z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>
        <button id="menuButton" type="button" aria-label="Open menu" aria-controls="menuOverlay" aria-expanded="false" class="p-2 rounded-md focus:outline-none focus:ring">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Full-screen menu screen (sits under the header) -->
    <div id="menuOverlay"
         class="fixed inset-0 z-40 hidden bg-card/80 backdrop-blur text-card-foreground"
         role="dialog" aria-modal="true" aria-labelledby="menuTitle">
      <div class="mx-auto max-w-5xl px-4 pb-10 flex flex-col gap-4">
        <div class="flex items-center justify-between mb-4">
          <h2 id="menuTitle" class="text-2xl font-semibold">Menu</h2>
          <button id="menuExit" class="px-3 py-2 rounded-xl border border-border" aria-label="Close menu">Exit</button>
        </div>
        <nav id="globalMenu" class="flex flex-col gap-2" aria-label="Global">
          <a href="quickplay.html" class="block px-4 py-3 rounded text-lg hover:bg-muted focus:bg-muted focus:outline-none">Quick Play</a>
          <a href="training-mode.html" class="block px-4 py-3 rounded text-lg hover:bg-muted focus:bg-muted focus:outline-none">Training Mode</a>
          <a href="#" data-soon="Multiplayer" class="block px-4 py-3 rounded text-lg hover:bg-muted focus:bg-muted focus:outline-none">Multiplayer</a>
        </nav>
      </div>
    </div>
  `;

  document.body.prepend(header);

  const menuBtn   = header.querySelector('#menuButton');
  const settings  = header.querySelector('#settingsButton');
  const overlay   = header.querySelector('#menuOverlay');
  const menu      = header.querySelector('#globalMenu');
  const exitBtn   = header.querySelector('#menuExit');
  const supportsInert = 'inert' in document.createElement('div');

  // Hide everything except header when menu is open
  const toggleSiblingsHidden = (hide) => {
    [...document.body.children].forEach(el => {
      if (el === header) return;
      if (hide) {
        el.setAttribute('aria-hidden', 'true');
        if (supportsInert) el.inert = true;
      } else {
        el.removeAttribute('aria-hidden');
        if (supportsInert) el.inert = false;
      }
    });
  };

  // Keep overlay starting below the header
  const setOverlayPadding = () => {
    const h = header.offsetHeight;
    overlay.style.paddingTop = `${h}px`;
    document.documentElement.style.setProperty('--header-h', `${h}px`);
  };
  setOverlayPadding();
  window.addEventListener('load', setOverlayPadding);
  window.addEventListener('resize', setOverlayPadding);

  const lockScroll = (lock) => {
    document.documentElement.classList.toggle('overflow-hidden', lock);
    document.body.classList.toggle('overflow-hidden', lock);
  };

  const firstFocusable = () => overlay.querySelector('a,button,[tabindex]:not([tabindex="-1"])');

  function openMenu() {
    setOverlayPadding();
    overlay.classList.remove('hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    toggleSiblingsHidden(true);
    lockScroll(true);
    const f = firstFocusable();
    if (f) f.focus();
  }

  function closeMenu({ returnFocus = true } = {}) {
    overlay.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    toggleSiblingsHidden(false);
    lockScroll(false);
    if (returnFocus) menuBtn.focus();
  }

  const isOpen = () => menuBtn.getAttribute('aria-expanded') === 'true';

  menuBtn.addEventListener('click', () => (isOpen() ? closeMenu({ returnFocus: false }) : openMenu()));
  exitBtn.addEventListener('click', () => closeMenu());

  // Close with ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) closeMenu();
  });

  // Click a link
  menu.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    if (a.dataset.soon) {
      e.preventDefault();
      alert(`${a.dataset.soon} coming soon!`);
      closeMenu({ returnFocus: false });
      return;
    }
    closeMenu({ returnFocus: false });
  });

  // Settings button
  settings.addEventListener('click', () => {
    if (window.Settings && typeof window.Settings.openSettings === 'function') {
      window.Settings.openSettings();
    }
  });
});

