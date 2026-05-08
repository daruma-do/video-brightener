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

function updateBrightnessLabel(exp) {
  let label;
  if (exp >= 0.9) label = 'OFF相当';
  else if (exp >= 0.7) label = '弱';
  else if (exp >= 0.55) label = '中';
  else if (exp >= 0.4) label = '強';
  else label = '最強';
  brightnessLabelEl.textContent = label;
}

function updateContrastLabel(c) {
  const pct = Math.round((c - 1.0) * 100);
  contrastLabelEl.textContent = pct === 0 ? '標準' : `+${pct}%`;
}

async function init() {
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

init();
