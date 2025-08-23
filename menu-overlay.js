(function(){
  function buildMenuOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'menuOverlay';
    overlay.className = 'hidden fixed inset-0 bg-background text-foreground p-4 z-50 overflow-auto';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="max-w-md mx-auto flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold">Menu</div>
          <button id="menuExit" class="px-3 py-2 rounded-xl border border-border">Exit</button>
        </div>
        <div class="rounded-2xl border border-border bg-card text-card-foreground">
          <nav id="globalMenu" class="p-4 flex flex-col gap-2" aria-label="Global">
            <a href="quickplay.html" class="block px-4 py-3 rounded text-lg hover:bg-muted focus:bg-muted focus:outline-none">Quick Play</a>
            <a href="training-mode.html" class="block px-4 py-3 rounded text-lg hover:bg-muted focus:bg-muted focus:outline-none">Training Mode</a>
            <a href="#" data-soon="Multiplayer" class="block px-4 py-3 rounded text-lg hover:bg-muted focus:bg-muted focus:outline-none">Multiplayer</a>
          </nav>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  window.MenuOverlay = { buildMenuOverlay };
})();
