// Settings utilities and shared components

export const DEFAULT_SETTINGS = {
  favouriteDouble: 32,
  theme: "system",
  sound: false,
};

const LS_SETTINGS_KEY = "dartscorer_settings_v1";

export function loadSettings() {
  try {
    const raw = localStorage.getItem(LS_SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s) {
  try {
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(s));
  } catch {}
}

export function useTheme(setting) {
  React.useEffect(() => {
    const root = document.documentElement;
    const systemDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldDark = setting === "dark" || (setting === "system" && systemDark);
    root.classList.toggle("dark", shouldDark);
  }, [setting]);
}

export function useBeep(enabled) {
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
      o.type = "triangle";
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

const SettingsContext = React.createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = React.useState(() => loadSettings());
  React.useEffect(() => saveSettings(settings), [settings]);
  useTheme(settings.theme);
  const playBeep = useBeep(settings.sound);
  const value = React.useMemo(
    () => ({ settings, setSettings, playBeep }),
    [settings, playBeep]
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return React.useContext(SettingsContext);
}

// UI components for settings overlay
function TwButton({ className = "", children, variant = "solid", size = "md", ...props }) {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-3 text-lg",
  };
  const variants = {
    solid: "bg-indigo-600 text-white hover:opacity-90",
    outline: "border border-border bg-transparent hover:bg-muted",
    ghost: "bg-transparent hover:bg-muted",
  };
  return (
    <button
      className={`rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl border border-border bg-card text-card-foreground shadow ${className}`}>
      {children}
    </div>
  );
}

function CardBody({ className = "", children }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

const ALL_DOUBLES = Array.from({ length: 20 }, (_, i) => (i + 1) * 2).concat([50]);

export function SettingsOverlay({ open, onClose }) {
  const { settings, setSettings } = useSettings();
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-background text-foreground p-4 z-50 overflow-auto"
      role="dialog"
      aria-modal
    >
      <div className="max-w-md mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Settings</div>
          <TwButton size="sm" variant="outline" onClick={onClose}>Exit</TwButton>
        </div>
        <Card>
          <CardBody className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">Favourite double</div>
                <div className="text-xs opacity-70">Bias checkout routes (2..40 even, or 50 for Bull)</div>
              </div>
              <select
                aria-label="Favourite double"
                value={settings.favouriteDouble}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, favouriteDouble: parseInt(e.target.value, 10) }))
                }
                className="rounded-xl border bg-background px-3 py-2"
              >
                {ALL_DOUBLES.map((d) => (
                  <option key={d} value={d}>
                    {d === 50 ? "Bull (50)" : `D${d / 2} (${d})`}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">Theme</div>
                <div className="text-xs opacity-70">Follows system by default</div>
              </div>
              <div className="flex gap-2">
                <TwButton
                  variant={settings.theme === "system" ? "solid" : "outline"}
                  onClick={() => setSettings((s) => ({ ...s, theme: "system" }))}
                >
                  System
                </TwButton>
                <TwButton
                  variant={settings.theme === "light" ? "solid" : "outline"}
                  onClick={() => setSettings((s) => ({ ...s, theme: "light" }))}
                >
                  Light
                </TwButton>
                <TwButton
                  variant={settings.theme === "dark" ? "solid" : "outline"}
                  onClick={() => setSettings((s) => ({ ...s, theme: "dark" }))}
                >
                  Dark
                </TwButton>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">Sound on checkout</div>
                <div className="text-xs opacity-70">Tiny beep when leg is won</div>
              </div>
              <TwButton
                variant={settings.sound ? "solid" : "outline"}
                onClick={() => setSettings((s) => ({ ...s, sound: !s.sound }))}
              >
                {settings.sound ? "On" : "Off"}
              </TwButton>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export function GlobalHeader() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <header className="flex items-center justify-between">
        <div className="text-lg font-semibold">Dart Trainer</div>
        <TwButton
          size="sm"
          variant="outline"
          onClick={() => setOpen(true)}
          aria-label="Settings"
        >
          <span aria-hidden="true">⚙️</span>
        </TwButton>
      </header>
      <SettingsOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}

