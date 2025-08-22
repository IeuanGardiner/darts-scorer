(function(){
  const LS_SETTINGS_KEY = 'dartscorer_settings_v1';
  const DEFAULT_SETTINGS = { favouriteDouble: 32, theme: 'system', sound: false };
  const ALL_DOUBLES = Array.from({ length: 20 }, (_, i) => (i + 1) * 2).concat([50]);

  function loadSettings() {
    try {
      const raw = localStorage.getItem(LS_SETTINGS_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  function saveSettings(s) {
    try {
      localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(s));
    } catch {}
  }

  let currentSettings = loadSettings();

  function applyTheme(setting) {
    const root = document.documentElement;
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = setting === 'dark' || (setting === 'system' && systemDark);
    root.classList.toggle('dark', shouldDark);
  }

  function setSettings(update) {
    const next = typeof update === 'function' ? update(currentSettings) : update;
    currentSettings = { ...currentSettings, ...next };
    saveSettings(currentSettings);
    applyTheme(currentSettings.theme);
    document.dispatchEvent(new CustomEvent('settingschange', { detail: currentSettings }));
  }

  function getSettings() {
    return currentSettings;
  }

  function useSettings() {
    const [settings, setState] = React.useState(getSettings());
    React.useEffect(() => {
      const handler = (e) => setState(e.detail);
      document.addEventListener('settingschange', handler);
      return () => document.removeEventListener('settingschange', handler);
    }, []);
    return [settings, setSettings];
  }

  function useTheme(setting) {
    React.useEffect(() => {
      applyTheme(setting);
    }, [setting]);
  }

  function useBeep(enabled) {
    const ctxRef = React.useRef(null);
    function play() {
      if (!enabled) return;
      try {
        if (!ctxRef.current) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          ctxRef.current = new AC();
        }
        const ctx = ctxRef.current;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = 880;
        g.gain.value = 0.0025;
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        setTimeout(() => o.stop(), 120);
      } catch {}
    }
    return play;
  }

  let overlayEl, selectEl, systemBtn, lightBtn, darkBtn, soundBtn;

  function updateOverlayUI() {
    if (!overlayEl) return;
    const s = getSettings();
    if (selectEl) selectEl.value = String(s.favouriteDouble);
    const buttons = [systemBtn, lightBtn, darkBtn];
    const themes = ['system', 'light', 'dark'];
    buttons.forEach((btn, idx) => {
      if (!btn) return;
      if (s.theme === themes[idx]) {
        btn.classList.add('bg-foreground', 'text-background');
        btn.classList.remove('border', 'border-border');
      } else {
        btn.classList.remove('bg-foreground', 'text-background');
        btn.classList.add('border', 'border-border');
      }
    });
    if (soundBtn) {
      soundBtn.textContent = s.sound ? 'On' : 'Off';
      if (s.sound) {
        soundBtn.classList.add('bg-foreground', 'text-background');
        soundBtn.classList.remove('border', 'border-border');
      } else {
        soundBtn.classList.remove('bg-foreground', 'text-background');
        soundBtn.classList.add('border', 'border-border');
      }
    }
  }

  function buildOverlay() {
    overlayEl = document.createElement('div');
    overlayEl.className = 'hidden fixed inset-0 bg-background text-foreground p-4 z-50 overflow-auto';
    overlayEl.setAttribute('role', 'dialog');
    overlayEl.setAttribute('aria-modal', 'true');
    overlayEl.innerHTML = `
      <div class="max-w-md mx-auto flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold">Settings</div>
          <button id="settingsExit" class="px-3 py-2 rounded-xl border border-border">Exit</button>
        </div>
        <div class="rounded-2xl border border-border bg-card text-card-foreground">
          <div class="p-4 flex flex-col gap-3">
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="text-sm font-medium">Favourite double</div>
                <div class="text-xs opacity-70">Bias checkout routes (2..40 even, or 50 for Bull)</div>
              </div>
              <select id="favDoubleSelect" class="rounded-xl border bg-background px-3 py-2"></select>
            </div>
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="text-sm font-medium">Theme</div>
                <div class="text-xs opacity-70">Follows system by default</div>
              </div>
              <div class="flex gap-2">
                <button id="themeSystem" class="px-3 py-2 rounded-xl border border-border">System</button>
                <button id="themeLight" class="px-3 py-2 rounded-xl border border-border">Light</button>
                <button id="themeDark" class="px-3 py-2 rounded-xl border border-border">Dark</button>
              </div>
            </div>
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="text-sm font-medium">Sound on checkout</div>
                <div class="text-xs opacity-70">Tiny beep when leg is won</div>
              </div>
              <button id="soundToggle" class="px-3 py-2 rounded-xl border border-border">Off</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlayEl);
    selectEl = overlayEl.querySelector('#favDoubleSelect');
    systemBtn = overlayEl.querySelector('#themeSystem');
    lightBtn = overlayEl.querySelector('#themeLight');
    darkBtn = overlayEl.querySelector('#themeDark');
    soundBtn = overlayEl.querySelector('#soundToggle');
    overlayEl.querySelector('#settingsExit').addEventListener('click', closeSettings);
    ALL_DOUBLES.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d === 50 ? 'Bull (50)' : `D${d/2} (${d})`;
      selectEl.appendChild(opt);
    });
    selectEl.addEventListener('change', (e) => setSettings({ favouriteDouble: parseInt(e.target.value, 10) }));
    systemBtn.addEventListener('click', () => setSettings({ theme: 'system' }));
    lightBtn.addEventListener('click', () => setSettings({ theme: 'light' }));
    darkBtn.addEventListener('click', () => setSettings({ theme: 'dark' }));
    soundBtn.addEventListener('click', () => setSettings((s) => ({ sound: !s.sound })));
  }

  function openSettings() {
    if (!overlayEl) buildOverlay();
    updateOverlayUI();
    overlayEl.classList.remove('hidden');
  }

  function closeSettings() {
    if (overlayEl) overlayEl.classList.add('hidden');
  }

  document.addEventListener('settingschange', updateOverlayUI);

  applyTheme(currentSettings.theme);

  window.Settings = {
    DEFAULT_SETTINGS,
    loadSettings,
    saveSettings,
    useTheme,
    useBeep,
    useSettings,
    openSettings,
    setSettings,
    getSettings
  };
})();
