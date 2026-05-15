const enabledEl = document.getElementById('enabled');
const brightnessEl = document.getElementById('brightness');
const brightnessLabelEl = document.getElementById('brightnessLabel');
const contrastEl = document.getElementById('contrast');
const contrastLabelEl = document.getElementById('contrastLabel');
const presetButtons = document.querySelectorAll('.preset');

const BRIGHT_MIN_EXP = 0.3;
const BRIGHT_MAX_EXP = 1.0;
const CONTRAST_MIN = 1.0;
const CONTRAST_MAX = 1.5;

function brightnessToExponent(v) {
  return BRIGHT_MAX_EXP - (v / 100) * (BRIGHT_MAX_EXP - BRIGHT_MIN_EXP);
}

function exponentToBrightness(exp) {
  const c = Math.max(BRIGHT_MIN_EXP, Math.min(BRIGHT_MAX_EXP, exp));
  return Math.round(((BRIGHT_MAX_EXP - c) / (BRIGHT_MAX_EXP - BRIGHT_MIN_EXP)) * 100);
}

function contrastSliderToValue(v) {
  return CONTRAST_MIN + (v / 100) * (CONTRAST_MAX - CONTRAST_MIN);
}

function contrastValueToSlider(c) {
  const cl = Math.max(CONTRAST_MIN, Math.min(CONTRAST_MAX, c));
  return Math.round(((cl - CONTRAST_MIN) / (CONTRAST_MAX - CONTRAST_MIN)) * 100);
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const msg = chrome.i18n.getMessage(el.dataset.i18n);
    if (msg) el.textContent = msg;
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const msg = chrome.i18n.getMessage(el.dataset.i18nTitle);
    if (msg) el.title = msg;
  });
  document.documentElement.lang = chrome.i18n.getUILanguage();
}

function updateBrightnessLabel(exp) {
  let key;
  if (exp >= 0.9) key = 'levelOff';
  else if (exp >= 0.7) key = 'levelLow';
  else if (exp >= 0.55) key = 'levelMedium';
  else if (exp >= 0.4) key = 'levelStrong';
  else key = 'levelMax';
  brightnessLabelEl.textContent = chrome.i18n.getMessage(key);
}

function updateContrastLabel(c) {
  const pct = Math.round((c - 1.0) * 100);
  contrastLabelEl.textContent = pct === 0
    ? chrome.i18n.getMessage('contrastNormal')
    : `+${pct}%`;
}

async function init() {
  applyI18n();

  const data = await chrome.storage.sync.get({
    enabled: true,
    exponent: 0.65,
    contrast: 1.10
  });
  enabledEl.checked = data.enabled;
  brightnessEl.value = exponentToBrightness(data.exponent);
  contrastEl.value = contrastValueToSlider(data.contrast);
  updateBrightnessLabel(data.exponent);
  updateContrastLabel(data.contrast);

  enabledEl.addEventListener('change', () => {
    chrome.storage.sync.set({ enabled: enabledEl.checked });
  });

  brightnessEl.addEventListener('input', () => {
    const exponent = brightnessToExponent(parseFloat(brightnessEl.value));
    chrome.storage.sync.set({ exponent });
    updateBrightnessLabel(exponent);
  });

  contrastEl.addEventListener('input', () => {
    const contrast = contrastSliderToValue(parseFloat(contrastEl.value));
    chrome.storage.sync.set({ contrast });
    updateContrastLabel(contrast);
  });

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const exponent = parseFloat(btn.dataset.exp);
      const contrast = parseFloat(btn.dataset.con);
      chrome.storage.sync.set({ exponent, contrast });
      brightnessEl.value = exponentToBrightness(exponent);
      contrastEl.value = contrastValueToSlider(contrast);
      updateBrightnessLabel(exponent);
      updateContrastLabel(contrast);
    });
  });
}

// --- Per-site enablement (optional host permissions) ---------------------

// Convert a Chrome match pattern (e.g. "https://*.example.com/*") to a RegExp.
function matchPatternToRegExp(pattern) {
  const m = /^(\*|https?):\/\/([^/]+)(\/.*)$/.exec(pattern);
  if (!m) return null;
  const [, scheme, host, path] = m;
  const esc = s => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const schemePart = scheme === '*' ? 'https?' : scheme;
  let hostPart;
  if (host === '*') hostPart = '[^/]+';
  else if (host.startsWith('*.')) hostPart = '(?:[^/]+\\.)?' + esc(host.slice(2));
  else hostPart = esc(host);
  const pathPart = esc(path).replace(/\*/g, '.*');
  return new RegExp('^' + schemePart + '://' + hostPart + pathPart + '$');
}

// True when the URL is already covered by the bundled content_scripts.
function isBuiltinSite(url) {
  const cs = chrome.runtime.getManifest().content_scripts || [];
  return cs.some(entry => (entry.matches || []).some(p => {
    const re = matchPatternToRegExp(p);
    return re && re.test(url);
  }));
}

async function initSiteStatus() {
  const stateEl = document.getElementById('siteState');
  const actionEl = document.getElementById('siteAction');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab && tab.url;

  // Pages where no content script can run (chrome://, extension pages, http, etc.)
  if (!url || !url.startsWith('https://')) {
    stateEl.textContent = chrome.i18n.getMessage('siteUnsupported');
    stateEl.className = 'site-state muted';
    return;
  }

  // Sites covered by the bundled declaration are always on — nothing to toggle.
  if (isBuiltinSite(url)) {
    stateEl.textContent = chrome.i18n.getMessage('siteBuiltin');
    stateEl.className = 'site-state on';
    return;
  }

  const { protocol, host } = new URL(url);
  const pattern = `${protocol}//${host}/*`;
  const scriptId = 'vb-' + host.replace(/[^a-zA-Z0-9]/g, '-');
  let granted = await chrome.permissions.contains({ origins: [pattern] });

  function render() {
    if (granted) {
      stateEl.textContent = chrome.i18n.getMessage('siteEnabledState');
      stateEl.className = 'site-state on';
      actionEl.textContent = chrome.i18n.getMessage('siteDisableAction');
    } else {
      stateEl.textContent = '';
      stateEl.className = 'site-state';
      actionEl.textContent = chrome.i18n.getMessage('siteEnableAction');
    }
    actionEl.hidden = false;
  }
  render();

  actionEl.addEventListener('click', async () => {
    actionEl.disabled = true;
    try {
      if (!granted) {
        // permissions.request must run directly in the user-gesture handler.
        const ok = await chrome.permissions.request({ origins: [pattern] });
        if (!ok) return;
        granted = true;
        // Register so the filter also applies on future page loads.
        const existing = await chrome.scripting.getRegisteredContentScripts({ ids: [scriptId] });
        if (existing.length === 0) {
          await chrome.scripting.registerContentScripts([{
            id: scriptId,
            matches: [pattern],
            js: ['src/content.js'],
            runAt: 'document_idle',
            allFrames: true,
            persistAcrossSessions: true
          }]);
        }
        // Apply immediately to the current tab without a reload.
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            files: ['src/content.js']
          });
        } catch (_) {
          // Some tabs block injection; the registered script still covers reloads.
        }
      } else {
        const existing = await chrome.scripting.getRegisteredContentScripts({ ids: [scriptId] });
        if (existing.length > 0) {
          await chrome.scripting.unregisterContentScripts({ ids: [scriptId] });
        }
        await chrome.permissions.remove({ origins: [pattern] });
        granted = false;
      }
      render();
    } finally {
      actionEl.disabled = false;
    }
  });
}

init();
initSiteStatus();
