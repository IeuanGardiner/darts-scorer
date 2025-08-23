// Mobile-only global footer navigation
// Adds fixed bottom nav with Home, Quick Play, and Settings buttons

document.addEventListener('DOMContentLoaded', () => {
  const footer = document.createElement('nav');
  footer.className = 'fixed bottom-0 inset-x-0 z-50 bg-card text-card-foreground border-t border-border';
  footer.innerHTML = `
    <div class="mx-auto max-w-5xl flex items-center justify-between px-4 py-2">
      <a href="index.html" aria-label="Home" class="p-2 rounded-md focus:outline-none focus:ring">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 9.75L12 4l9 5.75V20a1 1 0 01-1 1h-5a1 1 0 01-1-1v-4h-4v4a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z" />
        </svg>
      </a>
      <a href="quickplay.html" aria-label="Quick Play" class="p-2 rounded-md focus:outline-none focus:ring">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.5l13.5 6.5-13.5 6.5V5.5z" />
        </svg>
      </a>
      <button id="footerSettingsButton" type="button" aria-label="Settings" class="p-2 rounded-md focus:outline-none focus:ring">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.591 1.054c1.543-.895 3.37.932 2.475 2.475a1.724 1.724 0 001.055 2.592c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.054 2.591c.895 1.543-.932 3.37-2.475 2.475a1.724 1.724 0 00-2.592 1.055c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.591-1.054c-1.543.895-3.37-.932-2.475-2.475a1.724 1.724 0 00-1.055-2.592c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.054-2.591c-.895-1.543.932-3.37 2.475-2.475a1.724 1.724 0 002.592-1.055z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(footer);

  const setFooterHeight = () => {
    const h = footer.offsetHeight;
    document.body.style.paddingBottom = `${h}px`;
  };
  setFooterHeight();
  window.addEventListener('load', setFooterHeight);
  window.addEventListener('resize', setFooterHeight);

  const settingsBtn = footer.querySelector('#footerSettingsButton');
  settingsBtn.addEventListener('click', () => {
    if (window.Settings && typeof window.Settings.openSettings === 'function') {
      window.Settings.openSettings();
    }
  });
});

