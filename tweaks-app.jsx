/* ════════════════════════════════════════════════════════════
   Tweaks island — drives the vanilla document via window.PF
   ════════════════════════════════════════════════════════════ */
const HERO_LABEL = { a: 'Split', b: 'Editorial', c: 'Portrait' };
const HERO_VALUE = { Split: 'a', Editorial: 'b', Portrait: 'c' };
const ACC_LABEL = { duo: 'Duo', orange: 'Orange', blue: 'Blue' };
const ACC_VALUE = { Duo: 'duo', Orange: 'orange', Blue: 'blue' };
const FONT_LABEL = { grotesk: 'Grotesk', neutral: 'Neutral' };
const FONT_VALUE = { Grotesk: 'grotesk', Neutral: 'neutral' };

const PF = window.PF;
const docAttr = (k) => document.documentElement.getAttribute('data-' + k);

const TWEAK_DEFAULTS = {
  theme: docAttr('theme') === 'light' ? 'Light' : 'Dark',
  accent: ACC_LABEL[docAttr('accent')] || 'Duo',
  hero: HERO_LABEL[docAttr('hero')] || 'Split',
  font: FONT_LABEL[docAttr('font')] || 'Grotesk',
};

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // push tweak changes -> document
  React.useEffect(() => { PF.apply('theme', t.theme === 'Light' ? 'light' : 'dark'); }, [t.theme]);
  React.useEffect(() => { PF.apply('accent', ACC_VALUE[t.accent]); }, [t.accent]);
  React.useEffect(() => { PF.apply('hero', HERO_VALUE[t.hero]); }, [t.hero]);
  React.useEffect(() => { PF.apply('font', FONT_VALUE[t.font]); }, [t.font]);

  // pull in-page control changes (theme toggle, hero switcher) -> panel UI
  React.useEffect(() => {
    const onChange = (e) => {
      const { key, val } = e.detail;
      if (key === 'theme') setTweak('theme', val === 'light' ? 'Light' : 'Dark');
      if (key === 'hero') setTweak('hero', HERO_LABEL[val]);
      if (key === 'accent') setTweak('accent', ACC_LABEL[val]);
      if (key === 'font') setTweak('font', FONT_LABEL[val]);
    };
    document.addEventListener('pf-change', onChange);
    return () => document.removeEventListener('pf-change', onChange);
  }, [setTweak]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Appearance" />
      <TweakRadio label="Mode" value={t.theme} options={['Dark', 'Light']}
        onChange={(v) => setTweak('theme', v)} />
      <TweakRadio label="Accent" value={t.accent} options={['Duo', 'Orange', 'Blue']}
        onChange={(v) => setTweak('accent', v)} />
      <TweakSection label="Layout" />
      <TweakRadio label="Hero style" value={t.hero} options={['Split', 'Editorial', 'Portrait']}
        onChange={(v) => setTweak('hero', v)} />
      <TweakRadio label="Type" value={t.font} options={['Grotesk', 'Neutral']}
        onChange={(v) => setTweak('font', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<TweaksApp />);
