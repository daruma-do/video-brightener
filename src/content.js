(() => {
  const FILTER_ID = 'vb-gamma';
  const SVG_ID = 'vb-svg';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const PREV_FILTER_ATTR = 'data-vb-prev-filter';

  let settings = { enabled: true, exponent: 0.65, contrast: 1.10 };

  function ensureFilter() {
    if (document.getElementById(SVG_ID)) return;

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.id = SVG_ID;
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none;visibility:hidden';

    const filter = document.createElementNS(SVG_NS, 'filter');
    filter.id = FILTER_ID;
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    // Pass 1: gamma lift (brighten shadows)
    const gammaXfer = document.createElementNS(SVG_NS, 'feComponentTransfer');
    gammaXfer.setAttribute('result', 'gamma');
    ['feFuncR', 'feFuncG', 'feFuncB'].forEach(tag => {
      const fn = document.createElementNS(SVG_NS, tag);
      fn.setAttribute('type', 'gamma');
      fn.setAttribute('amplitude', '1');
      fn.setAttribute('exponent', String(settings.exponent));
      fn.setAttribute('offset', '0');
      gammaXfer.appendChild(fn);
    });
    filter.appendChild(gammaXfer);

    // Pass 2: linear contrast (output = slope * input + intercept, pivot at 0.5)
    const contrastXfer = document.createElementNS(SVG_NS, 'feComponentTransfer');
    contrastXfer.setAttribute('in', 'gamma');
    const intercept = 0.5 * (1 - settings.contrast);
    ['feFuncR', 'feFuncG', 'feFuncB'].forEach(tag => {
      const fn = document.createElementNS(SVG_NS, tag);
      fn.setAttribute('type', 'linear');
      fn.setAttribute('slope', String(settings.contrast));
      fn.setAttribute('intercept', String(intercept));
      contrastXfer.appendChild(fn);
    });
    filter.appendChild(contrastXfer);

    svg.appendChild(filter);
    (document.body || document.documentElement).appendChild(svg);
  }

  function syncFilterValues() {
    const filter = document.getElementById(FILTER_ID);
    if (!filter) return;
    const transfers = filter.querySelectorAll('feComponentTransfer');
    if (transfers.length < 2) return;
    transfers[0].querySelectorAll('feFuncR, feFuncG, feFuncB').forEach(fn => {
      fn.setAttribute('exponent', String(settings.exponent));
    });
    const intercept = 0.5 * (1 - settings.contrast);
    transfers[1].querySelectorAll('feFuncR, feFuncG, feFuncB').forEach(fn => {
      fn.setAttribute('slope', String(settings.contrast));
      fn.setAttribute('intercept', String(intercept));
    });
  }

  function applyToVideos() {
    const videos = document.querySelectorAll('video');
    const filterUrl = `url(#${FILTER_ID})`;
    videos.forEach(v => {
      if (settings.enabled) {
        if (!v.hasAttribute(PREV_FILTER_ATTR)) {
          v.setAttribute(PREV_FILTER_ATTR, v.style.filter || '');
        }
        if (v.style.filter !== filterUrl) {
          v.style.filter = filterUrl;
        }
      } else if (v.hasAttribute(PREV_FILTER_ATTR)) {
        v.style.filter = v.getAttribute(PREV_FILTER_ATTR);
        v.removeAttribute(PREV_FILTER_ATTR);
      }
    });
  }

  let scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      ensureFilter();
      applyToVideos();
    });
  }

  function startObserver() {
    const observer = new MutationObserver(scheduleApply);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  async function loadSettings() {
    try {
      settings = await chrome.storage.sync.get({
        enabled: true,
        exponent: 0.65,
        contrast: 1.10
      });
    } catch (_) {
      // Use defaults if storage unavailable
    }
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    let needSync = false;
    if (changes.enabled) settings.enabled = changes.enabled.newValue;
    if (changes.exponent) {
      settings.exponent = changes.exponent.newValue;
      needSync = true;
    }
    if (changes.contrast) {
      settings.contrast = changes.contrast.newValue;
      needSync = true;
    }
    if (needSync) syncFilterValues();
    applyToVideos();
  });

  async function init() {
    await loadSettings();
    const start = () => {
      ensureFilter();
      applyToVideos();
      startObserver();
    };
    if (document.body) {
      start();
    } else {
      document.addEventListener('DOMContentLoaded', start, { once: true });
    }
  }

  init();
})();
