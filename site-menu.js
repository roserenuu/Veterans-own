(() => {
  const toggle = document.querySelector('[data-site-menu-toggle]');
  const drawer = document.querySelector('[data-site-menu-drawer]');
  const closeButton = document.querySelector('[data-site-menu-close]');
  const backdrop = document.querySelector('[data-site-menu-backdrop]');

  if (!toggle || !drawer || !backdrop) return;

  function openMenu() {
    toggle.classList.add('open');
    drawer.classList.add('open');
    backdrop.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('open');
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (toggle.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeButton) closeButton.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);
  drawer.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
})();
