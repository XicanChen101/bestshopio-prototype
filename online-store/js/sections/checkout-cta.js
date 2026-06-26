/* Checkout · CTA (PRD §5.7) — the final pay / submit button.
   Reuses the current order-submit logic; this section adds basic copy & style
   config. Full-width by default; disabled while coupon / shipping recalculates. */
(function () {
  if (!window.OS) return;
  const { esc } = OS;

  OS.register('checkout-cta', {
    name: 'CTA', icon: 'lock',
    schema: [
      { key: 'button_text', label: 'Button text', control: 'text', default: 'PAY NOW', placeholder: 'PAY NOW' },
      { key: 'button_full_width', label: 'Full width', control: 'toggle', default: true },
      { key: 'button_background', label: 'Button background', control: 'color', default: '', info: 'Leave empty to inherit Checkout settings → Button.' },
      { key: 'button_text_color', label: 'Button text color', control: 'color', default: '#FFFFFF' },
      { key: 'button_border_radius', label: 'Button radius', control: 'range', min: 0, max: 40, step: 1, unit: 'px', default: 6 },
      { key: 'loading_text', label: 'Loading text', control: 'text', default: 'Processing...' },
    ],
    render(s) {
      const bg = s.button_background || 'var(--ck-btn-bg)';
      const txt = s.button_text_color || 'var(--ck-btn-text)';
      const rad = (s.button_border_radius == null ? 6 : s.button_border_radius) + 'px';
      const full = s.button_full_width !== false;
      const style = 'background:' + bg + ';color:' + txt + ';border-radius:' + rad + (full ? ';width:100%' : ';width:auto;padding:0 40px');
      return '<div class="cksec ck-cta">' +
        '<button class="ck-cta-btn" type="button" data-ck-cta data-label="' + esc(s.button_text || 'PAY NOW') + '" data-loading="' + esc(s.loading_text || 'Processing...') + '" style="' + style + '">' + esc(s.button_text || 'PAY NOW') + '</button>' +
        '<div class="ck-terms">By placing your order you agree to our Terms of Service and Privacy Policy.</div>' +
      '</div>';
    },
    hydrate(el) {
      const btn = el.querySelector('[data-ck-cta]'); if (!btn) return;
      btn.addEventListener('click', () => {
        if (btn.classList.contains('loading')) return;
        btn.classList.add('loading');
        const label = btn.getAttribute('data-label'); btn.textContent = btn.getAttribute('data-loading') || 'Processing...';
        setTimeout(() => { btn.classList.remove('loading'); btn.textContent = label; }, 1400);
      });
    },
  });
})();
