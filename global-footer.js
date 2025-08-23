// Mobile-only global footer navigation
// Adds a bottom navigation bar with Home, Quick Play, and Settings icons

document.addEventListener('DOMContentLoaded', () => {
  const footer = document.createElement('nav');
  footer.className = 'fixed bottom-0 inset-x-0 z-50 bg-card text-card-foreground border-t border-border';
  footer.innerHTML = `
    <div class="mx-auto max-w-5xl flex items-center justify-between p-2">
      <a href="index.html" aria-label="Home" class="p-2 rounded-md focus:outline-none focus:ring">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 22V12h6v10" />
        </svg>
      </a>
      <a href="quickplay.html" aria-label="Quick Play" class="p-2 rounded-md focus:outline-none focus:ring">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 5v14l11-7-11-7z" />
        </svg>
      </a>
      <button id="footerSettingsButton" type="button" aria-label="Settings" class="p-2 rounded-md focus:outline-none focus:ring">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.591 1.054c1.543-.895 3.37.932 2.475 2.475a1.724 1.724 0 001.055 2.592c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.054 2.591c.895 1.543-.932 3.37-2.475 2.475a1.724 1.724 0 00-2.592 1.055c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.591-1.054c-1.543.895-3.37-.932-2.475-2.475a1.724 1.724 0 00-1.055-2.592c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.054-2.591c-.895-1.543.932-3.37 2.475-2.475a1.724 1.724 0 002.592-1.055z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(footer);

  const setFooterHeight = () => {
    const h = footer.offsetHeight;
    document.documentElement.style.setProperty('--footer-h', `${h}px`);
  };
  setFooterHeight();
  window.addEventListener('load', setFooterHeight);
  window.addEventListener('resize', setFooterHeight);

  const settingsBtn = footer.querySelector('#footerSettingsButton');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      if (window.Settings && typeof window.Settings.openSettings === 'function') {
        window.Settings.openSettings();
      }
    });
  }
});

