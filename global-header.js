// Injects a global header with a hamburger menu that toggles navigation links.
document.addEventListener('DOMContentLoaded', () => {
  const header = document.createElement('header');
  header.className = 'bg-card text-card-foreground border-b border-border';
  header.innerHTML = `
    <div class="max-w-5xl mx-auto flex items-center justify-between p-4">
      <a href="game-mode.html">
        <img src="images/DartUpLogoSVG.svg" alt="Darts Scorer Logo" class="h-8 w-auto" />
      </a>
      <div class="flex items-center gap-2">
        <button id="settingsButton" aria-label="Settings" class="p-2 rounded-md focus:outline-none focus:ring">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.591 1.054c1.543-.895 3.37.932 2.475 2.475a1.724 1.724 0 001.055 2.592c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.054 2.591c.895 1.543-.932 3.37-2.475 2.475a1.724 1.724 0 00-2.592 1.055c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.591-1.054c-1.543.895-3.37-.932-2.475-2.475a1.724 1.724 0 00-1.055-2.592c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.054-2.591c-.895-1.543.932-3.37 2.475-2.475a1.724 1.724 0 002.592-1.055z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button id="menuButton" aria-label="Menu" aria-controls="globalMenu" aria-expanded="false" class="p-2 rounded-md focus:outline-none focus:ring">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
    <nav id="globalMenu" class="hidden flex-col px-4 pb-4 space-y-2" role="navigation">
      <a href="quickplay.html" class="block px-3 py-2 rounded hover:bg-muted focus:bg-muted focus:outline-none">Quick Play</a>
      <a href="#" class="block px-3 py-2 rounded hover:bg-muted focus:bg-muted focus:outline-none" onclick="alert('Training mode coming soon!');return false;">Training Mode</a>
      <a href="#" class="block px-3 py-2 rounded hover:bg-muted focus:bg-muted focus:outline-none" onclick="alert('Multiplayer coming soon!');return false;">Multiplayer</a>
    </nav>
  `;

  document.body.prepend(header);

  const button = header.querySelector('#menuButton');
  const menu = header.querySelector('#globalMenu');
  const settingsBtn = header.querySelector('#settingsButton');

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('hidden', expanded);
  });

  settingsBtn.addEventListener('click', () => {
    if (window.Settings && typeof window.Settings.openSettings === 'function') {
      window.Settings.openSettings();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      button.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
      button.focus();
    }
  });
});
