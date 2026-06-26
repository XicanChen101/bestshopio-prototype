/* Checkout · Contact Information (PRD §5.3) — email, sign-in, marketing opt-in.
   Reuses the current checkout contact logic; this section restyles + configures
   labels. Email is required and validated by the existing pipeline. */
(function () {
  if (!window.OS) return;
  const { esc } = OS;

  OS.register('checkout-contact', {
    name: 'Contact Information', icon: 'user',
    schema: [
      { key: 'heading', label: 'Heading', control: 'text', default: 'Contact', placeholder: 'Contact' },
      { key: 'email_placeholder', label: 'Email placeholder', control: 'text', default: 'Email' },
      { key: 'show_sign_in_link', label: 'Show sign in link', control: 'toggle', default: true },
      { key: 'sign_in_text', label: 'Sign in text', control: 'text', default: 'Sign in' },
    ],
    render(s) {
      const signin = s.show_sign_in_link !== false
        ? '<a class="ck-link">' + esc(s.sign_in_text || 'Sign in') + '</a>' : '';
      return '<div class="cksec ck-contact">' +
        '<div class="ck-top"><h3 class="ck-h">' + esc(s.heading || 'Contact') + '</h3>' + signin + '</div>' +
        '<div class="ck-field"><input class="ck-input" type="email" placeholder="' + esc(s.email_placeholder || 'Email') + '"></div>' +
      '</div>';
    },
  });
})();
