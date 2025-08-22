// Injects a global header with a hamburger menu that toggles navigation links.
document.addEventListener('DOMContentLoaded', () => {
  const header = document.createElement('header');
  header.className = 'bg-card text-card-foreground border-b border-border';
  header.innerHTML = `
    <div class="max-w-5xl mx-auto flex items-center justify-between p-4">
      <a href="index.html" class="text-lg font-bold">Darts Scorer</a>
      <button id="menuButton" aria-label="Menu" aria-controls="globalMenu" aria-expanded="false" class="p-2 rounded-md focus:outline-none focus:ring">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
    <nav id="globalMenu" class="hidden flex-col px-4 pb-4 space-y-2" role="navigation">
      <a href="quickplay.html" class="block px-3 py-2 rounded hover:bg-muted focus:bg-muted focus:outline-none">Quick Play</a>
      <a href="#" class="block px-3 py-2 rounded hover:bg-muted focus:bg-muted focus:outline-none" onclick="alert('Training mode coming soon!');return false;">Training Mode</a>
      <a href="#" class="block px-3 py-2 rounded hover:bg-muted focus:bg-muted focus:outline-none" onclick="alert('Match mode coming soon!');return false;">Match</a>
    </nav>
  `;

  document.body.prepend(header);

  const button = header.querySelector('#menuButton');
  const menu = header.querySelector('#globalMenu');

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('hidden', expanded);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      button.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
      button.focus();
    }
  });
});
