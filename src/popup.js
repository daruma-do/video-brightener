const enabledEl = document.getElementById('enabled');
const strengthEl = document.getElementById('strength');
const strengthLabelEl = document.getElementById('strengthLabel');
const presetButtons = document.querySelectorAll('.preset');

const STRENGTH_MIN_EXP = 0.3;
const STRENGTH_MAX_EXP = 1.0;

function strengthToExponent(strength) {
  const ratio = strength / 100;
  return STRENGTH_MAX_EXP - ratio * (STRENGTH_MAX_EXP - STRENGTH_MIN_EXP);
}

function exponentToStrength(exponent) {
  const clamped = Math.max(STRENGTH_MIN_EXP, Math.min(STRENGTH_MAX_EXP, exponent));
  return Math.round(((STRENGTH_MAX_EXP - clamped) / (STRENGTH_MAX_EXP - STRENGTH_MIN_EXP)) * 100);
}

function updateLabel(exponent) {
  let label;
  if (exponent >= 0.9) label = 'OFF相当';
  else if (exponent >= 0.7) label = '弱';
  else if (exponent >= 0.55) label = '中';
  else if (exponent >= 0.4) label = '強';
  else label = '最強';
  strengthLabelEl.textContent = label;
}

async function init() {
  const data = await chrome.storage.sync.get({ enabled: true, exponent: 0.55 });
  enabledEl.checked = data.enabled;
  strengthEl.value = exponentToStrength(data.exponent);
  updateLabel(data.exponent);

  enabledEl.addEventListener('change', () => {
    chrome.storage.sync.set({ enabled: enabledEl.checked });
  });

  strengthEl.addEventListener('input', () => {
    const exponent = strengthToExponent(parseFloat(strengthEl.value));
    chrome.storage.sync.set({ exponent });
    updateLabel(exponent);
  });

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const exponent = parseFloat(btn.dataset.exp);
      chrome.storage.sync.set({ exponent });
      strengthEl.value = exponentToStrength(exponent);
      updateLabel(exponent);
    });
  });
}

init();
